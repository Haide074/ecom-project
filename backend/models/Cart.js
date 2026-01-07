/**
 * Cart Model
 * Shopping cart for users
 */

import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One cart per user
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'],
                    default: 1,
                },
                variant: {
                    // Selected variant (e.g., {size: "Large", color: "Red"})
                    type: Map,
                    of: String,
                },
                price: {
                    type: Number,
                    required: true, // Store price at time of adding to cart
                },
            },
        ],
        totalItems: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
cartSchema.index({ user: 1 });

/**
 * Calculate totals before saving
 */
cartSchema.pre('save', function (next) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
});

/**
 * Add item to cart or update quantity if already exists
 * @param {Object} item - Item to add
 */
cartSchema.methods.addItem = function (item) {
    const existingItemIndex = this.items.findIndex(
        (i) => i.product.toString() === item.product.toString()
    );

    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        this.items[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item
        this.items.push(item);
    }

    return this.save();
};

/**
 * Remove item from cart
 * @param {string} productId - Product ID to remove
 */
cartSchema.methods.removeItem = function (productId) {
    this.items = this.items.filter((item) => item.product.toString() !== productId.toString());
    return this.save();
};

/**
 * Update item quantity
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 */
cartSchema.methods.updateQuantity = function (productId, quantity) {
    const item = this.items.find((i) => i.product.toString() === productId.toString());
    if (item) {
        item.quantity = quantity;
    }
    return this.save();
};

/**
 * Clear cart
 */
cartSchema.methods.clearCart = function () {
    this.items = [];
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
