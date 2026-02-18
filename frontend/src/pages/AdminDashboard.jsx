import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/adminService';
import { RevenueChart, OrdersChart } from '../components/AnalyticsCharts';
import { StatCardSkeleton } from '../components/LoadingSkeleton';
import './Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState(30);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await getDashboardStats(period);
            setStats(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard stats');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-stats-grid">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-empty-state">
                <div className="admin-empty-icon">⚠️</div>
                <h2 className="admin-empty-title">Error Loading Dashboard</h2>
                <p className="admin-empty-description">{error}</p>
                <button className="admin-btn admin-btn-primary" onClick={fetchStats}>
                    Try Again
                </button>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
        }).format(amount);
    };

    return (
        <div className="admin-dashboard">
            {/* Period Selector */}
            <div style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
                <button
                    className={`admin-btn ${period === 7 ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    onClick={() => setPeriod(7)}
                >
                    Last 7 Days
                </button>
                <button
                    className={`admin-btn ${period === 30 ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    onClick={() => setPeriod(30)}
                >
                    Last 30 Days
                </button>
                <button
                    className={`admin-btn ${period === 90 ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                    onClick={() => setPeriod(90)}
                >
                    Last 90 Days
                </button>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <div>
                            <div className="admin-stat-label">Total Users</div>
                            <div className="admin-stat-value">{stats?.stats?.totalUsers || 0}</div>
                        </div>
                        <div className="admin-stat-icon">👥</div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <div>
                            <div className="admin-stat-label">Total Products</div>
                            <div className="admin-stat-value">{stats?.stats?.totalProducts || 0}</div>
                        </div>
                        <div className="admin-stat-icon">📦</div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <div>
                            <div className="admin-stat-label">Total Orders</div>
                            <div className="admin-stat-value">{stats?.stats?.totalOrders || 0}</div>
                        </div>
                        <div className="admin-stat-icon">🛒</div>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-header">
                        <div>
                            <div className="admin-stat-label">Total Revenue</div>
                            <div className="admin-stat-value">
                                {formatCurrency(stats?.stats?.totalRevenue || 0)}
                            </div>
                        </div>
                        <div className="admin-stat-icon">💰</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            {stats?.recentOrders && stats.recentOrders.length > 0 && (
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h2 className="admin-table-title">Recent Orders</h2>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>#{order._id.slice(-8)}</td>
                                        <td>{order.user?.name || 'N/A'}</td>
                                        <td>{formatCurrency(order.totalAmount)}</td>
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
                                        <td>{formatDate(order.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Products */}
            {stats?.topProducts && stats.topProducts.length > 0 && (
                <div className="admin-table-container">
                    <div className="admin-table-header">
                        <h2 className="admin-table-title">Top Products</h2>
                    </div>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Rating</th>
                                    <th>Reviews</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td style={{ fontWeight: 600 }}>{product.name}</td>
                                        <td>{product.category?.name || 'N/A'}</td>
                                        <td>{formatCurrency(product.price)}</td>
                                        <td>
                                            <span
                                                className={`admin-badge ${product.stock > 10
                                                    ? 'success'
                                                    : product.stock > 0
                                                        ? 'warning'
                                                        : 'error'
                                                    }`}
                                            >
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>⭐ {product.averageRating.toFixed(1)}</td>
                                        <td>{product.totalReviews}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Revenue & Orders Charts */}
            <div className="admin-charts-grid">
                {stats?.revenueByPeriod && stats.revenueByPeriod.length > 0 && (
                    <div className="admin-chart-container">
                        <div className="admin-chart-header">
                            <h2 className="admin-chart-title">Revenue Trends</h2>
                        </div>
                        <div className="admin-chart-wrapper">
                            <RevenueChart data={stats.revenueByPeriod} />
                        </div>
                    </div>
                )}

                {stats?.revenueByPeriod && stats.revenueByPeriod.length > 0 && (
                    <div className="admin-chart-container">
                        <div className="admin-chart-header">
                            <h2 className="admin-chart-title">Orders Over Time</h2>
                        </div>
                        <div className="admin-chart-wrapper">
                            <OrdersChart data={stats.revenueByPeriod} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

export default AdminDashboard;
