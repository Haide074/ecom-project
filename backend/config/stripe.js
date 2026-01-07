/**
 * Stripe Payment Configuration
 * Initialize Stripe with secret key
 */

import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Use latest stable API version
});

/**
 * Create a payment intent for checkout
 * @param {number} amount - Amount in cents (e.g., 1000 = $10.00)
 * @param {string} currency - Currency code (e.g., 'usd')
 * @param {Object} metadata - Additional metadata for the payment
 * @returns {Promise<Object>} Payment intent object
 */
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent;
    } catch (error) {
        console.error('Stripe payment intent error:', error);
        throw new Error('Payment intent creation failed');
    }
};

/**
 * Retrieve a payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>} Payment intent object
 */
export const retrievePaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Stripe retrieve error:', error);
        throw new Error('Payment retrieval failed');
    }
};

/**
 * Create a refund for a payment
 * @param {string} paymentIntentId - Payment intent ID to refund
 * @param {number} amount - Amount to refund in cents (optional, full refund if not specified)
 * @returns {Promise<Object>} Refund object
 */
export const createRefund = async (paymentIntentId, amount = null) => {
    try {
        const refundData = { payment_intent: paymentIntentId };
        if (amount) {
            refundData.amount = Math.round(amount * 100);
        }

        const refund = await stripe.refunds.create(refundData);
        return refund;
    } catch (error) {
        console.error('Stripe refund error:', error);
        throw new Error('Refund creation failed');
    }
};

/**
 * Verify webhook signature
 * @param {string} payload - Request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} Verified event object
 */
export const verifyWebhookSignature = (payload, signature) => {
    try {
        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        return event;
    } catch (error) {
        console.error('Webhook signature verification failed:', error);
        throw new Error('Invalid webhook signature');
    }
};

export default stripe;
