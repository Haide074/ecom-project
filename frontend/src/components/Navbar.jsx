import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, LogOut, Sparkles } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import useTheme from '../hooks/useTheme';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { isAuthenticated, user, logout } = useAuthStore();
    const { getItemCount } = useCartStore();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const cartItemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <Sparkles size={28} />
                    </div>
                    <span className="logo-text">{theme?.header?.logo?.text || 'GlowNature'}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-menu">
                    {theme?.header?.navigation?.sort((a, b) => (a.order || 0) - (b.order || 0)).map((navItem, index) => (
                        <Link key={index} to={navItem.link} className="nav-link">{navItem.label}</Link>
                    ))}
                </div>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </form>

                {/* Actions */}
                <div className="navbar-actions">
                    <button className="nav-icon-btn" aria-label="Wishlist">
                        <Heart size={22} />
                    </button>

                    <Link to="/cart" className="nav-icon-btn cart-btn" aria-label="Cart">
                        <ShoppingCart size={22} />
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="nav-icon-btn user-btn">
                                <User size={22} />
                            </button>
                            <div className="user-dropdown">
                                <Link to="/profile" className="dropdown-item">
                                    <User size={18} />
                                    <span>Profile</span>
                                </Link>
                                <Link to="/orders" className="dropdown-item">
                                    <ShoppingCart size={18} />
                                    <span>Orders</span>
                                </Link>
                                <button onClick={handleLogout} className="dropdown-item">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Shop
                    </Link>
                    <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        Skincare
                    </Link>
                    <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                        About
                    </Link>
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
