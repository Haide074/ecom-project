import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import useToast from '../store/useToast';
import Modal from '../components/Modal';
import { ImageSkeleton } from '../components/LoadingSkeleton';
import './Admin.css';
import './MediaLibrary.css';

const MediaLibrary = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const toast = useToast();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            // API call would go here
            // const response = await getMediaLibrary();
            // setImages(response.data);

            // Mock data for now
            setImages([]);
        } catch (err) {
            toast.error('Failed to load media library');
        } finally {
            setLoading(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        try {
            // Upload files
            // const formData = new FormData();
            // acceptedFiles.forEach(file => formData.append('images', file));
            // await uploadImages(formData);

            toast.success(`${acceptedFiles.length} image(s) uploaded successfully`);
            fetchImages();
        } catch (err) {
            toast.error('Failed to upload images');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: true,
    });

    const handleDelete = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            // await deleteImage(imageId);
            toast.success('Image deleted successfully');
            fetchImages();
        } catch (err) {
            toast.error('Failed to delete image');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedImages.length} selected images?`)) return;

        try {
            // await bulkDeleteImages(selectedImages);
            toast.success(`${selectedImages.length} images deleted`);
            setSelectedImages([]);
            fetchImages();
        } catch (err) {
            toast.error('Failed to delete images');
        }
    };

    const copyImageUrl = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('Image URL copied to clipboard');
    };

    const toggleImageSelection = (imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
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
                className={`media-dropzone ${isDragActive ? 'active' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="media-dropzone-content">
                    <div className="media-dropzone-icon">📁</div>
                    <p className="media-dropzone-text">
                        {isDragActive
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
                            key={image.id}
                            className={`media-item ${selectedImages.includes(image.id) ? 'selected' : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="media-checkbox"
                                checked={selectedImages.includes(image.id)}
                                onChange={() => toggleImageSelection(image.id)}
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
                                    onClick={() => handleDelete(image.id)}
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
