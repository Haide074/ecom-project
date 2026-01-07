import { useState, useEffect } from 'react';
import axios from 'axios';
import useToast from '../store/useToast';
import './Admin.css';
import './AdminTheme.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminTheme = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        fetchTheme();
    }, []);

    const fetchTheme = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/theme`);
            setTheme(data.data.theme);
        } catch (error) {
            showToast('Failed to load theme settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_URL}/theme`, theme);
            showToast('Theme updated successfully!', 'success');
        } catch (error) {
            showToast('Failed to update theme', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Are you sure you want to reset to default theme?')) return;

        try {
            setSaving(true);
            const { data } = await axios.post(`${API_URL}/theme/reset`);
            setTheme(data.data.theme);
            showToast('Theme reset to defaults', 'success');
        } catch (error) {
            showToast('Failed to reset theme', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateTheme = (path, value) => {
        setTheme((prev) => {
            const newTheme = { ...prev };
            const keys = path.split('.');
            let current = newTheme;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newTheme;
        });
    };

    const updateNavItem = (index, field, value) => {
        const newNav = [...theme.header.navigation];
        newNav[index][field] = value;
        setTheme({ ...theme, header: { ...theme.header, navigation: newNav } });
    };

    const addNavItem = () => {
        const newNav = [
            ...theme.header.navigation,
            { label: 'New Link', link: '/', order: theme.header.navigation.length + 1 },
        ];
        setTheme({ ...theme, header: { ...theme.header, navigation: newNav } });
    };

    const removeNavItem = (index) => {
        const newNav = theme.header.navigation.filter((_, i) => i !== index);
        setTheme({ ...theme, header: { ...theme.header, navigation: newNav } });
    };

    const updateFeature = (index, field, value) => {
        const newFeatures = [...theme.features];
        newFeatures[index][field] = value;
        setTheme({ ...theme, features: newFeatures });
    };

    const addFeature = () => {
        const newFeatures = [
            ...theme.features,
            {
                icon: 'star',
                title: 'New Feature',
                description: 'Description',
                order: theme.features.length + 1,
            },
        ];
        setTheme({ ...theme, features: newFeatures });
    };

    const removeFeature = (index) => {
        const newFeatures = theme.features.filter((_, i) => i !== index);
        setTheme({ ...theme, features: newFeatures });
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading">Loading theme settings...</div>
            </div>
        );
    }

    if (!theme) return null;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1>Theme Customization</h1>
                    <p>Customize your website's appearance</p>
                </div>
                <div className="header-actions">
                    <button onClick={handleReset} className="btn btn-outline" disabled={saving}>
                        Reset to Default
                    </button>
                    <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="theme-sections">
                {/* Header Settings */}
                <div className="theme-section card">
                    <h2>Header Settings</h2>

                    <div className="form-group">
                        <label>Logo Text</label>
                        <input
                            type="text"
                            value={theme.header.logo.text}
                            onChange={(e) => updateTheme('header.logo.text', e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Logo Icon (Lucide React icon name)</label>
                        <input
                            type="text"
                            value={theme.header.logo.icon}
                            onChange={(e) => updateTheme('header.logo.icon', e.target.value)}
                            className="input"
                            placeholder="e.g., sparkles, heart, star"
                        />
                    </div>

                    <div className="form-group">
                        <label>Navigation Links</label>
                        {theme.header.navigation.map((item, index) => (
                            <div key={index} className="nav-item-editor">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                                    placeholder="Label"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => updateNavItem(index, 'link', e.target.value)}
                                    placeholder="Link"
                                    className="input"
                                />
                                <button
                                    onClick={() => removeNavItem(index)}
                                    className="btn btn-sm btn-outline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button onClick={addNavItem} className="btn btn-sm btn-outline">
                            + Add Navigation Link
                        </button>
                    </div>

                    <div className="color-row">
                        <div className="form-group">
                            <label>Background Color</label>
                            <input
                                type="color"
                                value={theme.header.backgroundColor}
                                onChange={(e) => updateTheme('header.backgroundColor', e.target.value)}
                                className="color-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Text Color</label>
                            <input
                                type="color"
                                value={theme.header.textColor}
                                onChange={(e) => updateTheme('header.textColor', e.target.value)}
                                className="color-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Logo & Favicon Upload */}
                <div className="theme-section card">
                    <h2>Logo & Favicon</h2>

                    <div className="form-group">
                        <label>Header Logo Image (Optional)</label>
                        <input
                            type="url"
                            value={theme.header?.logo?.image?.url || ''}
                            onChange={(e) => updateTheme('header.logo.image.url', e.target.value)}
                            className="input"
                            placeholder="Enter image URL or upload via Media Library"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            If set, this image will be used instead of logo text/icon
                        </small>
                        {theme.header?.logo?.image?.url && (
                            <div style={{ marginTop: '12px' }}>
                                <img
                                    src={theme.header.logo.image.url}
                                    alt="Logo preview"
                                    style={{ maxHeight: '60px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Website Favicon (Browser Tab Icon)</label>
                        <input
                            type="url"
                            value={theme.favicon?.url || ''}
                            onChange={(e) => updateTheme('favicon.url', e.target.value)}
                            className="input"
                            placeholder="Enter favicon URL (.ico, .png, or .svg)"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            Recommended size: 32x32px or 64x64px
                        </small>
                        {theme.favicon?.url && (
                            <div style={{ marginTop: '12px' }}>
                                <img
                                    src={theme.favicon.url}
                                    alt="Favicon preview"
                                    style={{ maxHeight: '32px', borderRadius: '4px' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Banner Section */}
                <div className="theme-section card">
                    <h2>Top Banner</h2>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={theme.banner?.enabled || false}
                                onChange={(e) => updateTheme('banner.enabled', e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Enable Top Banner
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Banner Text</label>
                        <input
                            type="text"
                            value={theme.banner?.text || ''}
                            onChange={(e) => updateTheme('banner.text', e.target.value)}
                            className="input"
                            placeholder="Special Offer: Get 20% off!"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Button Text</label>
                            <input
                                type="text"
                                value={theme.banner?.buttonText || ''}
                                onChange={(e) => updateTheme('banner.buttonText', e.target.value)}
                                className="input"
                                placeholder="Shop Now"
                            />
                        </div>
                        <div className="form-group">
                            <label>Button Link</label>
                            <input
                                type="text"
                                value={theme.banner?.buttonLink || ''}
                                onChange={(e) => updateTheme('banner.buttonLink', e.target.value)}
                                className="input"
                                placeholder="/products"
                            />
                        </div>
                    </div>

                    <div className="color-row">
                        <div className="form-group">
                            <label>Background Color</label>
                            <input
                                type="color"
                                value={theme.banner?.backgroundColor || '#7c3aed'}
                                onChange={(e) => updateTheme('banner.backgroundColor', e.target.value)}
                                className="color-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Text Color</label>
                            <input
                                type="color"
                                value={theme.banner?.textColor || '#ffffff'}
                                onChange={(e) => updateTheme('banner.textColor', e.target.value)}
                                className="color-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="theme-section card">
                    <h2>Hero Section</h2>

                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={theme.hero.title}
                            onChange={(e) => updateTheme('hero.title', e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={theme.hero.subtitle}
                            onChange={(e) => updateTheme('hero.subtitle', e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={theme.hero.description}
                            onChange={(e) => updateTheme('hero.description', e.target.value)}
                            className="input"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Primary Button Text</label>
                            <input
                                type="text"
                                value={theme.hero.primaryButtonText}
                                onChange={(e) => updateTheme('hero.primaryButtonText', e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Secondary Button Text</label>
                            <input
                                type="text"
                                value={theme.hero.secondaryButtonText}
                                onChange={(e) => updateTheme('hero.secondaryButtonText', e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Background Gradient</label>
                        <input
                            type="text"
                            value={theme.hero.backgroundGradient}
                            onChange={(e) => updateTheme('hero.backgroundGradient', e.target.value)}
                            className="input"
                            placeholder="e.g., linear-gradient(135deg, #fef5f8 0%, #f0f4f8 100%)"
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="theme-section card">
                    <h2>Features Section</h2>

                    {theme.features.map((feature, index) => (
                        <div key={index} className="feature-editor">
                            <h4>Feature {index + 1}</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Icon (Lucide React)</label>
                                    <input
                                        type="text"
                                        value={feature.icon}
                                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={feature.description}
                                    onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                    className="input"
                                />
                            </div>
                            <button
                                onClick={() => removeFeature(index)}
                                className="btn btn-sm btn-outline"
                            >
                                Remove Feature
                            </button>
                        </div>
                    ))}
                    <button onClick={addFeature} className="btn btn-sm btn-outline">
                        + Add Feature
                    </button>
                </div>

                {/* Footer Settings */}
                <div className="theme-section card">
                    <h2>Footer Settings</h2>

                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            value={theme.footer.companyName}
                            onChange={(e) => updateTheme('footer.companyName', e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Tagline</label>
                        <input
                            type="text"
                            value={theme.footer.tagline}
                            onChange={(e) => updateTheme('footer.tagline', e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input
                                type="email"
                                value={theme.footer.contactEmail}
                                onChange={(e) => updateTheme('footer.contactEmail', e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Phone</label>
                            <input
                                type="tel"
                                value={theme.footer.contactPhone}
                                onChange={(e) => updateTheme('footer.contactPhone', e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Social Links</label>
                        <div className="social-links-editor">
                            <input
                                type="url"
                                value={theme.footer.socialLinks?.facebook || ''}
                                onChange={(e) => updateTheme('footer.socialLinks.facebook', e.target.value)}
                                placeholder="Facebook URL"
                                className="input"
                            />
                            <input
                                type="url"
                                value={theme.footer.socialLinks?.instagram || ''}
                                onChange={(e) => updateTheme('footer.socialLinks.instagram', e.target.value)}
                                placeholder="Instagram URL"
                                className="input"
                            />
                            <input
                                type="url"
                                value={theme.footer.socialLinks?.twitter || ''}
                                onChange={(e) => updateTheme('footer.socialLinks.twitter', e.target.value)}
                                placeholder="Twitter URL"
                                className="input"
                            />
                        </div>
                    </div>

                    <div className="color-row">
                        <div className="form-group">
                            <label>Background Color</label>
                            <input
                                type="color"
                                value={theme.footer.backgroundColor}
                                onChange={(e) => updateTheme('footer.backgroundColor', e.target.value)}
                                className="color-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Text Color</label>
                            <input
                                type="color"
                                value={theme.footer.textColor}
                                onChange={(e) => updateTheme('footer.textColor', e.target.value)}
                                className="color-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Checkout Settings */}
                <div className="theme-section card">
                    <h2>Checkout Settings</h2>

                    <div className="form-group">
                        <label>Shipping Price (Rs)</label>
                        <input
                            type="number"
                            value={theme.checkout?.shippingPrice || 0}
                            onChange={(e) => updateTheme('checkout.shippingPrice', parseFloat(e.target.value) || 0)}
                            className="input"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            Set to 0 for free shipping
                        </small>
                    </div>

                    <h3 style={{ marginTop: '24px', marginBottom: '16px', fontSize: 'var(--text-lg)' }}>
                        Customer Information Fields
                    </h3>

                    {['name', 'email', 'phone', 'address', 'city', 'province', 'zipCode', 'country'].map((field) => (
                        <div key={field} className="checkout-field-row">
                            <div className="field-name">{field.charAt(0).toUpperCase() + field.slice(1)}</div>
                            <div className="field-toggles">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={theme.checkout?.fields?.[field]?.enabled || false}
                                        onChange={(e) => updateTheme(`checkout.fields.${field}.enabled`, e.target.checked)}
                                    />
                                    <span>Enabled</span>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={theme.checkout?.fields?.[field]?.required || false}
                                        onChange={(e) => updateTheme(`checkout.fields.${field}.required`, e.target.checked)}
                                        disabled={!theme.checkout?.fields?.[field]?.enabled}
                                    />
                                    <span>Required</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                {/* WhatsApp Settings */}
                <div className="theme-section card">
                    <h2>WhatsApp Settings</h2>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={theme.whatsapp?.enabled || false}
                                onChange={(e) => updateTheme('whatsapp.enabled', e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Enable WhatsApp Button
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Phone Number (with country code)</label>
                        <input
                            type="tel"
                            value={theme.whatsapp?.phoneNumber || ''}
                            onChange={(e) => updateTheme('whatsapp.phoneNumber', e.target.value)}
                            className="input"
                            placeholder="e.g., +1234567890"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            Enter phone number with country code (e.g., +1 for US, +92 for Pakistan)
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Message Template</label>
                        <textarea
                            value={theme.whatsapp?.message || ''}
                            onChange={(e) => updateTheme('whatsapp.message', e.target.value)}
                            className="input"
                            rows="3"
                            placeholder="Hi! I'm interested in your product..."
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            This message will be pre-filled when users click the WhatsApp button
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Button Tooltip Text</label>
                        <input
                            type="text"
                            value={theme.whatsapp?.buttonText || ''}
                            onChange={(e) => updateTheme('whatsapp.buttonText', e.target.value)}
                            className="input"
                            placeholder="Chat with us"
                        />
                    </div>
                </div>

                {/* Color Scheme */}
                <div className="theme-section card">
                    <h2>Color Scheme</h2>

                    <div className="color-row">
                        <div className="form-group">
                            <label>Primary Color</label>
                            <input
                                type="text"
                                value={theme.colors.primary}
                                onChange={(e) => updateTheme('colors.primary', e.target.value)}
                                className="input"
                                placeholder="hsl(350, 35%, 75%)"
                            />
                        </div>
                        <div className="form-group">
                            <label>Secondary Color</label>
                            <input
                                type="text"
                                value={theme.colors.secondary}
                                onChange={(e) => updateTheme('colors.secondary', e.target.value)}
                                className="input"
                                placeholder="hsl(270, 30%, 70%)"
                            />
                        </div>
                        <div className="form-group">
                            <label>Accent Color</label>
                            <input
                                type="text"
                                value={theme.colors.accent}
                                onChange={(e) => updateTheme('colors.accent', e.target.value)}
                                className="input"
                                placeholder="hsl(160, 35%, 75%)"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="save-footer">
                <button onClick={handleSave} className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? 'Saving Changes...' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
};

export default AdminTheme;
