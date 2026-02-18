import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Star, Check, Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { productsAPI } from '../services/api';
import useCart from '../hooks/useCart';
import useToast from '../store/useToast';
import BuyNowModal from '../components/BuyNowModal';
import './ProductDetail.css';

const ProductDetail = () => {
    const { slug } = useParams();
    const { showToast } = useToast();
    const { addItem } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showBuyNow, setShowBuyNow] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productsAPI.getBySlug(slug),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const product = data?.data?.data?.product;

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            showToast(`Added ${quantity} ${product.name} to cart`, 'success');
        }
    };

    if (isLoading) {
        return (
            <div className="product-detail-loading">
                <div className="spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-error">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <Link to="/products" className="btn btn-primary">
                    Browse Products
                </Link>
            </div>
        );
    }

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0;

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="product-detail-grid">
                    {/* Product Images */}
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                src={product.images[selectedImage]?.url || '/placeholder.png'}
                                alt={product.name}
                            />
                            {discount > 0 && (
                                <div className="discount-badge">-{discount}%</div>
                            )}
                        </div>
                        {product.images.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={image.url} alt={`${product.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <h1 className="product-title">{product.name}</h1>

                        {/* Rating */}
                        {product.rating > 0 && (
                            <div className="product-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <span className="rating-text">
                                    {product.rating} ({product.reviewCount || 0} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="product-price">
                            <span className="current-price">Rs {product.price.toFixed(2)}</span>
                            {product.compareAtPrice && (
                                <span className="original-price">Rs {product.compareAtPrice.toFixed(2)}</span>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="product-description">{product.shortDescription || product.description}</p>

                        {/* Stock Status */}
                        <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? (
                                <>
                                    <Check size={18} />
                                    <span>In Stock ({product.stock} available)</span>
                                </>
                            ) : (
                                <span>Out of Stock</span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="product-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart size={20} />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={() => setShowBuyNow(true)}
                                disabled={product.stock === 0}
                            >
                                <CreditCard size={20} />
                                Buy Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature-item">
                                <Truck size={24} />
                                <div>
                                    <strong>Free Shipping</strong>
                                    <p>On orders over $50</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <Shield size={24} />
                                <div>
                                    <strong>Secure Payment</strong>
                                    <p>100% secure transactions</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <RotateCcw size={24} />
                                <div>
                                    <strong>Easy Returns</strong>
                                    <p>30-day return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="product-details-section">
                    <div className="details-tabs">
                        <h2>Product Details</h2>
                        <div className="details-content">
                            <div className="detail-block">
                                <h3>Description</h3>
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>

                            {product.specifications && product.specifications.length > 0 && (
                                <div className="detail-block">
                                    <h3>Specifications</h3>
                                    <table className="specs-table">
                                        <tbody>
                                            {product.specifications.map((spec, index) => (
                                                <tr key={index}>
                                                    <td className="spec-label">{spec.name}</td>
                                                    <td className="spec-value">{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Now Modal */}
            {showBuyNow && (
                <BuyNowModal
                    product={product}
                    onClose={() => setShowBuyNow(false)}
                />
            )}
        </div>
    );
};

export default ProductDetail;
