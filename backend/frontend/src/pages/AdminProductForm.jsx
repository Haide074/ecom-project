import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getCategories } from '../services/adminService';
import axios from 'axios';
import './Admin.css';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        compareAtPrice: '',
        category: '',
        stock: '',
        sku: '',
        status: 'active',
        isFeatured: false,
        tags: '',
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data.categories);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProduct = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${API_URL}/products/${id}`);
            const product = response.data.data.product;

            setFormData({
                name: product.name || '',
                description: product.description || '',
                shortDescription: product.shortDescription || '',
                price: product.price || '',
                compareAtPrice: product.compareAtPrice || '',
                category: product.category?._id || '',
                stock: product.stock || '',
                sku: product.sku || '',
                status: product.status || 'active',
                isFeatured: product.isFeatured || false,
                tags: product.tags?.join(', ') || '',
            });

            setExistingImages(product.images || []);
        } catch (err) {
            setError('Failed to load product');
            console.error('Error fetching product:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            // Add text fields
            Object.keys(formData).forEach((key) => {
                if (key === 'tags') {
                    // Convert comma-separated tags to array
                    const tagsArray = formData[key]
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter((tag) => tag);
                    formDataToSend.append(key, JSON.stringify(tagsArray));
                } else if (key === 'isFeatured') {
                    formDataToSend.append(key, formData[key]);
                } else if (formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Add images
            images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            if (isEdit) {
                await updateProduct(id, formDataToSend);
            } else {
                await createProduct(formDataToSend);
            }

            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
            console.error('Error saving product:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-product-form">
            <div className="admin-form">
                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h2 style={{ color: 'var(--text-dark)', marginBottom: 'var(--space-2)' }}>
                        {isEdit ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <p style={{ color: 'var(--color-gray-400)' }}>
                        {isEdit ? 'Update product information' : 'Add a new product to your store'}
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            padding: 'var(--space-4)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--color-error)',
                            marginBottom: 'var(--space-6)',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="admin-form-group">
                        <label className="admin-form-label required">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            className="admin-form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Short Description</label>
                        <input
                            type="text"
                            name="shortDescription"
                            className="admin-form-input"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            placeholder="Brief product description"
                            maxLength={500}
                        />
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label required">Description</label>
                        <textarea
                            name="description"
                            className="admin-form-textarea"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Detailed product description"
                            rows={6}
                        />
                    </div>

                    {/* Pricing */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div className="admin-form-group">
                            <label className="admin-form-label required">Price</label>
                            <input
                                type="number"
                                name="price"
                                className="admin-form-input"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Compare at Price</label>
                            <input
                                type="number"
                                name="compareAtPrice"
                                className="admin-form-input"
                                value={formData.compareAtPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                            <p className="admin-form-help">Original price to show discount</p>
                        </div>
                    </div>

                    {/* Category and Stock */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div className="admin-form-group">
                            <label className="admin-form-label required">Category</label>
                            <select
                                name="category"
                                className="admin-form-select"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label required">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                className="admin-form-input"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* SKU and Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div className="admin-form-group">
                            <label className="admin-form-label">SKU</label>
                            <input
                                type="text"
                                name="sku"
                                className="admin-form-input"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="Product SKU"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Status</label>
                            <select
                                name="status"
                                className="admin-form-select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="admin-form-group">
                        <label className="admin-form-label">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            className="admin-form-input"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="tag1, tag2, tag3"
                        />
                        <p className="admin-form-help">Separate tags with commas</p>
                    </div>

                    {/* Images */}
                    <div className="admin-form-group">
                        <label className="admin-form-label">Product Images</label>
                        <input
                            type="file"
                            className="admin-form-input"
                            onChange={handleImageChange}
                            multiple
                            accept="image/*"
                        />
                        <p className="admin-form-help">Upload product images (multiple allowed)</p>

                        {/* Show existing images */}
                        {existingImages.length > 0 && (
                            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                                {existingImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img.url}
                                        alt={`Product ${idx + 1}`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Featured */}
                    <div className="admin-form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <span className="admin-form-label" style={{ marginBottom: 0 }}>
                                Mark as Featured Product
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
                        </button>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => navigate('/admin/products')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProductForm;
