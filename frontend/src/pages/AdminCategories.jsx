import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../services/adminService';
import './Admin.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            setCategories(response.data.categories);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory(formData);
            setFormData({ name: '', description: '', parent: '' });
            setShowForm(false);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create category');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="admin-categories">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Categories Management</h2>
                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '➕ Add Category'}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-form-label required">Category Name</label>
                                <input
                                    type="text"
                                    className="admin-form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Description</label>
                                <textarea
                                    className="admin-form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Category description"
                                    rows={3}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Parent Category</label>
                                <select
                                    className="admin-form-select"
                                    value={formData.parent}
                                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="admin-btn admin-btn-primary">
                                Create Category
                            </button>
                        </form>
                    </div>
                )}

                {error && (
                    <div style={{ padding: 'var(--space-6)', color: 'var(--color-error)' }}>
                        {error}
                    </div>
                )}

                {categories.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">🏷️</div>
                        <h3 className="admin-empty-title">No Categories Found</h3>
                        <p className="admin-empty-description">
                            Get started by adding your first category
                        </p>
                        <button
                            className="admin-btn admin-btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            ➕ Add Category
                        </button>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Description</th>
                                    <th>Parent</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category._id}>
                                        <td style={{ fontWeight: 600 }}>{category.name}</td>
                                        <td>
                                            <code
                                                style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    padding: 'var(--space-1) var(--space-2)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 'var(--text-xs)',
                                                }}
                                            >
                                                {category.slug}
                                            </code>
                                        </td>
                                        <td style={{ maxWidth: '300px' }}>
                                            {category.description || '-'}
                                        </td>
                                        <td>{category.parent?.name || '-'}</td>
                                        <td>
                                            <button
                                                className="admin-action-btn delete"
                                                onClick={() => handleDelete(category._id, category.name)}
                                                title="Delete category"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
