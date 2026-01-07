/**
 * Admin Routes
 */

import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    updateUserRole,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCoupons,
    createCoupon,
    getActivityLogs,
    getAllProductsAdmin,
    updateProductStatus,
    toggleProductFeatured,
} from '../controllers/adminController.js';
// import { authenticate, requireAdmin } from '../middleware/auth.js'; // REMOVED - Authentication disabled
import { validateCoupon } from '../middleware/validation.js';

const router = express.Router();

// AUTHENTICATION DISABLED - All admin routes are now public

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/role', updateUserRole);

// Product management
router.get('/products', getAllProductsAdmin);
router.put('/products/:id/status', updateProductStatus);
router.put('/products/:id/featured', toggleProductFeatured);

// Category management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Coupon management
router.get('/coupons', getCoupons);
router.post('/coupons', validateCoupon, createCoupon);

// Activity logs
router.get('/activity-logs', getActivityLogs);

export default router;
