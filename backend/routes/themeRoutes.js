/**
 * Theme Routes
 */

import express from 'express';
import { getActiveTheme, updateTheme, resetTheme } from '../controllers/themeController.js';

const router = express.Router();

// Public route
router.get('/', getActiveTheme);

// Admin routes - AUTHENTICATION DISABLED
router.put('/', updateTheme);
router.post('/reset', resetTheme);

export default router;
