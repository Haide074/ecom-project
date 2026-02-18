import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useState } from 'react';
import useTheme from '../hooks/useTheme';
import './Banner.css';

const Banner = () => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(true);

    const banner = theme?.banner;

    // Don't render if banner is disabled or not visible
    if (!banner?.enabled || !isVisible) {
        return null;
    }

    return (
        <div
            className="top-banner"
            style={{
                backgroundColor: banner.backgroundColor || '#7c3aed',
                color: banner.textColor || '#ffffff',
                backgroundImage: banner.image?.url ? `url(${banner.image.url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}
        >
            {banner.image?.url && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 0,
                }} />
            )}
            <div className="banner-content" style={{ position: 'relative', zIndex: 1 }}>
                <p className="banner-text">{banner.text}</p>
                {banner.buttonText && (
                    <Link
                        to={banner.buttonLink || '/products'}
                        className="banner-button"
                        style={{
                            borderColor: banner.textColor || '#ffffff',
                            color: banner.textColor || '#ffffff'
                        }}
                    >
                        {banner.buttonText}
                    </Link>
                )}
            </div>
            <button
                className="banner-close"
                onClick={() => setIsVisible(false)}
                aria-label="Close banner"
                style={{ color: banner.textColor || '#ffffff', position: 'relative', zIndex: 1 }}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Banner;
