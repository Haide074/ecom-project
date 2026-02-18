import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCartStore } from '../store';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addItem } = useCartStore();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const discountPercentage = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <Link to={`/products/${product.slug}`} className="product-card">
            <div className="product-image-wrapper">
                {discountPercentage > 0 && (
                    <div className="product-badge discount-badge">
                        {discountPercentage}% OFF
                    </div>
                )}
                {product.isFeatured && (
                    <div className="product-badge featured-badge">
                        Featured
                    </div>
                )}

                <div className="product-wishlist">
                    <button
                        className="wishlist-btn"
                        onClick={handleWishlist}
                        aria-label="Add to wishlist"
                    >
                        <Heart size={20} />
                    </button>
                </div>

                <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            loading="lazy"
                        />
                    ) : (
                        <div className="product-placeholder">
                            No image
                        </div>
                    )}
                </div>
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                <div className="product-price-section">
                    {discountPercentage > 0 && (
                        <div className="discount-tag">
                            {discountPercentage}% OFF
                        </div>
                    )}

                    <div className="price-container">
                        {/* Updated class names */}
                        <span className="currentprice1">
                            PKR {product.price.toLocaleString()}
                        </span>
                        {product.compareAtPrice && (
                            <span className="originalprice1">
                                PKR {product.compareAtPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                >
                    ADD TO BAG
                </button>

                {product.stock <= 0 && (
                    <span className="stock-status out-of-stock">Out of Stock</span>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;