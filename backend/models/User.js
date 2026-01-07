/**
 * User Model
 * Handles user authentication, profile, and role management
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        // Basic Information
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't include password in queries by default
        },

        // Role & Status
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },

        // Profile Information
        phone: {
            type: String,
            trim: true,
        },
        avatar: {
            url: String,
            publicId: String,
        },

        // Addresses
        addresses: [
            {
                fullName: { type: String, required: true },
                phone: { type: String, required: true },
                addressLine1: { type: String, required: true },
                addressLine2: String,
                city: { type: String, required: true },
                state: { type: String, required: true },
                postalCode: { type: String, required: true },
                country: { type: String, required: true, default: 'United States' },
                isDefault: { type: Boolean, default: false },
            },
        ],

        // Refresh Token for JWT
        refreshToken: {
            type: String,
            select: false,
        },

        // Account Activity
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

/**
 * Hash password before saving
 */
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare password for login
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} True if password matches
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

/**
 * Get user data without sensitive information
 * @returns {Object} Safe user object
 */
userSchema.methods.toSafeObject = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.__v;
    return user;
};

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

export default User;
