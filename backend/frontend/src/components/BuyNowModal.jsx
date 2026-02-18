import { X, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';
import useToast from '../store/useToast';
import { getProvinces, getCitiesByProvince } from '../data/pakistanData';
import SuccessModal from './SuccessModal';
import './BuyNowModal.css';

const BuyNowModal = ({ product, onClose }) => {
    const { theme } = useTheme();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        province: '',
        city: '',
        zipCode: '',
        country: 'Pakistan',
    });
    const [submitting, setSubmitting] = useState(false);
    const [availableCities, setAvailableCities] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const checkoutSettings = theme?.checkout;
    const shippingPrice = checkoutSettings?.shippingPrice || 0;
    const total = product.price + shippingPrice;

    // Update available cities when province changes
    useEffect(() => {
        if (formData.province) {
            const cities = getCitiesByProvince(formData.province);
            setAvailableCities(cities);
            // Reset city if it's not in the new province
            if (formData.city && !cities.includes(formData.city)) {
                setFormData(prev => ({ ...prev, city: '' }));
            }
        } else {
            setAvailableCities([]);
            setFormData(prev => ({ ...prev, city: '' }));
        }
    }, [formData.province]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const fields = checkoutSettings?.fields || {};
        for (const [fieldName, fieldConfig] of Object.entries(fields)) {
            if (fieldConfig.enabled && fieldConfig.required && !formData[fieldName]) {
                showToast(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`, 'error');
                return;
            }
        }

        setSubmitting(true);

        try {
            // Import the API function
            const { guestOrdersAPI } = await import('../services/api');

            // Prepare order data
            const orderData = {
                product: {
                    id: product._id || product.id,
                    quantity: 1,
                },
                customerInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                },
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    province: formData.province,
                    zipCode: formData.zipCode,
                    country: formData.country,
                },
                shippingPrice: shippingPrice,
            };

            console.log('Submitting order:', orderData);

            // Submit order to backend
            const response = await guestOrdersAPI.create(orderData);

            console.log('Order response:', response.data);

            // Extract order number from response
            const orderNum = response.data?.data?.order?.orderNumber || '';
            setOrderNumber(orderNum);

            // Show success modal
            setShowSuccess(true);

            // Close the buy now modal after a short delay
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Order submission error:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
            showToast(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        setOrderNumber('');
    };

    const renderField = (fieldName, label, type = 'text', isTextarea = false, isSelect = false, options = []) => {
        const fieldConfig = checkoutSettings?.fields?.[fieldName];

        if (!fieldConfig?.enabled) return null;

        return (
            <div className="form-group" key={fieldName}>
                <label>
                    {label}
                    {fieldConfig.required && <span className="required">*</span>}
                </label>
                {isSelect ? (
                    <select
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleChange}
                        required={fieldConfig.required}
                        className="input"
                    >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : isTextarea ? (
                    <textarea
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleChange}
                        required={fieldConfig.required}
                        rows="3"
                        className="input"
                    />
                ) : (
                    <input
                        type={type}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleChange}
                        required={fieldConfig.required}
                        className="input"
                    />
                )}
            </div>
        );
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="buy-now-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            <CreditCard size={24} />
                            Buy Now
                        </h2>
                        <button className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-body">
                        {/* Product Summary */}
                        <div className="product-summary">
                            <div className="summary-item">
                                <span>Product:</span>
                                <strong>{product.name}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Price:</span>
                                <strong>Rs {product.price.toFixed(2)}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Shipping:</span>
                                <strong>Rs {shippingPrice.toFixed(2)}</strong>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-item summary-total">
                                <span>Total:</span>
                                <strong>Rs {total.toFixed(2)}</strong>
                            </div>
                        </div>

                        {/* Customer Information Form */}
                        <form onSubmit={handleSubmit} className="buy-now-form">
                            <h3>Customer Information</h3>

                            {renderField('name', 'Full Name', 'text')}
                            {renderField('email', 'Email Address', 'email')}
                            {renderField('phone', 'Phone Number', 'tel')}
                            {renderField('address', 'Address', 'text', true)}
                            {renderField('province', 'Province', 'text', false, true, getProvinces())}
                            {renderField('city', 'City', 'text', false, true, availableCities)}
                            {renderField('zipCode', 'Zip Code', 'text')}
                            {renderField('country', 'Country', 'text')}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg btn-block"
                                disabled={submitting}
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                title="Order Placed Successfully!"
                message="Thank you for your order. We will contact you soon to confirm your order details."
                orderNumber={orderNumber}
            />
        </>
    );
};

export default BuyNowModal;
