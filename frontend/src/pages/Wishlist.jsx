import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useWishlistStore, useCartStore } from '../store';
import useToast from '../store/useToast';
import './Cart.css'; // Reuse cart styles for consistency

const Wishlist = () => {
    const { wishlist, toggleWishlist, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();
    const { showToast } = useToast();

    const handleAddToCart = (product) => {
        addItem(product, 1);
        showToast(`Added ${product.name} to bag`, 'success');
    };

    const handleRemove = (product) => {
        toggleWishlist(product);
        showToast(`Removed ${product.name} from wishlist`, 'info');
    };

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
                <div className="cart-empty">
                    <ShoppingBag size={64} className="cart-empty-icon" />
                    <h2>Your wishlist is empty</h2>
                    <p>Save items you love to your wishlist!</p>
                    <Link to="/products" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', minHeight: '60vh' }}>
            <div className="cart-page">
                <div className="cart-header">
                    <h1>My Wishlist</h1>
                    <button onClick={clearWishlist} className="btn btn-outline">
                        Clear Wishlist
                    </button>
                </div>

                <div className="cart-content" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="cart-items">
                        {wishlist.map((product) => {
                            const productId = product._id || product.id;
                            let imageUrl = product.images?.[0]?.url || product.image || '/placeholder.jpg';

                            return (
                                <div key={productId} className="cart-item">
                                    <div className="cart-item-image">
                                        <Link to={`/products/${product.slug}`}>
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                        </Link>
                                    </div>
                                    <div className="cart-item-details">
                                        <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <h3>{product.name}</h3>
                                        </Link>
                                        <p className="cart-item-price">Rs {product.price?.toLocaleString()}</p>
                                    </div>
                                    <div className="cart-item-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Add to Bag
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product)}
                                            className="cart-item-remove"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
