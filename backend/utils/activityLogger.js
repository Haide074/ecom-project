/**
 * Activity Logger Utility
 * Helper function to log admin activities
 */

import ActivityLog from '../models/ActivityLog.js';

/**
 * Log admin activity
 * @param {Object} options - Activity log options
 * @param {string} options.userId - User ID performing the action
 * @param {string} options.action - Action type
 * @param {string} options.description - Description of the action
 * @param {string} options.targetModel - Target model name (optional)
 * @param {string} options.targetId - Target document ID (optional)
 * @param {Object} options.metadata - Additional metadata (optional)
 * @param {Object} options.req - Express request object (optional, for IP and user agent)
 * @returns {Promise<Object>} Created activity log
 */
export const logActivity = async ({
    userId,
    action,
    description,
    targetModel = null,
    targetId = null,
    metadata = null,
    req = null,
}) => {
    try {
        const logData = {
            user: userId,
            action,
            description,
            targetModel,
            targetId,
            metadata,
        };

        // Extract IP and user agent from request if provided
        if (req) {
            logData.ipAddress = req.ip || req.connection.remoteAddress;
            logData.userAgent = req.get('user-agent');
        }

        const log = await ActivityLog.create(logData);
        return log;
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw error - logging failure shouldn't break the main operation
        return null;
    }
};

export default logActivity;
