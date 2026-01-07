/**
 * File Upload Middleware
 * Multer configuration for image uploads
 */

import multer from 'multer';
import path from 'path';
import { ApiError } from './errorHandler.js';

/**
 * Configure multer storage
 * Using memory storage for direct upload to Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * File filter - only allow images
 */
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
    }
};

/**
 * Multer upload configuration
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
    fileFilter: fileFilter,
});

/**
 * Single image upload
 */
export const uploadSingle = upload.single('image');

/**
 * Multiple images upload (max 10)
 */
export const uploadMultiple = upload.array('images', 10);

/**
 * Product images upload (max 10)
 */
export const uploadProductImages = upload.array('images', 10);

/**
 * Avatar upload
 */
export const uploadAvatar = upload.single('avatar');

/**
 * Review images upload (max 5)
 */
export const uploadReviewImages = upload.array('images', 5);

export default upload;
