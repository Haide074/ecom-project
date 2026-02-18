import { Mail, Phone, MapPin, Send, ShieldCheck, Clock, HelpCircle, MessageSquare, Truck, ArrowRight } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import './Contact.css';

const Contact = () => {
    const { theme } = useTheme();
    const contact = theme?.contact;
    const footer = theme?.footer;

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="container">
                    <div className="contact-hero-content">
                        <h1>{contact?.title || 'Contact Us'}</h1>
                        <p>{contact?.subtitle || 'Get in Touch'}</p>
                    </div>
                </div>
            </section>

            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        {/* Info Section */}
                        <div className="contact-info-cards">
                            <div className="info-card">
                                <div className="icon-wrapper">
                                    <Mail size={24} />
                                </div>
                                <div className="info-text">
                                    <h3>Email Us</h3>
                                    <p>{contact?.email || footer?.contactEmail || 'support@glownature.com'}</p>
                                    <span>Typically responds within 24 hours</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="icon-wrapper">
                                    <Phone size={24} />
                                </div>
                                <div className="info-text">
                                    <h3>Call Us</h3>
                                    <p>{contact?.phone || footer?.contactPhone || '(555) 123-4567'}</p>
                                    <span>Available for your queries</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="icon-wrapper">
                                    <MapPin size={24} />
                                </div>
                                <div className="info-text">
                                    <h3>Visit Our Store</h3>
                                    <p>{contact?.address || footer?.contactAddress || '123 Skincare Ave, Beauty City, BC 12345'}</p>
                                </div>
                            </div>

                            {/* Business Hours Section - Dynamic */}
                            {contact?.showBusinessHours !== false && (
                                <div className="business-hours">
                                    <h4>Business Hours</h4>
                                    <div className="hours-grid">
                                        {(contact?.businessHours && contact.businessHours.length > 0) ? (
                                            contact.businessHours.map((item, index) => (
                                                <div key={index} className="hours-item">
                                                    <span className="day">{item.day}</span>
                                                    <span className="time">{item.time}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="hours-item">
                                                    <span className="day">Mon - Fri</span>
                                                    <span className="time">9am - 6pm</span>
                                                </div>
                                                <div className="hours-item">
                                                    <span className="day">Saturday</span>
                                                    <span className="time">10am - 4pm</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* FAQ Link Section */}
                            <div className="contact-faq-link">
                                <p>Can't wait for a response?</p>
                                <a href="/faq">Visit our FAQ page <HelpCircle size={16} /></a>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="contact-form-container">
                            <form className="contact-form">
                                <h2>Send us a Message</h2>
                                <p>{contact?.description || 'We\'d love to hear from you. Reach out to us with any questions.'}</p>

                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="John Doe" className="input" />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="input" />
                                </div>

                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea placeholder="How can we help you?" className="input" rows="5"></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg w-full">
                                    Send Message
                                    <Send size={20} />
                                </button>

                                {/* Quick Actions Section - Dynamic */}
                                <div className="quick-actions">
                                    {(contact?.quickActions && contact.quickActions.length > 0) ? (
                                        contact.quickActions.map((action, index) => (
                                            <button key={index} type="button" className="quick-action-btn" onClick={() => window.location.href = action.link}>
                                                {action.label === 'Track Order' ? <Truck size={18} /> :
                                                    action.label === 'Live Chat' ? <MessageSquare size={18} /> :
                                                        <ArrowRight size={18} />}
                                                {action.label}
                                            </button>
                                        ))
                                    ) : (
                                        <>
                                            <button type="button" className="quick-action-btn">
                                                <Truck size={18} /> Track Order
                                            </button>
                                            <button type="button" className="quick-action-btn">
                                                <MessageSquare size={18} /> Live Chat
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Trust Badges Section - Dynamic */}
                    <div className="contact-trust-badges">
                        {(contact?.trustBadges && contact.trustBadges.length > 0) ? (
                            contact.trustBadges.map((badge, index) => (
                                <div key={index} className="trust-badge">
                                    {badge.text.toLowerCase().includes('secure') ? <ShieldCheck size={20} /> :
                                        badge.text.toLowerCase().includes('shipping') ? <Truck size={20} /> :
                                            <Clock size={20} />}
                                    <span>{badge.text}</span>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="trust-badge">
                                    <ShieldCheck size={20} />
                                    <span>Secure SSL Connection</span>
                                </div>
                                <div className="trust-badge">
                                    <Clock size={20} />
                                    <span>24/7 Support Available</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            {contact?.mapUrl && (
                <section className="contact-map">
                    <div className="container">
                        <iframe
                            src={contact.mapUrl}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Location Map"
                        ></iframe>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Contact;
