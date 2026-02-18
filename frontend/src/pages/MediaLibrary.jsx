import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import useToast from '../store/useToast';
import Modal from '../components/Modal';
import { ImageSkeleton } from '../components/LoadingSkeleton';
import './Admin.css';
import './MediaLibrary.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MediaLibrary = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const { showToast } = useToast();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/media`);
            setImages(data.data.images || []);
        } catch (err) {
            console.error('Failed to load media library:', err);
            showToast('Failed to load media library', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        try {
            setUploading(true);
            console.log('📤 Starting upload of', acceptedFiles.length, 'files');

            const formData = new FormData();
            acceptedFiles.forEach(file => {
                console.log('Adding file:', file.name, 'Size:', file.size, 'Type:', file.type);
                formData.append('images', file);
            });

            console.log('🚀 Sending request to:', `${API_URL}/media/upload`);

            const { data } = await axios.post(`${API_URL}/media/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ Upload response:', data);
            showToast(`${acceptedFiles.length} image(s) uploaded successfully`, 'success');
            await fetchImages(); // Refresh the list
        } catch (err) {
            console.error('❌ Upload error:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to upload images';
            showToast(errorMessage, 'error');
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: true,
        disabled: uploading,
    });

    const handleDelete = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await axios.delete(`${API_URL}/media/${encodeURIComponent(publicId)}`);
            showToast('Image deleted successfully', 'success');
            fetchImages();
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete image', 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedImages.length} selected images?`)) return;

        try {
            await axios.post(`${API_URL}/media/bulk-delete`, { publicIds: selectedImages });
            showToast(`${selectedImages.length} images deleted`, 'success');
            setSelectedImages([]);
            fetchImages();
        } catch (err) {
            console.error('Bulk delete error:', err);
            showToast('Failed to delete images', 'error');
        }
    };

    const copyImageUrl = (url) => {
        navigator.clipboard.writeText(url);
        showToast('Image URL copied to clipboard', 'success');
    };

    const toggleImageSelection = (publicId) => {
        setSelectedImages(prev =>
            prev.includes(publicId)
                ? prev.filter(id => id !== publicId)
                : [...prev, publicId]
        );
    };

    if (loading) {
        return (
            <div className="media-library">
                <div className="media-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ImageSkeleton key={i} height="200px" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="media-library">
            <div className="media-header">
                <h2 className="media-title">Media Library</h2>
                <div className="media-actions">
                    {selectedImages.length > 0 && (
                        <button
                            className="admin-btn admin-btn-danger"
                            onClick={handleBulkDelete}
                        >
                            🗑️ Delete Selected ({selectedImages.length})
                        </button>
                    )}
                </div>
            </div>

            <div
                {...getRootProps()}
                className={`media-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="media-dropzone-content">
                    <div className="media-dropzone-icon">📁</div>
                    <p className="media-dropzone-text">
                        {uploading
                            ? 'Uploading...'
                            : isDragActive
                                ? 'Drop the images here...'
                                : 'Drag & drop images here, or click to select'}
                    </p>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="admin-empty-state">
                    <div className="admin-empty-icon">🖼️</div>
                    <h3 className="admin-empty-title">No Images Yet</h3>
                    <p className="admin-empty-description">
                        Upload images to get started
                    </p>
                </div>
            ) : (
                <div className="media-grid">
                    {images.map((image) => (
                        <div
                            key={image.publicId}
                            className={`media-item ${selectedImages.includes(image.publicId) ? 'selected' : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="media-checkbox"
                                checked={selectedImages.includes(image.publicId)}
                                onChange={() => toggleImageSelection(image.publicId)}
                            />
                            <img
                                src={image.url}
                                alt={image.alt || 'Media'}
                                className="media-image"
                                onClick={() => {
                                    setSelectedImage(image);
                                    setViewModal(true);
                                }}
                            />
                            <div className="media-overlay">
                                <button
                                    className="media-btn"
                                    onClick={() => copyImageUrl(image.url)}
                                    title="Copy URL"
                                >
                                    📋
                                </button>
                                <button
                                    className="media-btn"
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setViewModal(true);
                                    }}
                                    title="View"
                                >
                                    👁️
                                </button>
                                <button
                                    className="media-btn delete"
                                    onClick={() => handleDelete(image.publicId)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Image Modal */}
            <Modal
                isOpen={viewModal}
                onClose={() => {
                    setViewModal(false);
                    setSelectedImage(null);
                }}
                title="Image Details"
                size="large"
            >
                {selectedImage && (
                    <div className="media-details">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.alt || 'Media'}
                            className="media-details-image"
                        />
                        <div className="media-details-info">
                            <div className="admin-form-group">
                                <label className="admin-form-label">URL</label>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <input
                                        type="text"
                                        className="admin-form-input"
                                        value={selectedImage.url}
                                        readOnly
                                    />
                                    <button
                                        className="admin-btn admin-btn-secondary"
                                        onClick={() => copyImageUrl(selectedImage.url)}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Alt Text</label>
                                <input
                                    type="text"
                                    className="admin-form-input"
                                    value={selectedImage.alt || ''}
                                    placeholder="No alt text"
                                    readOnly
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Uploaded</label>
                                <input
                                    type="text"
                                    className="admin-form-input"
                                    value={new Date(selectedImage.createdAt).toLocaleString()}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MediaLibrary;
