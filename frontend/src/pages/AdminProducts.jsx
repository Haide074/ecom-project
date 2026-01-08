import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct, toggleProductFeatured } from '../services/adminService';
import './Admin.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;

            const response = await getAllProducts(params);
            setProducts(response.data.products);
            setPagination(response.data.pagination);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await deleteProduct(id);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete product');
        }
    };

    const handleToggleFeatured = async (id) => {
        try {
            await toggleProductFeatured(id);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update product');
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
        }).format(amount);
    };

    if (loading && products.length === 0) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="admin-products">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Products Management</h2>
                    <div className="admin-table-actions">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="admin-search-input"
                            value={search}
                            onChange={handleSearch}
                        />
                        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
                            ➕ Add Product
                        </Link>
                    </div>
                </div>

                {error && (
                    <div style={{ padding: 'var(--space-6)', color: 'var(--color-error)' }}>
                        {error}
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">📦</div>
                        <h3 className="admin-empty-title">No Products Found</h3>
                        <p className="admin-empty-description">
                            {search ? 'Try a different search term' : 'Get started by adding your first product'}
                        </p>
                        {!search && (
                            <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
                                ➕ Add Product
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Featured</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: 'var(--radius-md)',
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            background: 'rgba(255,255,255,0.1)',
                                                            borderRadius: 'var(--radius-md)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        📦
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ fontWeight: 600, maxWidth: '200px' }}>
                                                {product.name}
                                            </td>
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
                                            <td>
                                                <span
                                                    className={`admin-badge ${product.status === 'active'
                                                        ? 'success'
                                                        : product.status === 'draft'
                                                            ? 'warning'
                                                            : 'error'
                                                        }`}
                                                >
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`admin-btn admin-btn-sm ${product.isFeatured
                                                        ? 'admin-btn-primary'
                                                        : 'admin-btn-secondary'
                                                        }`}
                                                    onClick={() => handleToggleFeatured(product._id)}
                                                    title={
                                                        product.isFeatured
                                                            ? 'Remove from featured'
                                                            : 'Mark as featured'
                                                    }
                                                >
                                                    {product.isFeatured ? '⭐' : '☆'}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        className="admin-action-btn edit"
                                                        onClick={() =>
                                                            navigate(`/admin/products/edit/${product._id}`)
                                                        }
                                                        title="Edit product"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="admin-action-btn delete"
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        title="Delete product"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="admin-pagination">
                                <button
                                    className="admin-pagination-btn"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    ← Previous
                                </button>
                                <span className="admin-pagination-info">
                                    Page {page} of {pagination.totalPages}
                                </span>
                                <button
                                    className="admin-pagination-btn"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
