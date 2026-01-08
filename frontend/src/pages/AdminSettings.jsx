import { useState } from 'react';
import './Admin.css';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        storeName: 'My Store',
        storeEmail: 'admin@store.com',
        currency: 'PKR',
        taxRate: 10,
        shippingCost: 5.99,
        enableReviews: true,
        enableCoupons: true,
        maintenanceMode: false,
    });

    const handleSave = () => {
        // Save settings API call
        alert('Settings saved successfully!');
    };

    return (
        <div className="admin-settings">
            <div className="admin-form">
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Store Settings</h2>

                <div className="admin-form-group">
                    <label className="admin-form-label required">Store Name</label>
                    <input
                        type="text"
                        className="admin-form-input"
                        value={settings.storeName}
                        onChange={(e) =>
                            setSettings({ ...settings, storeName: e.target.value })
                        }
                    />
                </div>

                <div className="admin-form-group">
                    <label className="admin-form-label required">Store Email</label>
                    <input
                        type="email"
                        className="admin-form-input"
                        value={settings.storeEmail}
                        onChange={(e) =>
                            setSettings({ ...settings, storeEmail: e.target.value })
                        }
                    />
                </div>

                <div className="admin-form-group">
                    <label className="admin-form-label">Currency</label>
                    <select
                        className="admin-form-select"
                        value={settings.currency}
                        onChange={(e) =>
                            setSettings({ ...settings, currency: e.target.value })
                        }
                    >
                        <option value="PKR">PKR - Pakistani Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                </div>

                <div className="admin-form-group">
                    <label className="admin-form-label">Tax Rate (%)</label>
                    <input
                        type="number"
                        className="admin-form-input"
                        value={settings.taxRate}
                        onChange={(e) =>
                            setSettings({ ...settings, taxRate: parseFloat(e.target.value) })
                        }
                        step="0.1"
                    />
                </div>

                <div className="admin-form-group">
                    <label className="admin-form-label">Default Shipping Cost</label>
                    <input
                        type="number"
                        className="admin-form-input"
                        value={settings.shippingCost}
                        onChange={(e) =>
                            setSettings({ ...settings, shippingCost: parseFloat(e.target.value) })
                        }
                        step="0.01"
                    />
                </div>

                <div className="admin-form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <input
                            type="checkbox"
                            checked={settings.enableReviews}
                            onChange={(e) =>
                                setSettings({ ...settings, enableReviews: e.target.checked })
                            }
                        />
                        <span className="admin-form-label" style={{ marginBottom: 0 }}>
                            Enable Product Reviews
                        </span>
                    </label>
                </div>

                <div className="admin-form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <input
                            type="checkbox"
                            checked={settings.enableCoupons}
                            onChange={(e) =>
                                setSettings({ ...settings, enableCoupons: e.target.checked })
                            }
                        />
                        <span className="admin-form-label" style={{ marginBottom: 0 }}>
                            Enable Discount Coupons
                        </span>
                    </label>
                </div>

                <div className="admin-form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(e) =>
                                setSettings({ ...settings, maintenanceMode: e.target.checked })
                            }
                        />
                        <span className="admin-form-label" style={{ marginBottom: 0 }}>
                            Maintenance Mode
                        </span>
                    </label>
                    <p className="admin-form-help">
                        When enabled, only admins can access the store
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-8)' }}>
                    <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                        💾 Save Settings
                    </button>
                    <button className="admin-btn admin-btn-secondary">
                        🔄 Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
