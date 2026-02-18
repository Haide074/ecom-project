/**
 * Supabase Storage Helper
 * Handles file uploads to Supabase Storage
 * Replaces Cloudinary for image storage
 */

import supabase from './supabase.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const BUCKET_NAME = 'product-images';

/**
 * Upload image to Supabase Storage
 * @param {string|Object} filePathOrObject - Local file path OR multer file object with buffer
 * @param {string} folder - Folder name in bucket (e.g., 'products', 'banners')
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (filePathOrObject, folder = 'products') => {
    if (!supabase) {
        throw new Error('Supabase client not initialized. Check your environment variables.');
    }

    try {
        let fileBuffer;
        let fileExt;
        let filePath;

        // Debug: Log what we received
        console.log('uploadImage received:', {
            type: typeof filePathOrObject,
            isString: typeof filePathOrObject === 'string',
            hasBuffer: filePathOrObject?.buffer !== undefined,
            keys: filePathOrObject && typeof filePathOrObject === 'object' ? Object.keys(filePathOrObject) : 'N/A'
        });

        // Handle both file path (string) and multer file object (with buffer)
        if (typeof filePathOrObject === 'string') {
            // Traditional file path
            filePath = filePathOrObject;
            fileBuffer = fs.readFileSync(filePath);
            fileExt = filePath.split('.').pop();
        } else if (filePathOrObject && filePathOrObject.buffer) {
            // Multer memory storage file object
            fileBuffer = filePathOrObject.buffer;
            fileExt = filePathOrObject.originalname.split('.').pop();
            filePath = null; // No file path to clean up
        } else {
            throw new Error(`Invalid file input. Expected file path or multer file object. Received: ${JSON.stringify(filePathOrObject)}`);
        }

        const fileName = `${folder}/${uuidv4()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: `image/${fileExt}`,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw new Error(`Supabase upload error: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        // Clean up local file if it exists
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            url: publicUrl,
            publicId: fileName // Store the file path as publicId for deletion
        };
    } catch (error) {
        // Clean up local file on error if it exists
        if (typeof filePathOrObject === 'string' && fs.existsSync(filePathOrObject)) {
            fs.unlinkSync(filePathOrObject);
        }
        throw error;
    }
};

/**
 * Delete image from Supabase Storage
 * @param {string} publicId - File path in storage
 * @returns {Promise<void>}
 */
export const deleteImage = async (publicId) => {
    if (!supabase) {
        throw new Error('Supabase client not initialized.');
    }

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([publicId]);

    if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
    }
};

/**
 * Delete multiple images from Supabase Storage
 * @param {string[]} publicIds - Array of file paths
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (publicIds) => {
    if (!supabase) {
        throw new Error('Supabase client not initialized.');
    }

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(publicIds);

    if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
    }
};

export default {
    uploadImage,
    deleteImage,
    deleteMultipleImages
};
