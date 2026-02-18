/**
 * Database Seeder
 * Populate database with sample data for testing
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Sample data
const users = [
    {
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@store.com',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 10),
        role: 'admin',
        isEmailVerified: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('User@123456', 10),
        role: 'user',
        isEmailVerified: true,
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('User@123456', 10),
        role: 'user',
        isEmailVerified: true,
    },
];

const categories = [
    {
        name: 'Electronics',
        description: 'Latest electronic gadgets and devices',
        slug: 'electronics',
        isActive: true,
    },
    {
        name: 'Clothing',
        description: 'Fashion and apparel for everyone',
        slug: 'clothing',
        isActive: true,
    },
    {
        name: 'Home & Garden',
        description: 'Everything for your home and garden',
        slug: 'home-garden',
        isActive: true,
    },
    {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        slug: 'sports-outdoors',
        isActive: true,
    },
    {
        name: 'Books',
        description: 'Books, magazines, and reading materials',
        slug: 'books',
        isActive: true,
    },
];

// Products will be created after categories
const createProducts = (categoryMap) => [
    {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
        shortDescription: 'Premium wireless headphones with ANC and 30h battery',
        price: 149.99,
        compareAtPrice: 199.99,
        costPerItem: 75.00,
        category: categoryMap['Electronics'],
        images: [],
        stock: 50,
        sku: 'WBH-001',
        trackInventory: true,
        status: 'active',
        isFeatured: true,
        metaTitle: 'Wireless Bluetooth Headphones - Premium Sound',
        metaDescription: 'Experience premium sound quality with our wireless Bluetooth headphones featuring active noise cancellation.',
        tags: ['electronics', 'audio', 'wireless', 'headphones'],
        weight: 0.5,
        dimensions: { length: 8, width: 7, height: 3, unit: 'in' },
    },
    {
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced smartwatch with fitness tracking, heart rate monitor, GPS, and smartphone notifications. Water-resistant up to 50m.',
        shortDescription: 'Advanced smartwatch with fitness tracking and GPS',
        price: 299.99,
        compareAtPrice: 399.99,
        costPerItem: 150.00,
        category: categoryMap['Electronics'],
        images: [],
        stock: 30,
        sku: 'SWP-001',
        trackInventory: true,
        status: 'active',
        isFeatured: true,
        metaTitle: 'Smart Watch Pro - Fitness & Health Tracker',
        metaDescription: 'Track your fitness goals with our advanced smartwatch featuring GPS and heart rate monitoring.',
        tags: ['electronics', 'smartwatch', 'fitness', 'wearable'],
        weight: 0.2,
        dimensions: { length: 2, width: 2, height: 0.5, unit: 'in' },
    },
    {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-t-shirt',
        description: 'Soft, breathable 100% organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.',
        shortDescription: '100% organic cotton t-shirt in multiple colors',
        price: 29.99,
        compareAtPrice: 39.99,
        costPerItem: 12.00,
        category: categoryMap['Clothing'],
        images: [],
        stock: 100,
        sku: 'PCT-001',
        trackInventory: true,
        variants: [
            {
                name: 'Size',
                values: [
                    { value: 'S', price: 0, stock: 25, sku: 'PCT-001-S' },
                    { value: 'M', price: 0, stock: 30, sku: 'PCT-001-M' },
                    { value: 'L', price: 0, stock: 25, sku: 'PCT-001-L' },
                    { value: 'XL', price: 0, stock: 20, sku: 'PCT-001-XL' },
                ],
            },
            {
                name: 'Color',
                values: [
                    { value: 'Black', price: 0, stock: 30 },
                    { value: 'White', price: 0, stock: 30 },
                    { value: 'Navy', price: 0, stock: 20 },
                    { value: 'Gray', price: 0, stock: 20 },
                ],
            },
        ],
        status: 'active',
        isFeatured: false,
        metaTitle: 'Premium Organic Cotton T-Shirt',
        metaDescription: 'Comfortable and sustainable organic cotton t-shirt for everyday wear.',
        tags: ['clothing', 'tshirt', 'organic', 'cotton'],
        weight: 0.3,
    },
    {
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Non-slip yoga mat with extra cushioning for comfort. Eco-friendly materials, includes carrying strap.',
        shortDescription: 'Eco-friendly non-slip yoga mat with carrying strap',
        price: 49.99,
        compareAtPrice: 69.99,
        costPerItem: 20.00,
        category: categoryMap['Sports & Outdoors'],
        images: [],
        stock: 40,
        sku: 'YMP-001',
        trackInventory: true,
        status: 'active',
        isFeatured: true,
        metaTitle: 'Premium Yoga Mat - Eco-Friendly & Non-Slip',
        metaDescription: 'Practice yoga in comfort with our premium eco-friendly yoga mat.',
        tags: ['sports', 'yoga', 'fitness', 'exercise'],
        weight: 2.5,
        dimensions: { length: 72, width: 24, height: 0.25, unit: 'in' },
    },
    {
        name: 'LED Desk Lamp',
        slug: 'led-desk-lamp',
        description: 'Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included. Energy-efficient and eye-friendly.',
        shortDescription: 'Adjustable LED desk lamp with USB charging',
        price: 39.99,
        compareAtPrice: 59.99,
        costPerItem: 18.00,
        category: categoryMap['Home & Garden'],
        images: [],
        stock: 60,
        sku: 'LDL-001',
        trackInventory: true,
        status: 'active',
        isFeatured: false,
        metaTitle: 'LED Desk Lamp - Adjustable & Energy Efficient',
        metaDescription: 'Illuminate your workspace with our modern LED desk lamp featuring adjustable settings.',
        tags: ['home', 'lighting', 'desk', 'led'],
        weight: 1.2,
        dimensions: { length: 16, width: 6, height: 6, unit: 'in' },
    },
    {
        name: 'The Art of Programming',
        slug: 'the-art-of-programming',
        description: 'Comprehensive guide to modern programming practices. Covers algorithms, data structures, and best practices. Perfect for beginners and intermediate developers.',
        shortDescription: 'Complete guide to modern programming',
        price: 34.99,
        compareAtPrice: 44.99,
        costPerItem: 15.00,
        category: categoryMap['Books'],
        images: [],
        stock: 75,
        sku: 'TAP-001',
        trackInventory: true,
        status: 'active',
        isFeatured: false,
        metaTitle: 'The Art of Programming - Complete Guide',
        metaDescription: 'Master programming with this comprehensive guide covering algorithms and best practices.',
        tags: ['books', 'programming', 'education', 'technology'],
        weight: 1.5,
        dimensions: { length: 9, width: 6, height: 1.5, unit: 'in' },
    },
];

const coupons = [
    {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 50,
        maxDiscountAmount: 20,
        usageLimit: 1000,
        usageCount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true,
    },
    {
        code: 'SAVE20',
        description: 'Save $20 on orders over $100',
        discountType: 'fixed',
        discountValue: 20,
        minPurchaseAmount: 100,
        usageLimit: 500,
        usageCount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
    },
    {
        code: 'FREESHIP',
        description: 'Free shipping on all orders',
        discountType: 'percentage',
        discountValue: 100,
        minPurchaseAmount: 0,
        maxDiscountAmount: 15,
        usageLimit: 100,
        usageCount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        applicableCategories: [],
    },
];

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Coupon.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create users
        console.log('👥 Creating users...');
        const createdUsers = await User.insertMany(users);
        console.log(`✅ Created ${createdUsers.length} users\n`);

        // Create categories
        console.log('📁 Creating categories...');
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Created ${createdCategories.length} categories\n`);

        // Create category map for products
        const categoryMap = {};
        createdCategories.forEach((cat) => {
            categoryMap[cat.name] = cat._id;
        });

        // Create products
        console.log('📦 Creating products...');
        const productData = createProducts(categoryMap);
        const createdProducts = await Product.insertMany(productData);
        console.log(`✅ Created ${createdProducts.length} products\n`);

        // Create coupons
        console.log('🎫 Creating coupons...');
        const createdCoupons = await Coupon.insertMany(coupons);
        console.log(`✅ Created ${createdCoupons.length} coupons\n`);

        console.log('═══════════════════════════════════════');
        console.log('✨ Database seeding completed successfully!');
        console.log('═══════════════════════════════════════');
        console.log('\n📊 Summary:');
        console.log(`   👥 Users: ${createdUsers.length}`);
        console.log(`   📁 Categories: ${createdCategories.length}`);
        console.log(`   📦 Products: ${createdProducts.length}`);
        console.log(`   🎫 Coupons: ${createdCoupons.length}`);
        console.log('\n🔐 Admin Credentials:');
        console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@store.com'}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
        console.log('\n👤 Test User Credentials:');
        console.log('   Email: john@example.com');
        console.log('   Password: User@123456');
        console.log('═══════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

// Run seeder
connectDB().then(seedDatabase);
