/**
 * Request Validation Middleware
 * Input validation using express-validator
 */

import { body, param, query, validationResult } from 'express-validator';
import { ApiError } from './errorHandler.js';

/**
 * Handle validation errors
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        throw new ApiError(400, 'Validation failed', errorMessages);
    }

    next();
};

/**
 * User Registration Validation
 */
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    validate,
];

/**
 * User Login Validation
 */
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password').notEmpty().withMessage('Password is required'),

    validate,
];

/**
 * Product Creation/Update Validation
 */
export const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 200 })
        .withMessage('Product name cannot exceed 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 5000 })
        .withMessage('Description cannot exceed 5000 characters'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Invalid category ID'),

    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),

    validate,
];

/**
 * Order Creation Validation
 */
export const validateOrder = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),

    body('items.*.product')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),

    body('items.*.quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('shippingAddress.fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required'),

    body('shippingAddress.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),

    body('shippingAddress.addressLine1')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),

    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),

    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),

    body('shippingAddress.postalCode')
        .trim()
        .notEmpty()
        .withMessage('Postal code is required'),

    body('paymentMethod')
        .notEmpty()
        .withMessage('Payment method is required')
        .isIn(['stripe', 'cod'])
        .withMessage('Invalid payment method'),

    validate,
];

/**
 * Review Creation Validation
 */
export const validateReview = [
    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),

    body('comment')
        .trim()
        .notEmpty()
        .withMessage('Comment is required')
        .isLength({ max: 1000 })
        .withMessage('Comment cannot exceed 1000 characters'),

    validate,
];

/**
 * Coupon Creation Validation
 */
export const validateCoupon = [
    body('code')
        .trim()
        .notEmpty()
        .withMessage('Coupon code is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon code must be between 3 and 20 characters')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('Coupon code must contain only uppercase letters and numbers'),

    body('discountType')
        .notEmpty()
        .withMessage('Discount type is required')
        .isIn(['percentage', 'fixed'])
        .withMessage('Invalid discount type'),

    body('discountValue')
        .notEmpty()
        .withMessage('Discount value is required')
        .isFloat({ min: 0 })
        .withMessage('Discount value must be a positive number'),

    body('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('Invalid date format'),

    validate,
];

/**
 * MongoDB ID Validation
 */
export const validateMongoId = (paramName = 'id') => [
    param(paramName).isMongoId().withMessage('Invalid ID format'),
    validate,
];

/**
 * Pagination Validation
 */
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    validate,
];
