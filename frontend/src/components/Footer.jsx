import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
<<<<<<< HEAD
import useTheme from '../hooks/useTheme';
import './Footer.css';

const Footer = () => {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    const footer = theme?.footer;
    const logo = theme?.header?.logo;

=======
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-logo">
<<<<<<< HEAD
                            {logo?.image?.url ? (
                                <img
                                    src={logo.image.url}
                                    alt={logo.text || 'GlowNature'}
                                    style={{ maxHeight: '40px', objectFit: 'contain', marginBottom: '10px' }}
                                />
                            ) : (
                                <>
                                    <div className="logo-icon">
                                        <ShoppingCart size={28} />
                                    </div>
                                    <span className="logo-text">{logo?.text || 'GlowNature'}</span>
                                </>
                            )}
                        </div>
                        <p className="footer-description">
                            {footer?.tagline || 'Your premium destination for quality products. We bring you the best shopping experience with curated collections.'}
                        </p>
                        <div className="social-links">
                            {footer?.socialLinks?.facebook && (
                                <a href={footer.socialLinks.facebook} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                            )}
                            {footer?.socialLinks?.twitter && (
                                <a href={footer.socialLinks.twitter} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                    <Twitter size={20} />
                                </a>
                            )}
                            {footer?.socialLinks?.instagram && (
                                <a href={footer.socialLinks.instagram} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {footer?.socialLinks?.youtube && (
                                <a href={footer.socialLinks.youtube} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                    <Youtube size={20} />
                                </a>
                            )}
=======
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
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
<<<<<<< HEAD
                            {footer?.quickLinks?.length > 0 ? (
                                footer.quickLinks.map((link, index) => (
                                    <li key={index}><Link to={link.link}>{link.label}</Link></li>
                                ))
                            ) : (
                                <>
                                    <li><Link to="/products">Shop All</Link></li>
                                    <li><Link to="/categories">Categories</Link></li>
                                    <li><Link to="/deals">Special Deals</Link></li>
                                    <li><Link to="/new-arrivals">New Arrivals</Link></li>
                                    <li><Link to="/bestsellers">Bestsellers</Link></li>
                                </>
                            )}
=======
                            <li><Link to="/products">Shop All</Link></li>
                            <li><Link to="/categories">Categories</Link></li>
                            <li><Link to="/deals">Special Deals</Link></li>
                            <li><Link to="/new-arrivals">New Arrivals</Link></li>
                            <li><Link to="/bestsellers">Bestsellers</Link></li>
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="footer-section">
                        <h3 className="footer-title">Customer Service</h3>
                        <ul className="footer-links">
<<<<<<< HEAD
                            {footer?.customerService?.length > 0 ? (
                                footer.customerService.map((link, index) => (
                                    <li key={index}><Link to={link.link}>{link.label}</Link></li>
                                ))
                            ) : (
                                <>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                    <li><Link to="/shipping">Shipping Info</Link></li>
                                    <li><Link to="/returns">Returns & Exchanges</Link></li>
                                    <li><Link to="/faq">FAQ</Link></li>
                                    <li><Link to="/track-order">Track Order</Link></li>
                                </>
                            )}
=======
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/shipping">Shipping Info</Link></li>
                            <li><Link to="/returns">Returns & Exchanges</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/track-order">Track Order</Link></li>
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h3 className="footer-title">Get In Touch</h3>
                        <ul className="contact-info">
<<<<<<< HEAD
                            {footer?.contactEmail && (
                                <li>
                                    <Mail size={18} />
                                    <span>{footer.contactEmail}</span>
                                </li>
                            )}
                            {footer?.contactPhone && (
                                <li>
                                    <Phone size={18} />
                                    <span>{footer.contactPhone}</span>
                                </li>
                            )}
                            {footer?.contactAddress && (
                                <li>
                                    <MapPin size={18} />
                                    <span>{footer.contactAddress}</span>
                                </li>
                            )}
=======
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
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
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
<<<<<<< HEAD
                    <p>&copy; {currentYear} {footer?.companyName || 'ShopVibe'}. All rights reserved.</p>
=======
                    <p>&copy; {currentYear} ShopVibe. All rights reserved.</p>
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
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
