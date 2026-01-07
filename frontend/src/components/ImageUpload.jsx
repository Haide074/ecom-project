import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = ({ images = [], onChange, maxFiles = 10, label = 'Upload Images' }) => {
    const [previews, setPreviews] = useState(images);

    const onDrop = useCallback((acceptedFiles) => {
        const newPreviews = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
        }));

        const updated = [...previews, ...newPreviews].slice(0, maxFiles);
        setPreviews(updated);
        onChange(updated);
    }, [previews, onChange, maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        maxFiles: maxFiles - previews.length,
    });

    const removeImage = (index) => {
        const updated = previews.filter((_, i) => i !== index);
        setPreviews(updated);
        onChange(updated);
    };

    const moveImage = (fromIndex, toIndex) => {
        const updated = [...previews];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setPreviews(updated);
        onChange(updated);
    };

    return (
        <div className="image-upload">
            <label className="image-upload-label">{label}</label>

            {previews.length > 0 && (
                <div className="image-preview-grid">
                    {previews.map((item, index) => (
                        <div key={index} className="image-preview-item">
                            <img
                                src={item.preview || item.url}
                                alt={item.name || `Image ${index + 1}`}
                                className="image-preview-img"
                            />
                            <div className="image-preview-overlay">
                                <button
                                    type="button"
                                    className="image-preview-btn"
                                    onClick={() => removeImage(index)}
                                    title="Remove"
                                >
                                    🗑️
                                </button>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        className="image-preview-btn"
                                        onClick={() => moveImage(index, index - 1)}
                                        title="Move left"
                                    >
                                        ←
                                    </button>
                                )}
                                {index < previews.length - 1 && (
                                    <button
                                        type="button"
                                        className="image-preview-btn"
                                        onClick={() => moveImage(index, index + 1)}
                                        title="Move right"
                                    >
                                        →
                                    </button>
                                )}
                            </div>
                            {index === 0 && (
                                <div className="image-preview-badge">Primary</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {previews.length < maxFiles && (
                <div
                    {...getRootProps()}
                    className={`image-dropzone ${isDragActive ? 'active' : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className="image-dropzone-content">
                        <div className="image-dropzone-icon">📁</div>
                        <p className="image-dropzone-text">
                            {isDragActive
                                ? 'Drop the images here...'
                                : 'Drag & drop images here, or click to select'}
                        </p>
                        <p className="image-dropzone-hint">
                            {previews.length} / {maxFiles} images uploaded
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
