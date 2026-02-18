import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
import useToast from '../store/useToast';
import Modal from '../components/Modal';
import { ImageSkeleton } from '../components/LoadingSkeleton';
import './Admin.css';
import './MediaLibrary.css';

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MediaLibrary = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const { showToast } = useToast();
=======
const MediaLibrary = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const toast = useToast();
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
<<<<<<< HEAD
            const { data } = await axios.get(`${API_URL}/media`);
            setImages(data.data.images || []);
        } catch (err) {
            console.error('Failed to load media library:', err);
            showToast('Failed to load media library', 'error');
=======
            // API call would go here
            // const response = await getMediaLibrary();
            // setImages(response.data);

            // Mock data for now
            setImages([]);
        } catch (err) {
            toast.error('Failed to load media library');
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
        } finally {
            setLoading(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        try {
<<<<<<< HEAD
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
=======
            // Upload files
            // const formData = new FormData();
            // acceptedFiles.forEach(file => formData.append('images', file));
            // await uploadImages(formData);

            toast.success(`${acceptedFiles.length} image(s) uploaded successfully`);
            fetchImages();
        } catch (err) {
            toast.error('Failed to upload images');
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: true,
<<<<<<< HEAD
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
=======
    });

    const handleDelete = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            // await deleteImage(imageId);
            toast.success('Image deleted successfully');
            fetchImages();
        } catch (err) {
            toast.error('Failed to delete image');
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedImages.length} selected images?`)) return;

        try {
<<<<<<< HEAD
            await axios.post(`${API_URL}/media/bulk-delete`, { publicIds: selectedImages });
            showToast(`${selectedImages.length} images deleted`, 'success');
            setSelectedImages([]);
            fetchImages();
        } catch (err) {
            console.error('Bulk delete error:', err);
            showToast('Failed to delete images', 'error');
=======
            // await bulkDeleteImages(selectedImages);
            toast.success(`${selectedImages.length} images deleted`);
            setSelectedImages([]);
            fetchImages();
        } catch (err) {
            toast.error('Failed to delete images');
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
        }
    };

    const copyImageUrl = (url) => {
        navigator.clipboard.writeText(url);
<<<<<<< HEAD
        showToast('Image URL copied to clipboard', 'success');
    };

    const toggleImageSelection = (publicId) => {
        setSelectedImages(prev =>
            prev.includes(publicId)
                ? prev.filter(id => id !== publicId)
                : [...prev, publicId]
=======
        toast.success('Image URL copied to clipboard');
    };

    const toggleImageSelection = (imageId) => {
        setSelectedImages(prev =>
            prev.includes(imageId)
                ? prev.filter(id => id !== imageId)
                : [...prev, imageId]
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
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
<<<<<<< HEAD
                className={`media-dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
=======
                className={`media-dropzone ${isDragActive ? 'active' : ''}`}
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
            >
                <input {...getInputProps()} />
                <div className="media-dropzone-content">
                    <div className="media-dropzone-icon">📁</div>
                    <p className="media-dropzone-text">
<<<<<<< HEAD
                        {uploading
                            ? 'Uploading...'
                            : isDragActive
                                ? 'Drop the images here...'
                                : 'Drag & drop images here, or click to select'}
=======
                        {isDragActive
                            ? 'Drop the images here...'
                            : 'Drag & drop images here, or click to select'}
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
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
<<<<<<< HEAD
                            key={image.publicId}
                            className={`media-item ${selectedImages.includes(image.publicId) ? 'selected' : ''
=======
                            key={image.id}
                            className={`media-item ${selectedImages.includes(image.id) ? 'selected' : ''
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="media-checkbox"
<<<<<<< HEAD
                                checked={selectedImages.includes(image.publicId)}
                                onChange={() => toggleImageSelection(image.publicId)}
=======
                                checked={selectedImages.includes(image.id)}
                                onChange={() => toggleImageSelection(image.id)}
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
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
<<<<<<< HEAD
                                    onClick={() => handleDelete(image.publicId)}
=======
                                    onClick={() => handleDelete(image.id)}
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
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
