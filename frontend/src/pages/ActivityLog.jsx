import { useState, useEffect } from 'react';
import { TableSkeleton } from '../components/LoadingSkeleton';
import './Admin.css';

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            // API call would go here
            // const response = await getActivityLogs({ action: filter !== 'all' ? filter : undefined });
            // setLogs(response.data);

            // Mock data for now
            setLogs([]);
        } catch (err) {
            console.error('Failed to load activity logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        const icons = {
            create: '➕',
            update: '✏️',
            delete: '🗑️',
            login: '🔐',
            logout: '🚪',
        };
        return icons[action] || '📝';
    };

    const getActionColor = (action) => {
        const colors = {
            create: 'success',
            update: 'info',
            delete: 'error',
            login: 'primary',
            logout: 'warning',
        };
        return colors[action] || 'info';
    };

    if (loading) {
        return (
            <div className="activity-log">
                <div className="admin-table-container">
                    <TableSkeleton rows={15} columns={5} />
                </div>
            </div>
        );
    }

    return (
        <div className="activity-log">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Activity Log</h2>
                    <div className="admin-table-actions">
                        <select
                            className="admin-form-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="all">All Actions</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="login">Login</option>
                            <option value="logout">Logout</option>
                        </select>
                        <button className="admin-btn admin-btn-secondary">
                            📥 Export Log
                        </button>
                    </div>
                </div>

                {logs.length === 0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">📝</div>
                        <h3 className="admin-empty-title">No Activity Logs</h3>
                        <p className="admin-empty-description">
                            Activity logs will appear here as actions are performed
                        </p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Description</th>
                                    <th>Target</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <span className={`admin-badge ${getActionColor(log.action)}`}>
                                                {getActionIcon(log.action)} {log.action}
                                            </span>
                                        </td>
                                        <td>{log.user?.name || 'System'}</td>
                                        <td>{log.description}</td>
                                        <td>
                                            {log.targetModel && (
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                                    {log.targetModel}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
