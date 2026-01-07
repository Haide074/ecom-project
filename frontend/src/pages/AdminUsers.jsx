import { useEffect, useState } from 'react';
import { getAllUsers, toggleBlockUser, updateUserRole } from '../services/adminService';
import './Admin.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;

            const response = await getAllUsers(params);
            setUsers(response.data.users);
            setPagination(response.data.pagination);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (id, name, isBlocked) => {
        const action = isBlocked ? 'unblock' : 'block';
        if (!window.confirm(`Are you sure you want to ${action} "${name}"?`)) {
            return;
        }

        try {
            await toggleBlockUser(id);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${action} user`);
        }
    };

    const handleRoleChange = async (id, currentRole, name) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change "${name}" role to ${newRole}?`)) {
            return;
        }

        try {
            await updateUserRole(id, newRole);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading && users.length === 0) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Users Management</h2>
                    <div className="admin-table-actions">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="admin-search-input"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {error && (
                    <div style={{ padding: 'var(--space-6)', color: 'var(--color-error)' }}>
                        {error}
                    </div>
                )}

                {users.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">👥</div>
                        <h3 className="admin-empty-title">No Users Found</h3>
                        <p className="admin-empty-description">
                            {search ? 'Try a different search term' : 'No users registered yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            background: 'var(--gradient-primary)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            color: 'var(--color-white)',
                                                        }}
                                                    >
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{user.name}</span>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span
                                                    className={`admin-badge ${user.role === 'admin' ? 'primary' : 'info'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`admin-badge ${user.isBlocked ? 'error' : 'success'
                                                        }`}
                                                >
                                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    <button
                                                        className={`admin-btn admin-btn-sm ${user.role === 'admin'
                                                            ? 'admin-btn-secondary'
                                                            : 'admin-btn-primary'
                                                            }`}
                                                        onClick={() =>
                                                            handleRoleChange(user._id, user.role, user.name)
                                                        }
                                                        title={`Change to ${user.role === 'admin' ? 'user' : 'admin'
                                                            }`}
                                                    >
                                                        {user.role === 'admin' ? '👤' : '👑'}
                                                    </button>
                                                    <button
                                                        className={`admin-btn admin-btn-sm ${user.isBlocked
                                                            ? 'admin-btn-primary'
                                                            : 'admin-btn-danger'
                                                            }`}
                                                        onClick={() =>
                                                            handleToggleBlock(user._id, user.name, user.isBlocked)
                                                        }
                                                        disabled={user.role === 'admin'}
                                                        title={user.isBlocked ? 'Unblock user' : 'Block user'}
                                                    >
                                                        {user.isBlocked ? '✓' : '🚫'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="admin-pagination">
                                <button
                                    className="admin-pagination-btn"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    ← Previous
                                </button>
                                <span className="admin-pagination-info">
                                    Page {page} of {pagination.totalPages}
                                </span>
                                <button
                                    className="admin-pagination-btn"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
