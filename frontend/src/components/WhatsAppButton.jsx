import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import useTheme from '../hooks/useTheme';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const whatsappSettings = theme?.whatsapp;

    // Don't render if WhatsApp is disabled or no phone number
    if (!whatsappSettings?.enabled || !whatsappSettings?.phoneNumber) {
        return null;
    }

    const phoneNumber = whatsappSettings.phoneNumber.replace(/[^0-9]/g, '');
    const message = whatsappSettings.message || 'Hi! I\'m interested in your product.';
    const buttonText = whatsappSettings.buttonText || 'Chat with us';

    const handleWhatsAppClick = (e) => {
        // Stop propagation if we're clicking the close button
        if (e.target.closest('.whatsapp-close')) return;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={`whatsapp-container ${isOpen ? 'open' : ''}`}>
            {/* Tooltip */}
            <div className="whatsapp-tooltip">
                <button
                    className="whatsapp-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                    aria-label="Close"
                >
                    <X size={16} />
                </button>
                <p className="whatsapp-tooltip-text">{buttonText}</p>
            </div>

            {/* Main Button */}
            <button
                className="whatsapp-main-button"
                onClick={handleWhatsAppClick}
                onMouseEnter={() => setIsOpen(true)}
                aria-label="Contact us on WhatsApp"
            >
                <MessageCircle size={28} />
                <span className="pulse-ring"></span>
            </button>
        </div>
    );
};

export default WhatsAppButton;
