/**
 * Express Server
 * Main application entry point
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import guestOrderRoutes from './routes/guestOrderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import themeRoutes from './routes/themeRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet()); // Set security headers

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://frontend-seven-vert-14.vercel.app', // Production frontend
    'http://localhost:5173',
    'http://localhost:5000',
];

app.use(cors({
    origin: (origin, callback) => {
        console.log('🔍 CORS Request from origin:', origin);
        console.log('📋 Allowed origins:', allowedOrigins);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('✅ No origin - allowing request');
            return callback(null, true);
        }

        // Check if origin is allowed (exact match or subdomain match for Preview deployments)
        const isAllowed = allowedOrigins.some(allowed =>
            allowed && (origin === allowed || origin === allowed.replace(/\/$/, ""))
        ) || origin.includes('vercel.app'); // Allow all vercel preview deployments

        if (isAllowed) {
            console.log('✅ Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(null, true); // TEMPORARY: Allow all for debugging, restricting later
        }
    },
    credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/guest-orders', guestOrderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/theme', themeRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'eCommerce API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders',
            admin: '/api/admin',
            theme: '/api/theme',
        },
    });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

// Only listen if not running on Vercel (Vercel handles the serverless function export)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
    ╔════════════════════════════════════════╗
    ║   🚀 eCommerce Server Running          ║
    ║   📡 Port: ${PORT}                        ║
    ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}      ║
    ║   📝 API Docs: http://localhost:${PORT}  ║
    ╚════════════════════════════════════════╝
      `);
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});

export default app;
