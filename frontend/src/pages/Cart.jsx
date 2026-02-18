import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCart from '../hooks/useCart';
import './Cart.css';

const Cart = () => {
    const { items, updateQuantity, removeItem, clearCart, getCartTotal, getItemsCount } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId) => {
        removeItem(productId);
    };

    const cartTotal = getCartTotal();
    const itemsCount = getItemsCount();

    if (items.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '100px', minHeight: '60vh' }}>
                <div className="cart-empty">
                    <ShoppingBag size={64} className="cart-empty-icon" />
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                    <Link to="/products" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px', minHeight: '60vh' }}>
            <div className="cart-page">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <button onClick={clearCart} className="btn btn-outline">
                        Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
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
                                // Case 3: Image is an object with 'public_id' but maybe constructed URL needed?
                                // Usually secure_url or url is present from Cloudinary
                                else if (firstImage && firstImage.secure_url) {
                                    imageUrl = firstImage.secure_url;
                                }
                            }

                            // If still placeholder, check if product has a single 'image' property
                            if (imageUrl === '/placeholder.jpg' && product.image) {
                                imageUrl = product.image;
                            }

                            return (
                                <div key={productId} className="cart-item">
                                    <div className="cart-item-image">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="cart-item-details">
                                        <h3>{product.name}</h3>
                                        <p className="cart-item-price">Rs {product.price?.toFixed(2)}</p>
                                    </div>
                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                            className="quantity-btn"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                            className="quantity-btn"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="cart-item-total">
                                        <p>Rs {(product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(productId)}
                                        className="cart-item-remove"
                                        title="Remove item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="cart-summary-row">
                            <span>Subtotal ({itemsCount} items)</span>
                            <span>Rs {cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="cart-summary-divider"></div>
                        <div className="cart-summary-row cart-summary-total">
                            <span>Total</span>
                            <span>Rs {cartTotal.toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
                            Proceed to Checkout
                        </Link>
                        <Link to="/products" className="btn btn-outline btn-block">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
