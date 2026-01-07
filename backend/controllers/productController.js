/**
 * Product Controller
 * Handles product CRUD operations, filtering, and search
 */

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { getPaginationMeta, buildFilters, buildSort } from '../utils/helpers.js';
import { uploadImage, deleteMultipleImages } from '../config/storage.js';
import logActivity from '../utils/activityLogger.js';

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, search, and pagination
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        sortBy = 'createdAt',
        order = 'desc',
    } = req.query;

    // Build filters
    const filters = { isDeleted: false };
    // Temporarily disabled status check to debug "no products"
    // filters.status = 'active';

    if (category) filters.category = category;
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
    }
    if (minRating) filters.averageRating = { $gte: Number(minRating) };

    // Search
    if (search) {
        // Use regex for partial matching (case-insensitive)
        filters.name = { $regex: search, $options: 'i' };
    }

    console.log('getProducts Filters:', JSON.stringify(filters, null, 2));

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build sort
    const sort = buildSort(sortBy, order);

    // Execute query
    const [products, total] = await Promise.all([
        Product.find(filters)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Product.countDocuments(filters),
    ]);

    console.log(`Found ${products.length} products`);

    res.json({
        success: true,
        data: {
            products,
            pagination: getPaginationMeta(total, Number(page), Number(limit)),
        },
    });
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const { limit = 8 } = req.query;

    const products = await Product.find({
        isFeatured: true,
        status: 'active',
        isDeleted: false,
    })
        .populate('category', 'name slug')
        .limit(Number(limit))
        .lean();

    res.json({
        success: true,
        data: { products },
    });
});

/**
 * @route   GET /api/products/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isDeleted: false }).populate(
        'category',
        'name slug'
    );

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    res.json({
        success: true,
        data: { product },
    });
});

/**
 * @route   POST /api/products
 * @desc    Create new product (Admin only)
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
    const productData = req.body;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
        const imageUploads = req.files.map((file) =>
            uploadImage(file, 'products') // Pass file object instead of file.path
        );
        const uploadedImages = await Promise.all(imageUploads);

        productData.images = uploadedImages.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            position: index,
        }));
    }

    const product = await Product.create(productData);

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'create_product',
        description: `Created product: ${product.name}`,
        targetModel: 'Product',
        targetId: product._id,
        req,
    });

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product },
    });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Admin only)
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
        const imageUploads = req.files.map((file) =>
            uploadImage(file, 'products') // Pass file object instead of file.path
        );
        const uploadedImages = await Promise.all(imageUploads);

        const newImages = uploadedImages.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            position: product.images.length + index,
        }));

        req.body.images = [...product.images, ...newImages];
    }

    Object.assign(product, req.body);
    await product.save();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'update_product',
        description: `Updated product: ${product.name}`,
        targetModel: 'Product',
        targetId: product._id,
        req,
    });

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product },
    });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft delete product (Admin only)
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    await product.softDelete();

    // Log activity
    await logActivity({
        userId: req.user?._id,
        action: 'delete_product',
        description: `Deleted product: ${product.name}`,
        targetModel: 'Product',
        targetId: product._id,
        req,
    });

    res.json({
        success: true,
        message: 'Product deleted successfully',
    });
});

/**
 * @route   DELETE /api/products/:productId/images/:imageId
 * @desc    Delete product image (Admin only)
 * @access  Private/Admin
 */
export const deleteProductImage = asyncHandler(async (req, res) => {
    const { productId, imageId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    const image = product.images.id(imageId);

    if (!image) {
        throw new ApiError(404, 'Image not found');
    }

    // Delete from Cloudinary
    await deleteImage(image.publicId);

    // Remove from product
    image.remove();
    await product.save();

    res.json({
        success: true,
        message: 'Image deleted successfully',
    });
});
