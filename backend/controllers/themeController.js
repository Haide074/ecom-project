/**
 * Theme Controller
 * Handles theme customization operations
 */

import Theme from '../models/Theme.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import logActivity from '../utils/activityLogger.js';

/**
 * @route   GET /api/theme
 * @desc    Get active theme settings
 * @access  Public
 */
export const getActiveTheme = asyncHandler(async (req, res) => {
    let theme = await Theme.findOne({ isActive: true });

    // If no theme exists, create default theme
    if (!theme) {
        theme = await Theme.create({
            isActive: true,
            header: {
                logo: { text: 'GlowNature', icon: 'sparkles' },
                navigation: [
                    { label: 'Home', link: '/', order: 1 },
                    { label: 'Shop', link: '/products', order: 2 },
                    { label: 'Skincare', link: '/products', order: 3 },
                    { label: 'About', link: '/products', order: 4 },
                ],
            },
            hero: {
                title: 'Radiant Skin',
                subtitle: 'Naturally Yours',
                description: 'Premium skincare crafted with nature\'s finest ingredients. Reveal your skin\'s natural glow.',
                primaryButtonText: 'Explore Products',
                secondaryButtonText: 'Find Your Routine',
            },
            heroStats: [
                { value: '100%', label: 'Natural', icon: 'leaf', order: 1 },
                { value: '50K+', label: 'Glowing Reviews', icon: 'star', order: 2 },
                { value: '4.9', label: 'Rating', icon: 'award', order: 3 },
            ],
            background: {
                color: '#ffffff',
                gradient: 'linear-gradient(135deg, #fef5f8 0%, #f0f4f8 100%)',
                useGradient: false,
            },
            tiktokVideos: [],
            features: [
                { icon: 'leaf', title: 'Natural Ingredients', description: 'Pure, organic ingredients sourced sustainably', order: 1 },
                { icon: 'shield', title: 'Dermatologist Tested', description: 'Clinically proven safe for all skin types', order: 2 },
                { icon: 'sparkles', title: 'Cruelty Free', description: 'Never tested on animals, always ethical', order: 3 },
                { icon: 'award', title: 'Premium Quality', description: 'Award-winning formulations that deliver results', order: 4 },
            ],
        });
    }

    res.json({
        success: true,
        data: { theme },
    });
});

/**
 * @route   PUT /api/theme
 * @desc    Update theme settings (Admin only)
 * @access  Private/Admin
 */
export const updateTheme = asyncHandler(async (req, res) => {
    let theme = await Theme.findOne({ isActive: true });

    if (!theme) {
        theme = await Theme.create({ ...req.body, isActive: true });
    } else {
        Object.assign(theme, req.body);
        await theme.save();
    }

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'update_theme',
        description: 'Updated website theme settings',
        targetModel: 'Theme',
        targetId: theme._id,
        req,
    });

    res.json({
        success: true,
        message: 'Theme updated successfully',
        data: { theme },
    });
});

/**
 * @route   POST /api/theme/reset
 * @desc    Reset theme to default settings (Admin only)
 * @access  Private/Admin
 */
export const resetTheme = asyncHandler(async (req, res) => {
    await Theme.deleteMany({});

    const theme = await Theme.create({
        isActive: true,
        header: {
            logo: { text: 'GlowNature', icon: 'sparkles' },
            navigation: [
                { label: 'Home', link: '/', order: 1 },
                { label: 'Shop', link: '/products', order: 2 },
                { label: 'Skincare', link: '/products', order: 3 },
                { label: 'About', link: '/products', order: 4 },
            ],
        },
        hero: {
            title: 'Radiant Skin',
            subtitle: 'Naturally Yours',
            description: 'Premium skincare crafted with nature\'s finest ingredients. Reveal your skin\'s natural glow.',
            primaryButtonText: 'Explore Products',
            secondaryButtonText: 'Find Your Routine',
        },
        heroStats: [
            { value: '100%', label: 'Natural', icon: 'leaf', order: 1 },
            { value: '50K+', label: 'Glowing Reviews', icon: 'star', order: 2 },
            { value: '4.9', label: 'Rating', icon: 'award', order: 3 },
        ],
        background: {
            color: '#ffffff',
            gradient: 'linear-gradient(135deg, #fef5f8 0%, #f0f4f8 100%)',
            useGradient: false,
        },
        tiktokVideos: [],
        features: [
            { icon: 'leaf', title: 'Natural Ingredients', description: 'Pure, organic ingredients sourced sustainably', order: 1 },
            { icon: 'shield', title: 'Dermatologist Tested', description: 'Clinically proven safe for all skin types', order: 2 },
            { icon: 'sparkles', title: 'Cruelty Free', description: 'Never tested on animals, always ethical', order: 3 },
            { icon: 'award', title: 'Premium Quality', description: 'Award-winning formulations that deliver results', order: 4 },
        ],
    });

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'reset_theme',
        description: 'Reset website theme to default settings',
        targetModel: 'Theme',
        targetId: theme._id,
        req,
    });

    res.json({
        success: true,
        message: 'Theme reset to default settings',
        data: { theme },
    });
});
