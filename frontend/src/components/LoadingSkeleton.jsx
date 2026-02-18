import './LoadingSkeleton.css';

export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
    return (
        <div className="skeleton-table">
            <div className="skeleton-table-header">
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="skeleton skeleton-header-cell" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="skeleton-table-row">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className="skeleton skeleton-cell" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text short" />
        </div>
    );
};

export const StatCardSkeleton = () => {
    return (
        <div className="skeleton-stat-card">
            <div className="skeleton skeleton-stat-label" />
            <div className="skeleton skeleton-stat-value" />
        </div>
    );
};

export const FormSkeleton = () => {
    return (
        <div className="skeleton-form">
            <div className="skeleton skeleton-input" />
            <div className="skeleton skeleton-input" />
            <div className="skeleton skeleton-textarea" />
            <div className="skeleton skeleton-input short" />
        </div>
    );
};

export const ImageSkeleton = ({ width = '100%', height = '200px' }) => {
    return (
        <div className="skeleton skeleton-image" style={{ width, height }} />
    );
};
