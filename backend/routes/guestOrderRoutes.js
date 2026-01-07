/**
 * Guest Order Routes
 * Routes for handling orders without authentication
 */

import express from 'express';
import {
    createGuestOrder,
    getAllOrdersForAdmin,
    updateGuestOrderStatus,
} from '../controllers/guestOrderController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/', createGuestOrder);
router.get('/all', getAllOrdersForAdmin);
router.put('/:id/status', updateGuestOrderStatus);

export default router;
