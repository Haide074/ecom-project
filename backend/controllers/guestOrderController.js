/**
 * Guest Order Controller
 * Handles order creation for non-authenticated users
 */

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @route   POST /api/guest-orders
 * @desc    Create new guest order (no authentication required)
 * @access  Public
 */
export const createGuestOrder = asyncHandler(async (req, res) => {
    const {
        items: requestItems,
        product, // Legacy: single product support
        customerInfo,
        shippingAddress,
        shippingPrice = 0
    } = req.body;

    // DEBUG LOGGING
    console.log('Received guest order request:', JSON.stringify(req.body, null, 2));

    // Normalize items: checks for 'items' array OR single 'product' object
    let items = [];
    if (requestItems && Array.isArray(requestItems) && requestItems.length > 0) {
        items = requestItems;
    } else if (product && product.id) {
        items = [product];
    }

    // Validate items exist
    if (!items || items.length === 0) {
        // Fallback check
        console.error('Order validation failed: No items found in payload', req.body);
        throw new ApiError(400, 'No items in order');
    }

    const orderItems = [];
    let itemsPrice = 0;

    // Process each item
    for (const item of items) {
        const productData = await Product.findById(item.id);

        if (!productData) {
            throw new ApiError(404, `Product not found: ${item.id}`);
        }

        if (productData.status !== 'active') {
            throw new ApiError(400, `Product not available: ${productData.name}`);
        }

        if (productData.stock < (item.quantity || 1)) {
            throw new ApiError(400, `Insufficient stock for: ${productData.name}`);
        }

        const quantity = item.quantity || 1;

        orderItems.push({
            product: productData._id,
            name: productData.name,
            image: productData.images?.[0]?.url || productData.images?.[0] || '',
            quantity: quantity,
            price: productData.price,
        });

        itemsPrice += productData.price * quantity;

        // Update product stock immediately
        await Product.findByIdAndUpdate(productData._id, {
            $inc: { stock: -quantity },
        });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const totalAmount = itemsPrice + shippingPrice;

    // Create order
    const order = await Order.create({
        orderNumber, // Add the generated order number
        guestCustomer: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
        },
        items: orderItems,
        shippingAddress: {
            fullName: customerInfo.name,
            phone: customerInfo.phone,
            addressLine1: shippingAddress.address,
            addressLine2: '',
            city: shippingAddress.city,
            state: shippingAddress.province,
            postalCode: shippingAddress.zipCode || '00000', // valid value fallback
            country: shippingAddress.country,
        },
        paymentMethod: 'cod', // Guest orders default to Cash on Delivery
        paymentStatus: 'pending',
        itemsPrice,
        shippingPrice,
        taxPrice: 0,
        discountAmount: 0,
        totalAmount,
    });

    res.status(201).json({
        success: true,
        message: 'Order placed successfully! We will contact you soon.',
        data: {
            order: {
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
            },
        },
    });
});

/**
 * @route   GET /api/guest-orders/all
 * @desc    Get all orders (both guest and authenticated) - Admin only
 * @access  Public (no auth in this system)
 */
export const getAllOrdersForAdmin = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;

    const filters = {};
    if (status && status !== 'all') filters.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
        Order.find(filters)
            .populate('user', 'name email')
            .populate('items.product', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Order.countDocuments(filters),
    ]);

    // Format orders to include customer name from either user or guestCustomer
    const formattedOrders = orders.map(order => ({
        ...order,
        customerName: order.user?.name || order.guestCustomer?.name || 'Guest',
        customerEmail: order.user?.email || order.guestCustomer?.email || 'N/A',
        customerPhone: order.guestCustomer?.phone || order.shippingAddress?.phone || 'N/A',
    }));

    res.json({
        success: true,
        data: {
            orders: formattedOrders,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
});

/**
 * @route   PUT /api/guest-orders/:id/status
 * @desc    Update order status - Admin only
 * @access  Public (no auth in this system)
 */
export const updateGuestOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    await order.save();

    res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order },
    });
});
