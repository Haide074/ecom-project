/**
 * Product Routes
 */

import express from 'express';
import {
    getProducts,
    getFeaturedProducts,
<<<<<<< HEAD
    getProductByIdOrSlug,
=======
    getProductBySlug,
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
} from '../controllers/productController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateProduct, validateMongoId, validatePagination } from '../middleware/validation.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', validatePagination, getProducts);
router.get('/featured', getFeaturedProducts);
<<<<<<< HEAD
router.get('/:identifier', getProductByIdOrSlug);
=======
router.get('/:slug', getProductBySlug);
>>>>>>> f1461afba6691726c45e57258f8200351f2f126e

// Admin routes - AUTHENTICATION DISABLED
router.post('/', uploadProductImages, validateProduct, createProduct);
router.put('/:id', uploadProductImages, validateMongoId('id'), updateProduct);
router.delete('/:id', validateMongoId('id'), deleteProduct);
router.delete('/:productId/images/:imageId', deleteProductImage);

export default router;
