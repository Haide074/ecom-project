/**
 * Admin Controller
 * Handles admin-specific operations: dashboard stats, user management, etc.
 */

import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import ActivityLog from '../models/ActivityLog.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { getPaginationMeta } from '../utils/helpers.js';
import logActivity from '../utils/activityLogger.js';

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
    const { period = '30' } = req.query; // Days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(period));

    const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        topProducts,
    ] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Product.countDocuments({ isDeleted: false }),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .lean(),
        Product.find({ isDeleted: false })
            .sort({ totalReviews: -1, averageRating: -1 })
            .limit(5)
            .lean(),
    ]);

    // Revenue by period
    const revenueByPeriod = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                paymentStatus: 'paid',
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
            recentOrders,
            topProducts,
            revenueByPeriod,
        },
    });
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search, role } = req.query;

    const filters = {};
    if (search) {
        filters.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    if (role) filters.role = role;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
        User.find(filters)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        User.countDocuments(filters),
    ]);

    res.json({
        success: true,
        data: {
            users,
            pagination: getPaginationMeta(total, Number(page), Number(limit)),
        },
    });
});

/**
 * @route   PUT /api/admin/users/:id/block
 * @desc    Block/unblock user
 * @access  Private/Admin
 */
export const toggleBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if (user.role === 'admin') {
        throw new ApiError(400, 'Cannot block admin users');
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: user.isBlocked ? 'block_user' : 'unblock_user',
        description: `${user.isBlocked ? 'Blocked' : 'Unblocked'} user: ${user.email}`,
        targetModel: 'User',
        targetId: user._id,
        req,
    });

    res.json({
        success: true,
        message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
        data: { user: user.toSafeObject() },
    });
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        throw new ApiError(400, 'Invalid role');
    }

    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.role = role;
    await user.save();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'assign_role',
        description: `Changed ${user.email} role to ${role}`,
        targetModel: 'User',
        targetId: user._id,
        metadata: { role },
        req,
    });

    res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user: user.toSafeObject() },
    });
});

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories
 * @access  Private/Admin
 */
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('parent', 'name').lean();

    res.json({
        success: true,
        data: { categories },
    });
});

/**
 * @route   POST /api/admin/categories
 * @desc    Create category
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'create_category',
        description: `Created category: ${category.name}`,
        targetModel: 'Category',
        targetId: category._id,
        req,
    });

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category },
    });
});

/**
 * @route   GET /api/admin/coupons
 * @desc    Get all coupons
 * @access  Private/Admin
 */
export const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

    res.json({
        success: true,
        data: { coupons },
    });
});

/**
 * @route   POST /api/admin/coupons
 * @desc    Create coupon
 * @access  Private/Admin
 */
export const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'create_coupon',
        description: `Created coupon: ${coupon.code}`,
        targetModel: 'Coupon',
        targetId: coupon._id,
        req,
    });

    res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: { coupon },
    });
});

/**
 * @route   GET /api/admin/activity-logs
 * @desc    Get activity logs
 * @access  Private/Admin
 */
export const getActivityLogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
        ActivityLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        ActivityLog.countDocuments(),
    ]);

    res.json({
        success: true,
        data: {
            logs,
            pagination: getPaginationMeta(total, Number(page), Number(limit)),
        },
    });
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (including drafts/archived)
 * @access  Private/Admin
 */
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, category, status } = req.query;

    const filters = {};
    if (search) {
        filters.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    if (category) filters.category = category;
    if (status) filters.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find(filters)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Product.countDocuments(filters),
    ]);

    res.json({
        success: true,
        data: {
            products,
            pagination: getPaginationMeta(total, Number(page), Number(limit)),
        },
    });
});

/**
 * @route   PUT /api/admin/products/:id/status
 * @desc    Update product status
 * @access  Private/Admin
 */
export const updateProductStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'draft', 'archived'].includes(status)) {
        throw new ApiError(400, 'Invalid status');
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    product.status = status;
    await product.save();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'update_product_status',
        description: `Changed ${product.name} status to ${status}`,
        targetModel: 'Product',
        targetId: product._id,
        metadata: { status },
        req,
    });

    res.json({
        success: true,
        message: 'Product status updated successfully',
        data: { product },
    });
});

/**
 * @route   PUT /api/admin/products/:id/featured
 * @desc    Toggle product featured status
 * @access  Private/Admin
 */
export const toggleProductFeatured = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'toggle_featured',
        description: `${product.isFeatured ? 'Featured' : 'Unfeatured'} product: ${product.name}`,
        targetModel: 'Product',
        targetId: product._id,
        metadata: { isFeatured: product.isFeatured },
        req,
    });

    res.json({
        success: true,
        message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        data: { product },
    });
});

/**
 * @route   PUT /api/admin/categories/:id
 * @desc    Update category
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'update_category',
        description: `Updated category: ${category.name}`,
        targetModel: 'Category',
        targetId: category._id,
        req,
    });

    res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category },
    });
});

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete category
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
        throw new ApiError(400, `Cannot delete category with ${productsCount} products`);
    }

    await category.deleteOne();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'delete_category',
        description: `Deleted category: ${category.name}`,
        targetModel: 'Category',
        targetId: category._id,
        req,
    });

    res.json({
        success: true,
        message: 'Category deleted successfully',
    });
});

