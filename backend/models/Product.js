/**
 * Product Model
 * Complete product information with variants, images, and inventory
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        // Basic Information
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        shortDescription: {
            type: String,
            maxlength: [500, 'Short description cannot exceed 500 characters'],
        },

        // Pricing
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        compareAtPrice: {
            type: Number, // Original price for showing discounts
            min: [0, 'Compare price cannot be negative'],
        },
        costPerItem: {
            type: Number, // Cost for profit calculation
            min: [0, 'Cost cannot be negative'],
        },

        // Category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },

        // Images
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String,
                    required: true,
                },
                alt: String,
                position: {
                    type: Number,
                    default: 0,
                },
            },
        ],

        // Inventory
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true, // Allow null values
        },
        trackInventory: {
            type: Boolean,
            default: true,
        },

        // Variants (Size, Color, etc.)
        variants: [
            {
                name: {
                    type: String,
                    required: true, // e.g., "Size", "Color"
                },
                values: [
                    {
                        value: String, // e.g., "Small", "Red"
                        price: Number, // Additional price for this variant
                        stock: Number,
                        sku: String,
                    },
                ],
            },
        ],

        // Product Status
        status: {
            type: String,
            enum: ['active', 'draft', 'archived'],
            default: 'active',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },

        // SEO
        metaTitle: String,
        metaDescription: String,
        metaKeywords: [String],

        // Reviews & Ratings
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },

        // Soft Delete
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,

        // Additional Fields
        tags: [String],
        weight: Number, // For shipping calculation
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                enum: ['in', 'cm'],
                default: 'in',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Text search

/**
 * Generate slug from name before saving
 */
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

/**
 * Don't return deleted products by default
 */
productSchema.pre(/^find/, function (next) {
    // Only apply to find queries, not findById or findOne when specifically querying deleted items
    if (!this.getQuery().isDeleted) {
        this.where({ isDeleted: false });
    }
    next();
});

/**
 * Calculate discount percentage
 * @returns {number} Discount percentage
 */
productSchema.methods.getDiscountPercentage = function () {
    if (this.compareAtPrice && this.compareAtPrice > this.price) {
        return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
    }
    return 0;
};

/**
 * Check if product is in stock
 * @returns {boolean} True if in stock
 */
productSchema.methods.isInStock = function () {
    return this.stock > 0;
};

/**
 * Soft delete product
 */
productSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.status = 'archived';
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
