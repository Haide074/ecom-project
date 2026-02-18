/**
 * Coupon Model
 * Discount codes and promotions
 */

import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },

        // Discount Type
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true,
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [0, 'Discount value cannot be negative'],
        },

        // Usage Limits
        maxUses: {
            type: Number,
            default: null, // null means unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        maxUsesPerUser: {
            type: Number,
            default: 1,
        },

        // Minimum Purchase
        minPurchaseAmount: {
            type: Number,
            default: 0,
        },

        // Validity Period
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },

        // Status
        isActive: {
            type: Boolean,
            default: true,
        },

        // Applicable Products/Categories (optional)
        applicableProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        applicableCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],

        // Users who have used this coupon
        usedBy: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                usedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ endDate: 1 });

/**
 * Check if coupon is valid
 * @param {string} userId - User ID
 * @param {number} cartTotal - Cart total amount
 * @returns {Object} Validation result
 */
couponSchema.methods.isValid = function (userId, cartTotal) {
    const now = new Date();

    // Check if active
    if (!this.isActive) {
        return { valid: false, message: 'Coupon is not active' };
    }

    // Check date validity
    if (now < this.startDate) {
        return { valid: false, message: 'Coupon is not yet valid' };
    }
    if (now > this.endDate) {
        return { valid: false, message: 'Coupon has expired' };
    }

    // Check max uses
    if (this.maxUses !== null && this.usedCount >= this.maxUses) {
        return { valid: false, message: 'Coupon usage limit reached' };
    }

    // Check user usage limit
    const userUsage = this.usedBy.filter((u) => u.user.toString() === userId.toString()).length;
    if (userUsage >= this.maxUsesPerUser) {
        return { valid: false, message: 'You have already used this coupon' };
    }

    // Check minimum purchase
    if (cartTotal < this.minPurchaseAmount) {
        return {
            valid: false,
            message: `Minimum purchase of $${this.minPurchaseAmount} required`,
        };
    }

    return { valid: true, message: 'Coupon is valid' };
};

/**
 * Calculate discount amount
 * @param {number} amount - Amount to apply discount to
 * @returns {number} Discount amount
 */
couponSchema.methods.calculateDiscount = function (amount) {
    if (this.discountType === 'percentage') {
        return (amount * this.discountValue) / 100;
    } else {
        return Math.min(this.discountValue, amount); // Don't exceed total amount
    }
};

/**
 * Mark coupon as used by a user
 * @param {string} userId - User ID
 */
couponSchema.methods.markAsUsed = function (userId) {
    this.usedCount += 1;
    this.usedBy.push({ user: userId, usedAt: new Date() });
    return this.save();
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
