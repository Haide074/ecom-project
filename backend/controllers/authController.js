/**
 * Authentication Controller
 * Handles user registration, login, token refresh, and logout
 */

import User from '../models/User.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../middleware/auth.js';
import { sendWelcomeEmail } from '../config/email.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password, // Will be hashed by pre-save middleware
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user.email, user.name).catch((err) =>
        console.error('Welcome email failed:', err)
    );

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: user.toSafeObject(),
            accessToken,
            refreshToken,
        },
    });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Check if user is blocked
    if (user.isBlocked) {
        throw new ApiError(403, 'Your account has been blocked. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token and update last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: user.toSafeObject(),
            accessToken,
            refreshToken,
        },
    });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    // Verify refresh token
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, 'Invalid refresh token');
    }

    // Check if user is blocked
    if (user.isBlocked) {
        throw new ApiError(403, 'Your account has been blocked');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
            accessToken: newAccessToken,
        },
    });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.refreshToken = null;
        await user.save();
    }

    res.json({
        success: true,
        message: 'Logout successful',
    });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
        success: true,
        data: {
            user: user.toSafeObject(),
        },
    });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: user.toSafeObject(),
        },
    });
});

/**
 * @route   PUT /api/auth/password
 * @desc    Change password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Current password and new password are required');
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, 'New password must be at least 6 characters');
    }

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    res.json({
        success: true,
        message: 'Password changed successfully',
    });
});

/**
 * @route   POST /api/auth/address
 * @desc    Add shipping address
 * @access  Private
 */
export const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // If this is set as default, unset other defaults
    if (req.body.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
        req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: {
            addresses: user.addresses,
        },
    });
});

/**
 * @route   PUT /api/auth/address/:addressId
 * @desc    Update shipping address
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, 'Address not found');
    }

    // If setting as default, unset other defaults
    if (req.body.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // Update address fields
    Object.assign(address, req.body);
    await user.save();

    res.json({
        success: true,
        message: 'Address updated successfully',
        data: {
            addresses: user.addresses,
        },
    });
});

/**
 * @route   DELETE /api/auth/address/:addressId
 * @desc    Delete shipping address
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, 'Address not found');
    }

    address.remove();
    await user.save();

    res.json({
        success: true,
        message: 'Address deleted successfully',
        data: {
            addresses: user.addresses,
        },
    });
});
