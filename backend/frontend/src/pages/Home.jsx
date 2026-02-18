import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles, Shield, Leaf, Award, Star } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import useTheme from '../hooks/useTheme';
import './Home.css';

// Icon mapping for dynamic icons
const iconMap = {
    sparkles: Sparkles,
    shield: Shield,
    leaf: Leaf,
    award: Award,
    star: Star,
};

const Home = () => {
    const { theme, isLoading: themeLoading } = useTheme();
    const { data: featuredProducts, isLoading: productsLoading } = useQuery({
        queryKey: ['featured-products'],
        queryFn: () => productsAPI.getFeatured(),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Use theme data or fallback to defaults
    const heroTitle = theme?.hero?.title || 'Radiant Skin';
    const heroSubtitle = theme?.hero?.subtitle || 'Naturally Yours';
    const heroDescription = theme?.hero?.description || 'Premium skincare crafted with nature\'s finest ingredients.';
    const primaryButtonText = theme?.hero?.primaryButtonText || 'Explore Products';
    const secondaryButtonText = theme?.hero?.secondaryButtonText || 'Find Your Routine';
    const heroStats = theme?.heroStats || [];
    const heroImage = theme?.heroImage;
    const features = theme?.features || [];
    const tiktokVideos = theme?.tiktokVideos || [];

    const getIcon = (iconName) => {
        const IconComponent = iconMap[iconName?.toLowerCase()] || Sparkles;
        return <IconComponent size={32} />;
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="hero-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                    </div>
                </div>

                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title animate-fade-in">
                            {heroTitle}
                            <span className="text-gradient">{heroSubtitle}</span>
                        </h1>
                        <p className="hero-description animate-fade-in">
                            {heroDescription}
                        </p>
                        <div className="hero-actions animate-fade-in">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                {primaryButtonText}
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/products" className="btn btn-secondary btn-lg">
                                {secondaryButtonText}
                            </Link>
                        </div>

                        {/* Dynamic Hero Stats */}
                        {heroStats.length > 0 && (
                            <div className="hero-stats">
                                {heroStats.sort((a, b) => (a.order || 0) - (b.order || 0)).map((stat, index) => (
                                    <div key={index}>
                                        <div className="stat-item">
                                            <div className="stat-number">{stat.value}</div>
                                            <div className="stat-label">{stat.label}</div>
                                        </div>
                                        {index < heroStats.length - 1 && <div className="stat-divider"></div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hero-image">
                        {heroImage?.url ? (
                            <div className="hero-image-wrapper">
                                <img
                                    src={heroImage.url}
                                    alt={heroImage.alt || 'Hero banner'}
                                    className="hero-banner-image"
                                />
                            </div>
                        ) : (
                            <div className="hero-image-wrapper">
                                <div className="floating-card card-1">
                                    <div className="card-icon">🌿</div>
                                    <div className="card-text">
                                        <div className="card-title">Organic & Pure</div>
                                        <div className="card-subtitle">100% Natural</div>
                                    </div>
                                </div>
                                <div className="floating-card card-2">
                                    <div className="card-icon">✨</div>
                                    <div className="card-text">
                                        <div className="card-title">Visible Results</div>
                                        <div className="card-subtitle">In 7 Days</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            {features.length > 0 && (
                <section className="features-section">
                    <div className="container">
                        <div className="features-grid">
                            {features.sort((a, b) => (a.order || 0) - (b.order || 0)).map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-icon">{getIcon(feature.icon)}</div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* TikTok Videos Section */}
            {tiktokVideos.length > 0 && (
                <section className="tiktok-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">See It In Action</h2>
                            <p className="section-subtitle">Real results from our community</p>
                        </div>
                        <div className="tiktok-grid">
                            {tiktokVideos.sort((a, b) => (a.order || 0) - (b.order || 0)).map((video, index) => (
                                <div key={index} className="tiktok-video-wrapper">
                                    <iframe
                                        src={video.url}
                                        title={video.title || `TikTok Video ${index + 1}`}
                                        allowFullScreen
                                        scrolling="no"
                                        allow="encrypted-media"
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Best Sellers</h2>
                            <p className="section-subtitle">Our most-loved skincare essentials</p>
                        </div>
                        <Link to="/products" className="btn btn-outline">
                            View All
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    {productsLoading ? (
                        <div className="products-grid">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: '400px' }}></div>
                            ))}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts?.data?.data?.products?.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2 className="cta-title">Begin Your Glow Journey</h2>
                            <p className="cta-description">
                                Join thousands who've discovered their perfect skincare routine. Natural beauty starts here.
                            </p>
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Collection
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="cta-decoration">
                            <div className="decoration-circle circle-1"></div>
                            <div className="decoration-circle circle-2"></div>
                            <div className="decoration-circle circle-3"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
