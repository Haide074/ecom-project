import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import xlsx
import useToast from '../store/useToast';
import { TableSkeleton } from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import './Admin.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const toast = useToast();

    // Export ALL orders to Excel
    const handleExportAll = () => {
        if (!orders || orders.length === 0) {
            toast.showToast('No orders to export', 'error');
            return;
        }

        const data = orders.map(order => ({
            'Order ID': order.orderNumber,
            'Date': new Date(order.createdAt).toLocaleDateString(),
            'Customer Name': order.customerName,
            'Email': order.customerEmail,
            'Phone': order.customerPhone,
            'Items Count': order.items?.length || 0,
            'Total Amount': order.totalAmount,
            'Status': order.status,
            'Payment Status': order.paymentStatus,
            'Address': `${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}`
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        XLSX.writeFile(wb, `All_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    // Export SINGLE order to Excel
    const handleExportSingle = (order) => {
        // Create summary sheet
        const summaryData = [{
            'Order ID': order.orderNumber,
            'Date': new Date(order.createdAt).toLocaleDateString(),
            'Customer Name': order.customerName,
            'Email': order.customerEmail,
            'Phone': order.customerPhone,
            'Address': `${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}`,
            'Total Amount': order.totalAmount,
            'Status': order.status
        }];

        // Create items sheet
        const itemsData = order.items.map(item => ({
            'Product': item.name || item.product?.name,
            'Quantity': item.quantity,
            'Price': item.price,
            'Subtotal': item.price * item.quantity
        }));

        const wb = XLSX.utils.book_new();

        const wsSummary = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Order Summary');

        const wsItems = XLSX.utils.json_to_sheet(itemsData);
        XLSX.utils.book_append_sheet(wb, wsItems, 'Order Items');

        XLSX.writeFile(wb, `Order_${order.orderNumber}.xlsx`);
    };

    const handlePrintOrder = (order) => {
        const printContent = `
            <html>
                <head>
                    <title>Invoice #${order.orderNumber}</title>
                    <style>
                        body { font-family: monospace; padding: 20px; }
                        h1 { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; }
                        .item { display: flex; justify-content: space-between; margin: 5px 0; }
                        .total { font-weight: bold; border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <h1>INVOICE</h1>
                    <p>Order: #${order.orderNumber}</p>
                    <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Customer: ${order.customerName}</p>
                    <hr/>
                    ${order.items.map(item => `
                        <div class="item">
                            <span>${item.name || item.product?.name} x${item.quantity}</span>
                            <span>Rs {item.price}</span>
                        </div>
                    `).join('')}
                    <div class="total">
                        Total: Rs {order.totalAmount}
                    </div>
                </body>
            </html>
        `;
        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Import API
            const { guestOrdersAPI } = await import('../services/api');

            const params = {};
            if (filter !== 'all') {
                params.status = filter;
            }

            const response = await guestOrdersAPI.getAllForAdmin(params);
            setOrders(response.data.data.orders || []);
        } catch (err) {
            console.error('Failed to load orders:', err);
            toast.showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // Import API
            const { guestOrdersAPI } = await import('../services/api');

            await guestOrdersAPI.updateStatus(orderId, { status: newStatus });
            toast.showToast(`Order status updated to ${newStatus}`, 'success');
            fetchOrders();
        } catch (err) {
            console.error('Failed to update order status:', err);
            toast.showToast('Failed to update order status', 'error');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="admin-orders">
                <div className="admin-table-container">
                    <TableSkeleton rows={8} columns={7} />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2 className="admin-table-title">Orders Management</h2>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                            onClick={handleExportAll}
                        >
                            📥 Download All
                        </button>
                    </div>
                    <div className="admin-table-actions">
                        <select
                            className="admin-form-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">🛒</div>
                        <h3 className="admin-empty-title">No Orders Found</h3>
                        <p className="admin-empty-description">
                            {filter !== 'all'
                                ? `No ${filter} orders at the moment`
                                : 'Orders will appear here once customers make purchases'}
                        </p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td style={{ fontWeight: 600 }}>
                                            #{order.orderNumber}
                                        </td>
                                        <td>{order.customerName || 'Guest'}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.items?.length || 0}</td>
                                        <td>Rs {order.totalAmount?.toFixed(2)}</td>
                                        <td>
                                            <span
                                                className={`admin-badge ${order.paymentStatus === 'paid'
                                                    ? 'success'
                                                    : order.paymentStatus === 'pending'
                                                        ? 'warning'
                                                        : 'error'
                                                    }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="admin-form-select"
                                                value={order.status}
                                                onChange={(e) =>
                                                    updateOrderStatus(order._id, e.target.value)
                                                }
                                                style={{ width: 'auto', fontSize: '12px' }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="admin-action-btn"
                                                    title="View Details"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="admin-action-btn"
                                                    title="Download Excel"
                                                    onClick={() => handleExportSingle(order)}
                                                >
                                                    📥
                                                </button>
                                                <button
                                                    className="admin-action-btn"
                                                    title="Print Invoice"
                                                    onClick={() => handlePrintOrder(order)}
                                                >
                                                    🖨️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <Modal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={`Order Details #${selectedOrder.orderNumber}`}
                    size="medium"
                    footer={
                        <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
                            Close
                        </button>
                    }
                >
                    <div className="order-details-modal">
                        <div className="detail-section">
                            <h4>Customer Information</h4>
                            <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                            <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                            <p><strong>Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                        </div>

                        <div className="detail-section" style={{ marginTop: '20px' }}>
                            <h4>Shipping Address</h4>
                            <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                            <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                            <p>{selectedOrder.shippingAddress?.country}</p>
                        </div>

                        <div className="detail-section" style={{ marginTop: '20px' }}>
                            <h4>Order Items</h4>
                            <div className="detail-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            {item.image && <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{item.name || item.product?.name}</div>
                                                <div style={{ fontSize: '0.9em', opacity: 0.7 }}>Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>Rs {(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="detail-section" style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <h4>Total Amount</h4>
                            <h3 style={{ color: 'var(--color-primary)' }}>Rs {selectedOrder.totalAmount?.toFixed(2)}</h3>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdminOrders;
