import { useState } from 'react';
import useToast from '../store/useToast';
import './Admin.css';

const AdminDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const toast = useToast();

    return (
        <div className="admin-discounts">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2 className="admin-table-title">Discounts & Promotions</h2>
                    <div className="admin-table-actions">
                        <button className="admin-btn admin-btn-primary">
                            ➕ Create Discount
                        </button>
                    </div>
                </div>

                <div className="admin-empty-state">
                    <div className="admin-empty-icon">🎫</div>
                    <h3 className="admin-empty-title">No Discounts Yet</h3>
                    <p className="admin-empty-description">
                        Create discount codes and promotions to boost sales
                    </p>
                    <button className="admin-btn admin-btn-primary">
                        ➕ Create Your First Discount
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDiscounts;
