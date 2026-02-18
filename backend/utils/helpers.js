/**
 * Utility Functions
 * Helper functions used across the application
 */

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

/**
 * Calculate pagination metadata
 * @param {number} total - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
    };
};

/**
 * Build query filters from request query
 * @param {Object} query - Request query object
 * @returns {Object} MongoDB filter object
 */
export const buildFilters = (query) => {
    const filters = {};

    // Category filter
    if (query.category) {
        filters.category = query.category;
    }

    // Price range filter
    if (query.minPrice || query.maxPrice) {
        filters.price = {};
        if (query.minPrice) filters.price.$gte = Number(query.minPrice);
        if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
    }

    // Rating filter
    if (query.minRating) {
        filters.averageRating = { $gte: Number(query.minRating) };
    }

    // Status filter
    if (query.status) {
        filters.status = query.status;
    }

    // Featured filter
    if (query.featured === 'true') {
        filters.isFeatured = true;
    }

    return filters;
};

/**
 * Build sort options from request query
 * @param {string} sortBy - Sort field
 * @param {string} order - Sort order (asc/desc)
 * @returns {Object} MongoDB sort object
 */
export const buildSort = (sortBy = 'createdAt', order = 'desc') => {
    const sortOrder = order === 'asc' ? 1 : -1;
    return { [sortBy]: sortOrder };
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Calculate shipping cost
 * @param {number} weight - Total weight
 * @param {string} country - Destination country
 * @returns {number} Shipping cost
 */
export const calculateShipping = (weight, country = 'United States') => {
    // Simple shipping calculation - can be made more complex
    const baseRate = 5.99;
    const perPoundRate = 1.5;

    if (country !== 'United States') {
        return baseRate * 2 + weight * perPoundRate * 2; // International shipping
    }

    return baseRate + weight * perPoundRate;
};

/**
 * Calculate tax
 * @param {number} amount - Amount to calculate tax on
 * @param {string} state - State for tax calculation
 * @returns {number} Tax amount
 */
export const calculateTax = (amount, state = '') => {
    // Simple tax calculation - in production, use a tax API
    const taxRates = {
        CA: 0.0725, // California
        NY: 0.08, // New York
        TX: 0.0625, // Texas
        FL: 0.06, // Florida
        // Add more states as needed
    };

    const rate = taxRates[state] || 0.07; // Default 7%
    return amount * rate;
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and > to prevent XSS
        .substring(0, 1000); // Limit length
};

/**
 * Generate SKU
 * @param {string} productName - Product name
 * @param {string} category - Category name
 * @returns {string} Generated SKU
 */
export const generateSKU = (productName, category) => {
    const prefix = category.substring(0, 3).toUpperCase();
    const namePart = productName
        .substring(0, 3)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${namePart}-${random}`;
};

/**
 * Check if date is in range
 * @param {Date} date - Date to check
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} True if date is in range
 */
export const isDateInRange = (date, startDate, endDate) => {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return checkDate >= start && checkDate <= end;
};
