/**
 * Review Model
 * Product reviews and ratings
 */

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            // Optional: Only allow reviews from verified purchases
        },

        // Review Content
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        title: {
            type: String,
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },

        // Images (optional)
        images: [
            {
                url: String,
                publicId: String,
            },
        ],

        // Moderation
        isApproved: {
            type: Boolean,
            default: false, // Require admin approval
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: Date,

        // Helpful votes
        helpfulCount: {
            type: Number,
            default: 0,
        },
        helpfulVotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        // Verified Purchase
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ isApproved: 1 });

// Ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

/**
 * Update product average rating after saving review
 */
reviewSchema.post('save', async function () {
    await this.constructor.updateProductRating(this.product);
});

/**
 * Update product average rating after deleting review
 */
reviewSchema.post('remove', async function () {
    await this.constructor.updateProductRating(this.product);
});

/**
 * Static method to update product rating
 * @param {string} productId - Product ID
 */
reviewSchema.statics.updateProductRating = async function (productId) {
    const Product = mongoose.model('Product');

    const stats = await this.aggregate([
        {
            $match: {
                product: productId,
                isApproved: true, // Only count approved reviews
            },
        },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: stats[0].totalReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            averageRating: 0,
            totalReviews: 0,
        });
    }
};

/**
 * Mark review as helpful
 * @param {string} userId - User ID
 */
reviewSchema.methods.markAsHelpful = function (userId) {
    if (!this.helpfulVotes.includes(userId)) {
        this.helpfulVotes.push(userId);
        this.helpfulCount += 1;
        return this.save();
    }
    return Promise.resolve(this);
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
