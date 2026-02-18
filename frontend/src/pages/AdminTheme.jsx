import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import useToast from '../store/useToast';
import './Admin.css';
import './AdminTheme.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminTheme = () => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
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
            // Invalidate the theme query so all components (Navbar, Footer, etc.) refresh
            queryClient.invalidateQueries({ queryKey: ['theme'] });
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
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
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
        // Ensure we handle nested object updates correctly by creating a new object
        if (field === 'image') {
            newFeatures[index] = {
                ...newFeatures[index],
                image: { ...newFeatures[index].image, ...value }
            };
        } else {
            newFeatures[index] = { ...newFeatures[index], [field]: value };
        }
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

    const updateFooterLink = (section, index, field, value) => {
        const newLinks = [...(theme.footer[section] || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setTheme({ ...theme, footer: { ...theme.footer, [section]: newLinks } });
    };

    const addFooterLink = (section) => {
        const newLinks = [
            ...(theme.footer[section] || []),
            { label: 'New Link', link: '/' },
        ];
        setTheme({ ...theme, footer: { ...theme.footer, [section]: newLinks } });
    };

    const removeFooterLink = (section, index) => {
        const newLinks = (theme.footer[section] || []).filter((_, i) => i !== index);
        setTheme({ ...theme, footer: { ...theme.footer, [section]: newLinks } });
    };

    const updateAboutItem = (section, index, field, value) => {
        const items = [...(theme.about[section] || [])];
        if (field === 'image') {
            items[index] = { ...items[index], image: { ...items[index].image, ...value } };
        } else {
            items[index] = { ...items[index], [field]: value };
        }
        setTheme({ ...theme, about: { ...theme.about, [section]: items } });
    };

    const addAboutItem = (section, defaultValue) => {
        const items = [...(theme.about[section] || []), defaultValue];
        setTheme({ ...theme, about: { ...theme.about, [section]: items } });
    };

    const removeAboutItem = (section, index) => {
        const items = (theme.about[section] || []).filter((_, i) => i !== index);
        setTheme({ ...theme, about: { ...theme.about, [section]: items } });
    };

    const updateContactItem = (section, index, field, value) => {
        const items = [...(theme.contact[section] || [])];
        items[index] = { ...items[index], [field]: value };
        setTheme({ ...theme, contact: { ...theme.contact, [section]: items } });
    };

    const addContactItem = (section, defaultValue) => {
        const items = [...(theme.contact[section] || []), defaultValue];
        setTheme({ ...theme, contact: { ...theme.contact, [section]: items } });
    };

    const removeContactItem = (section, index) => {
        const items = (theme.contact[section] || []).filter((_, i) => i !== index);
        setTheme({ ...theme, contact: { ...theme.contact, [section]: items } });
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

                    <div className="form-group">
                        <label>Banner Background Image (Optional)</label>
                        <input
                            type="url"
                            value={theme.banner?.image?.url || ''}
                            onChange={(e) => updateTheme('banner.image.url', e.target.value)}
                            className="input"
                            placeholder="Enter image URL or upload via Media Library"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            If set, this image will be displayed as banner background
                        </small>
                        {theme.banner?.image?.url && (
                            <div style={{ marginTop: '12px' }}>
                                <img
                                    src={theme.banner.image.url}
                                    alt="Banner preview"
                                    style={{ maxHeight: '100px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
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
                            <label>Primary Button Link</label>
                            <input
                                type="text"
                                value={theme.hero?.primaryButtonLink || '/products'}
                                onChange={(e) => updateTheme('hero.primaryButtonLink', e.target.value)}
                                className="input"
                                placeholder="/products"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Secondary Button Text</label>
                            <input
                                type="text"
                                value={theme.hero.secondaryButtonText}
                                onChange={(e) => updateTheme('hero.secondaryButtonText', e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Secondary Button Link</label>
                            <input
                                type="text"
                                value={theme.hero?.secondaryButtonLink || '/products'}
                                onChange={(e) => updateTheme('hero.secondaryButtonLink', e.target.value)}
                                className="input"
                                placeholder="/products"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Hero Image (Optional)</label>
                        <input
                            type="url"
                            value={theme.heroImage?.url || ''}
                            onChange={(e) => updateTheme('heroImage.url', e.target.value)}
                            className="input"
                            placeholder="Enter image URL or upload via Media Library"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            Featured image shown in the hero section
                        </small>
                        {theme.heroImage?.url && (
                            <div style={{ marginTop: '12px' }}>
                                <img
                                    src={theme.heroImage.url}
                                    alt="Hero image preview"
                                    style={{ maxHeight: '200px', borderRadius: '8px' }}
                                />
                            </div>
                        )}
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

                    {
                        theme.features.map((feature, index) => (
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
                                <div className="form-group">
                                    <label>Feature Image (Optional)</label>
                                    <input
                                        type="url"
                                        value={feature.image?.url || ''}
                                        onChange={(e) => updateFeature(index, 'image', { url: e.target.value })}
                                        className="input"
                                        placeholder="Enter image URL or upload via Media Library"
                                    />
                                    <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                                        Optional image to display with this feature (overrides icon if set)
                                    </small>
                                    {feature.image?.url && (
                                        <div style={{ marginTop: '12px' }}>
                                            <img
                                                src={feature.image.url}
                                                alt={feature.title}
                                                style={{ maxHeight: '80px', borderRadius: '8px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFeature(index)}
                                    className="btn btn-sm btn-outline"
                                >
                                    Remove Feature
                                </button>
                            </div>
                        ))
                    }
                    <button onClick={addFeature} className="btn btn-sm btn-outline">
                        + Add Feature
                    </button>
                </div>

                {/* Homepage settings */}
                <div className="theme-section card">
                    <h2>Homepage Settings</h2>
                    <div className="form-group">
                        <label>Featured Products Shown on Home</label>
                        <input
                            type="number"
                            value={theme.homepage?.featuredProductsCount || 8}
                            onChange={(e) => updateTheme('homepage.featuredProductsCount', parseInt(e.target.value))}
                            className="input"
                            min="4"
                            max="20"
                        />
                        <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                            Number of best-selling products to display on the home page.
                        </small>
                    </div>
                </div>

                {/* Product Grid Settings */}
                <div className="theme-section card">
                    <h2>Product Grid Layout</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>PC / Desktop (Products per row)</label>
                            <select
                                value={theme.productGrid?.pcPerRow || 4}
                                onChange={(e) => updateTheme('productGrid.pcPerRow', parseInt(e.target.value))}
                                className="input"
                            >
                                <option value={2}>2 Products</option>
                                <option value={3}>3 Products</option>
                                <option value={4}>4 Products</option>
                                <option value={5}>5 Products</option>
                                <option value={6}>6 Products</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Mobile / Tablet (Products per row)</label>
                            <select
                                value={theme.productGrid?.mobilePerRow || 2}
                                onChange={(e) => updateTheme('productGrid.mobilePerRow', parseInt(e.target.value))}
                                className="input"
                            >
                                <option value={1}>1 Product</option>
                                <option value={2}>2 Products</option>
                                <option value={3}>3 Products</option>
                            </select>
                        </div>
                    </div>
                    <small style={{ color: 'var(--color-gray-500)', display: 'block', marginTop: '4px' }}>
                        Control the visual density of your product grids on different screen sizes.
                    </small>
                </div>

                {/* CTA Section Settings */}
                <div className="theme-section card">
                    <h2>CTA Section (Below Products)</h2>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={theme.cta?.enabled ?? true}
                                onChange={(e) => updateTheme('cta.enabled', e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Enable CTA Section
                        </label>
                    </div>
                    <div className="form-group">
                        <label>CTA Title</label>
                        <input
                            type="text"
                            value={theme.cta?.title || ''}
                            onChange={(e) => updateTheme('cta.title', e.target.value)}
                            className="input"
                            placeholder="Begin Your Glow Journey"
                        />
                    </div>
                    <div className="form-group">
                        <label>CTA Description</label>
                        <textarea
                            value={theme.cta?.description || ''}
                            onChange={(e) => updateTheme('cta.description', e.target.value)}
                            className="input"
                            rows="2"
                            placeholder="Join thousands who've discovered their perfect skincare routine."
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Button Text</label>
                            <input
                                type="text"
                                value={theme.cta?.buttonText || ''}
                                onChange={(e) => updateTheme('cta.buttonText', e.target.value)}
                                className="input"
                                placeholder="Shop Collection"
                            />
                        </div>
                        <div className="form-group">
                            <label>Button Link</label>
                            <input
                                type="text"
                                value={theme.cta?.buttonLink || ''}
                                onChange={(e) => updateTheme('cta.buttonLink', e.target.value)}
                                className="input"
                                placeholder="/products"
                            />
                        </div>
                    </div>
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
                        <label>Contact Address</label>
                        <input
                            type="text"
                            value={theme.footer.contactAddress || ''}
                            onChange={(e) => updateTheme('footer.contactAddress', e.target.value)}
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Quick Links</label>
                        {(theme.footer.quickLinks || []).map((item, index) => (
                            <div key={index} className="nav-item-editor">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => updateFooterLink('quickLinks', index, 'label', e.target.value)}
                                    placeholder="Label"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => updateFooterLink('quickLinks', index, 'link', e.target.value)}
                                    placeholder="Link"
                                    className="input"
                                />
                                <button
                                    onClick={() => removeFooterLink('quickLinks', index)}
                                    className="btn btn-sm btn-outline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addFooterLink('quickLinks')} className="btn btn-sm btn-outline">
                            + Add Quick Link
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Customer Service Links</label>
                        {(theme.footer.customerService || []).map((item, index) => (
                            <div key={index} className="nav-item-editor">
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => updateFooterLink('customerService', index, 'label', e.target.value)}
                                    placeholder="Label"
                                    className="input"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => updateFooterLink('customerService', index, 'link', e.target.value)}
                                    placeholder="Link"
                                    className="input"
                                />
                                <button
                                    onClick={() => removeFooterLink('customerService', index)}
                                    className="btn btn-sm btn-outline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addFooterLink('customerService')} className="btn btn-sm btn-outline">
                            + Add Service Link
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Social Links</label>
                        <div className="social-links-editor" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                            <input
                                type="url"
                                value={theme.footer.socialLinks?.youtube || ''}
                                onChange={(e) => updateTheme('footer.socialLinks.youtube', e.target.value)}
                                placeholder="YouTube URL"
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

                    {
                        ['name', 'email', 'phone', 'address', 'city', 'province', 'zipCode', 'country'].map((field) => (
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
                        ))
                    }
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

                {/* About Page Settings */}
                <div className="theme-section card">
                    <h2>About Page Settings</h2>
                    <div className="form-group">
                        <label>Main Title</label>
                        <input
                            type="text"
                            value={theme.about?.title || ''}
                            onChange={(e) => updateTheme('about.title', e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={theme.about?.subtitle || ''}
                            onChange={(e) => updateTheme('about.subtitle', e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Main Content (Story)</label>
                        <textarea
                            value={theme.about?.content || ''}
                            onChange={(e) => updateTheme('about.content', e.target.value)}
                            className="input"
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>About Image URL</label>
                        <input
                            type="text"
                            value={theme.about?.image?.url || ''}
                            onChange={(e) => updateTheme('about.image.url', e.target.value)}
                            className="input"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Vision Title</label>
                            <input
                                type="text"
                                value={theme.about?.visionTitle || ''}
                                onChange={(e) => updateTheme('about.visionTitle', e.target.value)}
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Vision Content</label>
                            <textarea
                                value={theme.about?.visionContent || ''}
                                onChange={(e) => updateTheme('about.visionContent', e.target.value)}
                                className="input"
                                rows="2"
                            ></textarea>
                        </div>
                    </div>

                    <h3 style={{ marginTop: '20px' }}>Company Statistics</h3>
                    {(theme.about?.stats || []).map((stat, index) => (
                        <div key={index} className="nav-item-editor">
                            <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => updateAboutItem('stats', index, 'value', e.target.value)}
                                placeholder="Value (e.g. 10k+)"
                                className="input"
                            />
                            <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => updateAboutItem('stats', index, 'label', e.target.value)}
                                placeholder="Label (e.g. Customers)"
                                className="input"
                            />
                            <button onClick={() => removeAboutItem('stats', index)} className="btn btn-sm btn-outline">Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addAboutItem('stats', { label: 'New Stat', value: '0' })} className="btn btn-sm btn-outline">+ Add Stat</button>

                    <h3 style={{ marginTop: '20px' }}>Team Members</h3>
                    {(theme.about?.team || []).map((member, index) => (
                        <div key={index} className="theme-item-box" style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px' }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => updateAboutItem('team', index, 'name', e.target.value)}
                                        className="input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        value={member.role}
                                        onChange={(e) => updateAboutItem('team', index, 'role', e.target.value)}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    value={member.image?.url || ''}
                                    onChange={(e) => updateAboutItem('team', index, 'image', { url: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <button onClick={() => removeAboutItem('team', index)} className="btn btn-sm btn-outline" style={{ color: 'red' }}>Remove Member</button>
                        </div>
                    ))}
                    <h3 style={{ marginTop: '20px' }}>Our Values</h3>
                    {(theme.about?.values || []).map((value, index) => (
                        <div key={index} className="theme-item-box" style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px' }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Icon (Lucide Name)</label>
                                    <input
                                        type="text"
                                        value={value.icon}
                                        onChange={(e) => updateAboutItem('values', index, 'icon', e.target.value)}
                                        className="input"
                                        placeholder="shield, users, etc."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={value.title}
                                        onChange={(e) => updateAboutItem('values', index, 'title', e.target.value)}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={value.description}
                                    onChange={(e) => updateAboutItem('values', index, 'description', e.target.value)}
                                    className="input"
                                />
                            </div>
                            <button onClick={() => removeAboutItem('values', index)} className="btn btn-sm btn-outline" style={{ color: 'red' }}>Remove Value</button>
                        </div>
                    ))}
                    <button onClick={() => addAboutItem('values', { icon: 'shield', title: 'New Value', description: 'Value description' })} className="btn btn-sm btn-outline">+ Add Value</button>

                    <button onClick={() => addAboutItem('team', { name: 'New Member', role: 'Position', image: { url: '' } })} className="btn btn-sm btn-outline">+ Add Team Member</button>
                </div>

                {/* Contact Page Settings */}
                <div className="theme-section card">
                    <h2>Contact Page Settings</h2>
                    <div className="form-group">
                        <label>Main Title</label>
                        <input
                            type="text"
                            value={theme.contact?.title || ''}
                            onChange={(e) => updateTheme('contact.title', e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Subtitle</label>
                        <input
                            type="text"
                            value={theme.contact?.subtitle || ''}
                            onChange={(e) => updateTheme('contact.subtitle', e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Form Description</label>
                        <textarea
                            value={theme.contact?.description || ''}
                            onChange={(e) => updateTheme('contact.description', e.target.value)}
                            className="input"
                            rows="2"
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Email (Page Specific)</label>
                            <input
                                type="email"
                                value={theme.contact?.email || ''}
                                onChange={(e) => updateTheme('contact.email', e.target.value)}
                                className="input"
                                placeholder="Leave empty to use footer email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Phone (Page Specific)</label>
                            <input
                                type="tel"
                                value={theme.contact?.phone || ''}
                                onChange={(e) => updateTheme('contact.phone', e.target.value)}
                                className="input"
                                placeholder="Leave empty to use footer phone"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Contact Address (Page Specific)</label>
                        <input
                            type="text"
                            value={theme.contact?.address || ''}
                            onChange={(e) => updateTheme('contact.address', e.target.value)}
                            className="input"
                            placeholder="Leave empty to use footer address"
                        />
                    </div>

                    <div className="form-group">
                        <label>Google Maps Iframe URL (src)</label>
                        <input
                            type="text"
                            value={theme.contact?.mapUrl || ''}
                            onChange={(e) => updateTheme('contact.mapUrl', e.target.value)}
                            className="input"
                            placeholder="https://google.com/maps/embed?..."
                        />
                    </div>

                    <h3 style={{ marginTop: '20px' }}>
                        Business Hours
                        <label style={{ marginLeft: '15px', fontSize: 'var(--text-sm)', fontWeight: 'normal', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={theme.contact?.showBusinessHours ?? true}
                                onChange={(e) => updateTheme('contact.showBusinessHours', e.target.checked)}
                                style={{ marginRight: '6px' }}
                            />
                            Show on Page
                        </label>
                    </h3>
                    {(theme.contact?.businessHours || []).map((item, index) => (
                        <div key={index} className="nav-item-editor">
                            <input
                                type="text"
                                value={item.day}
                                onChange={(e) => updateContactItem('businessHours', index, 'day', e.target.value)}
                                placeholder="Day(s)"
                                className="input"
                            />
                            <input
                                type="text"
                                value={item.time}
                                onChange={(e) => updateContactItem('businessHours', index, 'time', e.target.value)}
                                placeholder="Time"
                                className="input"
                            />
                            <button onClick={() => removeContactItem('businessHours', index)} className="btn btn-sm btn-outline">Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addContactItem('businessHours', { day: 'Mon-Fri', time: '9-5' })} className="btn btn-sm btn-outline">+ Add Hours</button>

                    <h3 style={{ marginTop: '20px' }}>Trust Badges</h3>
                    {(theme.contact?.trustBadges || []).map((badge, index) => (
                        <div key={index} className="nav-item-editor">
                            <input
                                type="text"
                                value={badge.text}
                                onChange={(e) => updateContactItem('trustBadges', index, 'text', e.target.value)}
                                placeholder="Badge Text"
                                className="input"
                            />
                            <button onClick={() => removeContactItem('trustBadges', index)} className="btn btn-sm btn-outline">Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addContactItem('trustBadges', { text: 'Secure Payments', icon: 'shield' })} className="btn btn-sm btn-outline">+ Add Badge</button>

                    <h3 style={{ marginTop: '20px' }}>Quick Actions (Form Footer)</h3>
                    {(theme.contact?.quickActions || []).map((action, index) => (
                        <div key={index} className="nav-item-editor">
                            <input
                                type="text"
                                value={action.label}
                                onChange={(e) => updateContactItem('quickActions', index, 'label', e.target.value)}
                                placeholder="Label"
                                className="input"
                            />
                            <input
                                type="text"
                                value={action.link}
                                onChange={(e) => updateContactItem('quickActions', index, 'link', e.target.value)}
                                placeholder="Link"
                                className="input"
                            />
                            <button onClick={() => removeContactItem('quickActions', index)} className="btn btn-sm btn-outline">Remove</button>
                        </div>
                    ))}
                    <button onClick={() => addContactItem('quickActions', { label: 'Track Order', link: '/orders' })} className="btn btn-sm btn-outline">+ Add Action</button>
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
                </div >
            </div >

            <div className="save-footer">
                <button onClick={handleSave} className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? 'Saving Changes...' : 'Save All Changes'}
                </button>
            </div>
        </div >
    );
};

export default AdminTheme;
