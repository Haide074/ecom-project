/**
 * Order Controller
 * Handles order creation, tracking, and management
 */

import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { createPaymentIntent } from '../config/stripe.js';
import { sendOrderConfirmation, sendOrderShipped } from '../config/email.js';
import { getPaginationMeta } from '../utils/helpers.js';
import logActivity from '../utils/activityLogger.js';

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    // Validate items and calculate totals
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product);

        if (!product) {
            throw new ApiError(404, `Product not found: ${item.product}`);
        }

        if (product.status !== 'active') {
            throw new ApiError(400, `Product not available: ${product.name}`);
        }

        if (product.stock < item.quantity) {
            throw new ApiError(400, `Insufficient stock for: ${product.name}`);
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            image: product.images[0]?.url,
            quantity: item.quantity,
            price: product.price,
            variant: item.variant,
        });

        itemsPrice += product.price * item.quantity;
    }

    // Apply coupon if provided
    let discountAmount = 0;
    let couponData = null;

    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (!coupon) {
            throw new ApiError(404, 'Invalid coupon code');
        }

        const validation = coupon.isValid(req.user._id, itemsPrice);

        if (!validation.valid) {
            throw new ApiError(400, validation.message);
        }

        discountAmount = coupon.calculateDiscount(itemsPrice);
        couponData = {
            code: coupon.code,
            discount: discountAmount,
        };

        // Mark coupon as used
        await coupon.markAsUsed(req.user._id);
    }

    // Calculate shipping and tax (simplified)
    const shippingPrice = itemsPrice > 50 ? 0 : 9.99; // Free shipping over $50
    const taxPrice = (itemsPrice - discountAmount) * 0.08; // 8% tax
    const totalAmount = itemsPrice + shippingPrice + taxPrice - discountAmount;

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        itemsPrice,
        shippingPrice,
        taxPrice,
        discountAmount,
        totalAmount,
        coupon: couponData,
    });

    // Handle Stripe payment
    if (paymentMethod === 'stripe') {
        const paymentIntent = await createPaymentIntent(totalAmount, 'usd', {
            orderId: order._id.toString(),
            userId: req.user._id.toString(),
        });

        order.paymentIntentId = paymentIntent.id;
        await order.save();
    }

    // Update product stock
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
        });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Send confirmation email
    sendOrderConfirmation(req.user.email, order).catch((err) =>
        console.error('Order confirmation email failed:', err)
    );

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
            order,
            clientSecret: paymentMethod === 'stripe' ? order.paymentIntentId : null,
        },
    });
});

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Order.countDocuments({ user: req.user._id }),
    ]);

    res.json({
        success: true,
        data: {
            orders,
            pagination: getPaginationMeta(total, Number(page), Number(limit)),
        },
    });
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.product', 'name slug images');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Access denied');
    }

    res.json({
        success: true,
        data: { order },
    });
});

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
export const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Access denied');
    }

    if (!order.canBeCancelled()) {
        throw new ApiError(400, 'Order cannot be cancelled at this stage');
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;
    await order.save();

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
        });
    }

    res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order },
    });
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(id).populate('user', 'email name');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    await order.save();

    // Send email notification for shipped status
    if (status === 'shipped') {
        sendOrderShipped(order.user.email, order).catch((err) =>
            console.error('Shipped email failed:', err)
        );
    }

    // Log activity
    await logActivity({
        userId: req.user._id,
        action: 'update_order_status',
        description: `Updated order ${order.orderNumber} status to ${status}`,
        targetModel: 'Order',
        targetId: order._id,
        metadata: { status, trackingNumber, carrier },
        req,
    });

    res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order },
    });
});

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;

    const filters = {};
    if (status) filters.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find(filters)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Order.countDocuments(filters),
    ]);

    res.json({
        success: true,
        data: {
            orders,
            pagination: getPaginationMeta(total, Number(page), Number(limit)),
        },
    });
});
