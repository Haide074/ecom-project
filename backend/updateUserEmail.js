/**
 * Update User Email Script
 * Updates the email of a user in MongoDB to a valid format
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateUserEmail = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find user with old email
        const oldEmail = 'hdr@admin';
        const newEmail = 'hdr@admin.com';

        const user = await User.findOne({ email: oldEmail });

        if (!user) {
            console.log(`❌ User with email "${oldEmail}" not found`);
            console.log('\n📋 Listing all users:');
            const allUsers = await User.find({}).select('name email role');
            console.table(allUsers.map(u => ({
                Name: u.name,
                Email: u.email,
                Role: u.role
            })));
            process.exit(1);
        }

        // Update email
        user.email = newEmail;
        await user.save();

        console.log(`✅ Successfully updated email from "${oldEmail}" to "${newEmail}"`);
        console.log('\n👤 Updated User:');
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`\n🔐 You can now login with:`);
        console.log(`   Email: ${newEmail}`);
        console.log(`   Password: Sheikh.55555{}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateUserEmail();
