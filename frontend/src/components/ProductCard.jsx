import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCartStore } from '../store';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addItem } = useCartStore();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product, 1);
    };

    const discountPercentage = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <Link to={`/products/${product.slug}`} className="product-card">
            <div className="product-image-wrapper">
                {discountPercentage > 0 && (
                    <div className="product-badge discount-badge">
                        -{discountPercentage}%
                    </div>
                )}
                {product.isFeatured && (
                    <div className="product-badge featured-badge">
                        Featured
                    </div>
                )}
                <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url} alt={product.name} />
                    ) : (
                        <div className="product-placeholder">
                            <ShoppingCart size={48} />
                        </div>
                    )}
                </div>
                <div className="product-overlay">
                    <button
                        className="overlay-btn"
                        onClick={handleAddToCart}
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button className="overlay-btn" aria-label="Add to wishlist">
                        <Heart size={20} />
                    </button>
                </div>
            </div>

            <div className="product-info">
                <div className="product-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{product.averageRating || 0}</span>
                    <span className="review-count">({product.totalReviews || 0})</span>
                </div>

                <h3 className="product-name">{product.name}</h3>

                {product.shortDescription && (
                    <p className="product-description">{product.shortDescription}</p>
                )}

                <div className="product-footer">
                    <div className="product-price">
                        <span className="current-price">Rs {product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                            <span className="original-price">Rs {product.compareAtPrice.toFixed(2)}</span>
                        )}
                    </div>

                    {product.stock > 0 ? (
                        <span className="stock-status in-stock">In Stock</span>
                    ) : (
                        <span className="stock-status out-of-stock">Out of Stock</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
