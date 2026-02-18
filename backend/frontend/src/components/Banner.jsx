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
                color: banner.textColor || '#ffffff'
            }}
        >
            <div className="banner-content">
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
                style={{ color: banner.textColor || '#ffffff' }}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Banner;
