/**
 * Email Configuration
 * Setup for sending transactional emails using Nodemailer
 */

import nodemailer from 'nodemailer';

/**
 * Create email transporter
 * Using Gmail SMTP (can be changed to SendGrid, AWS SES, etc.)
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} Send result
 */
export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Your Store" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
            text: text || '', // Fallback to empty string if no text provided
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Email send error:', error);
        throw new Error('Email sending failed');
    }
};

/**
 * Send order confirmation email
 * @param {string} email - Customer email
 * @param {Object} order - Order details
 */
export const sendOrderConfirmation = async (email, order) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <h2>Thank you for your order!</h2>
          <p>Your order <strong>#${order.orderNumber}</strong> has been confirmed and is being processed.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>

          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">Track Your Order</a>
          
          <p>We'll send you another email when your order ships.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        html,
    });
};

/**
 * Send order shipped email
 * @param {string} email - Customer email
 * @param {Object} order - Order details
 */
export const sendOrderShipped = async (email, order) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Shipped! 📦</h1>
        </div>
        <div class="content">
          <h2>Good news!</h2>
          <p>Your order <strong>#${order.orderNumber}</strong> is on its way!</p>
          
          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="button">Track Your Order</a>
          
          <p>Expected delivery: 3-5 business days</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject: `Your Order Has Shipped - #${order.orderNumber}`,
        html,
    });
};

/**
 * Send welcome email to new users
 * @param {string} email - User email
 * @param {string} name - User name
 */
export const sendWelcomeEmail = async (email, name) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Your Store! 👋</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}!</h2>
          <p>Thank you for joining our community. We're excited to have you here!</p>
          
          <a href="${process.env.FRONTEND_URL}/products" class="button">Start Shopping</a>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: email,
        subject: 'Welcome to Your Store!',
        html,
    });
};

export default { sendEmail, sendOrderConfirmation, sendOrderShipped, sendWelcomeEmail };
