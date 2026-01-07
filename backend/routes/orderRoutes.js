/**
 * Order Routes
 */

import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders,
} from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateOrder, validateMongoId } from '../middleware/validation.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// User routes
router.post('/', paymentLimiter, validateOrder, createOrder);
router.get('/', getMyOrders);
router.get('/:id', validateMongoId('id'), getOrderById);
router.put('/:id/cancel', validateMongoId('id'), cancelOrder);

// Admin routes
router.get('/admin/all', requireAdmin, getAllOrders);
router.put('/:id/status', requireAdmin, validateMongoId('id'), updateOrderStatus);

export default router;
