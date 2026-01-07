import { useEffect, useState } from 'react';
import useToast from '../store/useToast';
import Modal from '../components/Modal';
import { TableSkeleton } from '../components/LoadingSkeleton';
import './Admin.css';

const AdminInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [adjustmentModal, setAdjustmentModal] = useState(false);
    const [adjustment, setAdjustment] = useState({ quantity: 0, reason: '' });
    const toast = useToast();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            // API call would go here
            // const response = await getInventory();
            // setProducts(response.data);

            // Mock data for now
            setProducts([]);
        } catch (err) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustStock = async () => {
        try {
            // API call would go here
            // await adjustInventory(selectedProduct.id, adjustment);
            toast.success('Stock adjusted successfully');
            setAdjustmentModal(false);
            setSelectedProduct(null);
            setAdjustment({ quantity: 0, reason: '' });
            fetchInventory();
        } catch (err) {
            toast.error('Failed to adjust stock');
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', class: 'error' };
        if (stock < 10) return { label: 'Low Stock', class: 'warning' };
        if (stock < 50) return { label: 'In Stock', class: 'info' };
        return { label: 'Well Stocked', class: 'success' };
    };

    if (loading) {
        return (
            <div className="admin-inventory">
                <div className="admin-table-container">
                    <TableSkeleton rows={10} columns={6} />
                </div>
            </div>
        );
    }

    return (
        <div className="admin-inventory">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Inventory Management</h2>
                    <div className="admin-table-actions">
                        <button className="admin-btn admin-btn-secondary">
                            📥 Import Stock
                        </button>
                        <button className="admin-btn admin-btn-primary">
                            📊 Generate Report
                        </button>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">📋</div>
                        <h3 className="admin-empty-title">No Inventory Data</h3>
                        <p className="admin-empty-description">
                            Add products to start tracking inventory
                        </p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Current Stock</th>
                                    <th>Status</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const status = getStockStatus(product.stock);
                                    return (
                                        <tr key={product.id}>
                                            <td style={{ fontWeight: 600 }}>{product.name}</td>
                                            <td>{product.sku || 'N/A'}</td>
                                            <td>
                                                <span style={{ fontSize: '18px', fontWeight: 700 }}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`admin-badge ${status.class}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="admin-btn admin-btn-sm admin-btn-secondary"
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setAdjustmentModal(true);
                                                    }}
                                                >
                                                    Adjust Stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Stock Adjustment Modal */}
            <Modal
                isOpen={adjustmentModal}
                onClose={() => {
                    setAdjustmentModal(false);
                    setSelectedProduct(null);
                    setAdjustment({ quantity: 0, reason: '' });
                }}
                title="Adjust Stock"
                size="medium"
                footer={
                    <>
                        <button
                            className="admin-btn admin-btn-secondary"
                            onClick={() => setAdjustmentModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={handleAdjustStock}
                        >
                            Save Adjustment
                        </button>
                    </>
                }
            >
                {selectedProduct && (
                    <div className="admin-form">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Product</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                value={selectedProduct.name}
                                disabled
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Current Stock</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                value={selectedProduct.stock}
                                disabled
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label required">
                                Adjustment Quantity
                            </label>
                            <input
                                type="number"
                                className="admin-form-input"
                                value={adjustment.quantity}
                                onChange={(e) =>
                                    setAdjustment({ ...adjustment, quantity: e.target.value })
                                }
                                placeholder="Enter positive or negative number"
                            />
                            <p className="admin-form-help">
                                Use positive numbers to add stock, negative to reduce
                            </p>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label required">Reason</label>
                            <textarea
                                className="admin-form-textarea"
                                value={adjustment.reason}
                                onChange={(e) =>
                                    setAdjustment({ ...adjustment, reason: e.target.value })
                                }
                                placeholder="Explain the reason for this adjustment"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminInventory;
