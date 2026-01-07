/**
 * Cart Controller
 * Handles shopping cart operations
 */

import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name slug price images stock status',
    });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
        success: true,
        data: { cart },
    });
});

/**
 * @route   POST /api/cart/items
 * @desc    Add item to cart
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1, variant } = req.body;

    // Validate product
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, 'Product not found');
    }

    if (product.status !== 'active') {
        throw new ApiError(400, 'Product is not available');
    }

    if (product.stock < quantity) {
        throw new ApiError(400, 'Insufficient stock');
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            product: productId,
            quantity,
            variant,
            price: product.price,
        });
    }

    await cart.save();

    // Populate cart before sending response
    await cart.populate({
        path: 'items.product',
        select: 'name slug price images stock status',
    });

    res.json({
        success: true,
        message: 'Item added to cart',
        data: { cart },
    });
});

/**
 * @route   PUT /api/cart/items/:productId
 * @desc    Update cart item quantity
 * @access  Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        throw new ApiError(400, 'Quantity must be at least 1');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (!item) {
        throw new ApiError(404, 'Item not found in cart');
    }

    // Validate stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
        throw new ApiError(400, 'Insufficient stock');
    }

    item.quantity = quantity;
    await cart.save();

    await cart.populate({
        path: 'items.product',
        select: 'name slug price images stock status',
    });

    res.json({
        success: true,
        message: 'Cart updated',
        data: { cart },
    });
});

/**
 * @route   DELETE /api/cart/items/:productId
 * @desc    Remove item from cart
 * @access  Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate({
        path: 'items.product',
        select: 'name slug price images stock status',
    });

    res.json({
        success: true,
        message: 'Item removed from cart',
        data: { cart },
    });
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Private
 */
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.json({
        success: true,
        message: 'Cart cleared',
        data: { cart },
    });
});
