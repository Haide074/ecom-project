import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose, title, message, orderNumber }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay" onClick={onClose}>
            <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="success-modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="success-modal-icon">
                    <CheckCircle size={64} />
                </div>

                <h2 className="success-modal-title">{title || 'Success!'}</h2>

                <p className="success-modal-message">
                    {message || 'Your order has been placed successfully!'}
                </p>

                {orderNumber && (
                    <div className="success-modal-order">
                        <span className="success-modal-order-label">Order Number:</span>
                        <span className="success-modal-order-number">#{orderNumber}</span>
                    </div>
                )}

                <div className="success-modal-footer">
                    <p className="success-modal-note">
                        We will contact you soon to confirm your order.
                    </p>
                    <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '1rem', width: '100%' }}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
