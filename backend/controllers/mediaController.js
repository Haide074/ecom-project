/**
 * Media Library Controller
 * Handles image uploads and management using Supabase Storage
 */

import supabase from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// Upload single or multiple images
export const uploadImages = async (req, res) => {
    try {
        console.log('📤 Upload request received');

        if (!supabase) {
            console.error('❌ Supabase is not configured');
            return res.status(503).json({
                success: false,
                message: 'Supabase storage is not configured',
            });
        }

        if (!req.files || req.files.length === 0) {
            console.log('❌ No files in request');
            return res.status(400).json({
                success: false,
                message: 'No files provided',
            });
        }

        console.log(`📁 Processing ${req.files.length} file(s)`);

        const uploadPromises = req.files.map(async (file) => {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `media/${fileName}`;

            console.log(`⬆️ Uploading: ${file.originalname} as ${filePath}`);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false,
                });

            if (error) {
                console.error('❌ Upload error for', file.originalname, ':', error);
                throw error;
            }

            console.log('✅ Uploaded:', filePath);

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return {
                url: urlData.publicUrl,
                publicId: filePath,
                alt: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                createdAt: new Date(),
            };
        });

        const uploadedImages = await Promise.all(uploadPromises);

        console.log(`✅ Successfully uploaded ${uploadedImages.length} image(s)`);

        res.status(201).json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            data: {
                images: uploadedImages,
            },
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message,
        });
    }
};

// Get all uploaded images (simulated - in production, you'd track this in DB)
export const getImages = async (req, res) => {
    try {
        console.log('📥 Fetching images from Supabase');

        if (!supabase) {
            console.error('❌ Supabase is not configured');
            return res.status(503).json({
                success: false,
                message: 'Supabase storage is not configured',
            });
        }

        // List all files in the media folder
        const { data, error } = await supabase.storage
            .from('product-images')
            .list('media', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error('❌ Error listing files:', error);
            throw error;
        }

        console.log(`📋 Found ${data?.length || 0} files`);

        // Get public URLs for all files
        const images = data.map((file) => {
            const { data: urlData } = supabase.storage
                .from('product-images')
                .getPublicUrl(`media/${file.name}`);

            return {
                id: file.id,
                url: urlData.publicUrl,
                publicId: `media/${file.name}`,
                alt: file.name,
                size: file.metadata?.size,
                createdAt: file.created_at,
            };
        });

        console.log(`✅ Returning ${images.length} images`);

        res.status(200).json({
            success: true,
            data: {
                images,
                count: images.length,
            },
        });
    } catch (error) {
        console.error('❌ Get images error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch images',
            error: error.message,
        });
    }
};

// Delete an image
export const deleteImage = async (req, res) => {
    try {
        console.log('🗑️ Delete request received');

        if (!supabase) {
            console.error('❌ Supabase is not configured');
            return res.status(503).json({
                success: false,
                message: 'Supabase storage is not configured',
            });
        }

        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required',
            });
        }

        console.log(`🗑️ Deleting: ${publicId}`);

        const { error } = await supabase.storage
            .from('product-images')
            .remove([publicId]);

        if (error) {
            console.error('❌ Delete error:', error);
            throw error;
        }

        console.log('✅ Deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        console.error('❌ Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
            error: error.message,
        });
    }
};

// Bulk delete images
export const bulkDeleteImages = async (req, res) => {
    try {
        console.log('🗑️ Bulk delete request received');

        if (!supabase) {
            console.error('❌ Supabase is not configured');
            return res.status(503).json({
                success: false,
                message: 'Supabase storage is not configured',
            });
        }

        const { publicIds } = req.body;

        if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Public IDs array is required',
            });
        }

        console.log(`🗑️ Deleting ${publicIds.length} images`);

        const { error } = await supabase.storage
            .from('product-images')
            .remove(publicIds);

        if (error) {
            console.error('❌ Bulk delete error:', error);
            throw error;
        }

        console.log('✅ Bulk delete successful');

        res.status(200).json({
            success: true,
            message: `${publicIds.length} image(s) deleted successfully`,
        });
    } catch (error) {
        console.error('❌ Bulk delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete images',
            error: error.message,
        });
    }
};
