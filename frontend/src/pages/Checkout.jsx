import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Package, MapPin, User } from 'lucide-react';
import useCart from '../hooks/useCart';
import useTheme from '../hooks/useTheme';
import useToast from '../store/useToast';
import { getProvinces, getCitiesByProvince } from '../data/pakistanData';
import SuccessModal from '../components/SuccessModal';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getCartTotal, getItemsCount, clearCart } = useCart();
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
    const cartTotal = getCartTotal();
    const total = cartTotal + shippingPrice;

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0 && !showSuccess) {
            navigate('/cart');
        }
    }, [items, navigate, showSuccess]);

    // Update available cities when province changes
    useEffect(() => {
        if (formData.province) {
            const cities = getCitiesByProvince(formData.province);
            setAvailableCities(cities);
            if (formData.city && !cities.includes(formData.city)) {
                setFormData(prev => ({ ...prev, city: '' }));
            }
        } else {
            setAvailableCities([]);
            setFormData(prev => ({ ...prev, city: '' }));
        }
    }, [formData.province, formData.city]);

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
            const { guestOrdersAPI } = await import('../services/api');

            // Prepare order data with all cart items
            const orderData = {
                items: items.map(item => ({
                    id: item.product._id || item.product.id,
                    quantity: item.quantity,
                })),
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

            console.log('Submitting checkout order:', orderData);

            // Submit order to backend
            const response = await guestOrdersAPI.create(orderData);

            console.log('Checkout order response:', response.data);

            // Extract order number from response
            const orderNum = response.data?.data?.order?.orderNumber || '';
            setOrderNumber(orderNum);

            // Show success modal
            setShowSuccess(true);

            // Clear cart after successful order
            clearCart();
        } catch (error) {
            console.error('Checkout submission error:', error);
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
        navigate('/');
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

    if (items.length === 0 && !showSuccess) {
        return null;
    }

    return (
        <>
            <div className="container checkout-container">
                <div className="checkout-page">
                    <h1 className="checkout-title">Checkout</h1>

                    <div className="checkout-grid">
                        {/* Customer Information Form */}
                        <div className="checkout-form-section">
                            <form onSubmit={handleSubmit} className="checkout-form">
                                <div className="form-section">
                                    <h2 className="form-section-title">
                                        <User size={20} />
                                        Customer Information
                                    </h2>
                                    {renderField('name', 'Full Name', 'text')}
                                    {renderField('email', 'Email Address', 'email')}
                                    {renderField('phone', 'Phone Number', 'tel')}
                                </div>

                                <div className="form-section">
                                    <h2 className="form-section-title">
                                        <MapPin size={20} />
                                        Shipping Address
                                    </h2>
                                    {renderField('address', 'Address', 'text', true)}
                                    {renderField('province', 'Province', 'text', false, true, getProvinces())}
                                    {renderField('city', 'City', 'text', false, true, availableCities)}
                                    {renderField('zipCode', 'Zip Code', 'text')}
                                    {renderField('country', 'Country', 'text')}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg btn-block"
                                    disabled={submitting}
                                >
                                    <CreditCard size={20} />
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h2 className="summary-title">
                                <Package size={20} />
                                Order Summary
                            </h2>

                            <div className="summary-items">
                                {items.map((item) => {
                                    const product = item.product;
                                    const productId = product._id || product.id;

                                    // Handle different image data structures
                                    let imageUrl = '/placeholder.jpg';

                                    // Try to get the first image from the product
                                    if (product.images && product.images.length > 0) {
                                        const firstImage = product.images[0];

                                        // Case 1: Image is just a string URL
                                        if (typeof firstImage === 'string') {
                                            imageUrl = firstImage;
                                        }
                                        // Case 2: Image is an object with a 'url' property (common)
                                        else if (firstImage && firstImage.url) {
                                            imageUrl = firstImage.url;
                                        }
                                        // Case 3: Image is an object with secure_url
                                        else if (firstImage && firstImage.secure_url) {
                                            imageUrl = firstImage.secure_url;
                                        }
                                    }

                                    // If still placeholder, check if product has a single 'image' property
                                    if (imageUrl === '/placeholder.jpg' && product.image) {
                                        imageUrl = product.image;
                                    }

                                    return (
                                        <div key={productId} className="summary-item">
                                            <div className="summary-item-image">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="summary-item-details">
                                                <h4>{product.name}</h4>
                                                <p className="summary-item-quantity">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="summary-item-price">
                                                Rs {(product.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Subtotal ({getItemsCount()} items)</span>
                                    <span>Rs {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span>Rs {shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row summary-total">
                                    <span>Total</span>
                                    <span>Rs {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                title="Order Placed Successfully!"
                message="Your order has been placed Cash On Delivery successfully!"
                orderNumber={orderNumber}
            />
        </>
    );
};

export default Checkout;
