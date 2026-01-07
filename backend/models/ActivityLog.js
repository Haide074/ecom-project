/**
 * Activity Log Model
 * Track admin actions for audit trail
 */

import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        action: {
            type: String,
            required: true,
            enum: [
                'create_product',
                'update_product',
                'delete_product',
                'create_category',
                'update_category',
                'delete_category',
                'update_order_status',
                'cancel_order',
                'refund_order',
                'block_user',
                'unblock_user',
                'assign_role',
                'create_coupon',
                'update_coupon',
                'delete_coupon',
                'approve_review',
                'delete_review',
                'other',
            ],
        },
        description: {
            type: String,
            required: true,
        },
        targetModel: {
            type: String, // e.g., 'Product', 'Order', 'User'
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed, // Additional data about the action
        },
        ipAddress: String,
        userAgent: String,
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ targetModel: 1, targetId: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
