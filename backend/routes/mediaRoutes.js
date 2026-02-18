/**
 * Media Library Routes
 * Routes for uploading and managing images
 */

import express from 'express';
import multer from 'multer';
import {
    uploadImages,
    getImages,
    deleteImage,
    bulkDeleteImages,
} from '../controllers/mediaController.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// Routes
router.post('/upload', upload.array('images', 10), uploadImages);
router.get('/', getImages);
router.delete('/:publicId(*)', deleteImage);
router.post('/bulk-delete', bulkDeleteImages);

export default router;
