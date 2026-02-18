import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const closeSidebar = () => {
        if (window.innerWidth <= 1024) {
            setSidebarOpen(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navItems = [
        {
            section: 'Main',
            items: [
                { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
            ],
        },
        {
            section: 'Management',
            items: [
                { path: '/admin/products', icon: '📦', label: 'Products' },
                { path: '/admin/categories', icon: '🏷️', label: 'Categories' },
                { path: '/admin/orders', icon: '🛒', label: 'Orders' },
                { path: '/admin/inventory', icon: '📋', label: 'Inventory' },
                { path: '/admin/users', icon: '👥', label: 'Users' },
            ],
        },
        {
            section: 'Content',
            items: [
                { path: '/admin/media', icon: '🖼️', label: 'Media Library' },
                { path: '/admin/discounts', icon: '🎫', label: 'Discounts' },
            ],
        },
        {
            section: 'System',
            items: [
                { path: '/admin/theme', icon: '🎨', label: 'Theme' },
                { path: '/admin/activity', icon: '📝', label: 'Activity Log' },
                { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
            ],
        },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar Overlay for Mobile */}
            <div
                className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        <span className="admin-logo-icon">🛍️</span>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    {navItems.map((section, idx) => (
                        <div key={idx} className="admin-nav-section">
                            <div className="admin-nav-title">{section.section}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`admin-nav-link ${item.exact
                                        ? location.pathname === item.path
                                            ? 'active'
                                            : ''
                                        : isActive(item.path)
                                            ? 'active'
                                            : ''
                                        }`}
                                    onClick={closeSidebar}
                                >
                                    <span className="admin-nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button
                            className="admin-menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle menu"
                        >
                            ☰
                        </button>
                        <h1 className="admin-header-title">
                            {location.pathname === '/admin'
                                ? 'Dashboard'
                                : location.pathname.includes('/products')
                                    ? 'Products'
                                    : location.pathname.includes('/categories')
                                        ? 'Categories'
                                        : location.pathname.includes('/users')
                                            ? 'Users'
                                            : 'Admin'}
                        </h1>
                    </div>

                    <div className="admin-header-right">
                        <div className="admin-user-info">
                            <div className="admin-user-avatar">
                                {user.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <span className="admin-user-name">{user.name || 'Admin'}</span>
                        </div>
                        <button className="admin-logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
