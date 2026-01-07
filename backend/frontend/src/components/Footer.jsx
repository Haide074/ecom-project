import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-logo">
                            <div className="logo-icon">
                                <ShoppingCart size={28} />
                            </div>
                            <span className="logo-text">ShopVibe</span>
                        </div>
                        <p className="footer-description">
                            Your premium destination for quality products. We bring you the best shopping experience with curated collections and unbeatable prices.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/products">Shop All</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/deals">Special Deals</Link></li>
                            <li><Link to="/new-arrivals">New Arrivals</Link></li>
                            <li><Link to="/bestsellers">Bestsellers</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h3 className="footer-title">Customer Service</h3>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/shipping">Shipping Info</Link></li>
                            <li><Link to="/returns">Returns & Exchanges</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/track-order">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h3 className="footer-title">Get In Touch</h3>
                        <ul className="contact-info">
                            <li>
                                <Mail size={18} />
                                <span>support@shopvibe.com</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li>
                                <MapPin size={18} />
                                <span>123 Commerce St, NY 10001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="newsletter-section">
                    <div className="newsletter-content">
                        <div className="newsletter-text">
                            <h3>Subscribe to Our Newsletter</h3>
                            <p>Get the latest updates on new products and exclusive offers!</p>
                        </div>
                        <form className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="btn btn-primary">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>&copy; {currentYear} ShopVibe. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cookies">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
