/**
 * Order Model
 * Complete order management with payment and shipping tracking
 */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        // Order Number (unique identifier for customers)
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },

        // Customer Information (optional for guest orders)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },

        // Guest Customer Information (for non-authenticated orders)
        guestCustomer: {
            name: String,
            email: String,
            phone: String,
        },

        // Order Items
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String, // Store product name in case product is deleted
                image: String, // Store main image
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true, // Price at time of purchase
                },
                variant: {
                    type: Map,
                    of: String,
                },
            },
        ],

        // Shipping Address
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },

        // Payment Information
        paymentMethod: {
            type: String,
            enum: ['stripe', 'cod'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentIntentId: String, // Stripe payment intent ID
        paidAt: Date,

        // Pricing
        itemsPrice: {
            type: Number,
            required: true,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
        },

        // Coupon
        coupon: {
            code: String,
            discount: Number,
        },

        // Order Status
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippedAt: Date,
        deliveredAt: Date,
        cancelledAt: Date,
        cancellationReason: String,

        // Tracking
        trackingNumber: String,
        carrier: String,

        // Notes
        customerNotes: String,
        adminNotes: String,

        // Refund
        isRefunded: {
            type: Boolean,
            default: false,
        },
        refundAmount: Number,
        refundedAt: Date,
        refundReason: String,
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

/**
 * Generate unique order number before saving
 */
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        // Generate order number: ORD-YYYYMMDD-XXXXX
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(10000 + Math.random() * 90000);
        this.orderNumber = `ORD-${dateStr}-${random}`;
    }
    next();
});

/**
 * Update status timestamps
 */
orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        const now = new Date();
        switch (this.status) {
            case 'shipped':
                if (!this.shippedAt) this.shippedAt = now;
                break;
            case 'delivered':
                if (!this.deliveredAt) this.deliveredAt = now;
                break;
            case 'cancelled':
                if (!this.cancelledAt) this.cancelledAt = now;
                break;
        }
    }

    if (this.isModified('paymentStatus') && this.paymentStatus === 'paid' && !this.paidAt) {
        this.paidAt = new Date();
    }

    next();
});

/**
 * Check if order can be cancelled
 * @returns {boolean} True if order can be cancelled
 */
orderSchema.methods.canBeCancelled = function () {
    return ['pending', 'processing'].includes(this.status);
};

/**
 * Check if order can be refunded
 * @returns {boolean} True if order can be refunded
 */
orderSchema.methods.canBeRefunded = function () {
    return this.paymentStatus === 'paid' && !this.isRefunded;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
