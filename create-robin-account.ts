#!/usr/bin/env node
// @ts-nocheck
// Script to create Robin's account using the working method

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './server/models/User';
import { generateUID } from './server/utils/uid';

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

async function connectWithRetry() {
  try {
    console.log('🔗 Attempting MongoDB connection...');
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000
    });
    
    console.log('✅ MongoDB connection established successfully');
    return;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    throw error;
  }
}

async function createRobinAccount() {
  try {
    await connectWithRetry();
    
    const userEmail = 'robinstephen025@outlook.com';
    const userPassword = 'robin123';
    const username = 'robinstephen025';
    
    console.log('\n🔍 Checking for existing Robin account...');
    
    // Remove any existing account first (cleanup)
    try {
      const existingUsers = await User.find({
        $or: [
          { email: { $regex: new RegExp(`^${userEmail}$`, 'i') } },
          { username: { $regex: new RegExp(`^${username}$`, 'i') } }
        ]
      });
      
      if (existingUsers.length > 0) {
        console.log(`🗑️ Removing ${existingUsers.length} existing account(s)...`);
        for (const user of existingUsers) {
          await User.findByIdAndDelete(user._id);
          console.log(`   Deleted: ${user.email} (${user.username})`);
        }
      }
    } catch (cleanupError) {
      console.log('⚠️ Cleanup warning (non-critical):', cleanupError.message);
    }
    
    console.log('👤 Creating Robin\'s account...');
    
    // Generate unique UID
    let uid = generateUID();
    let isUidUnique = false;
    let attempts = 0;
    
    while (!isUidUnique && attempts < 10) {
      try {
        const existingUidUser = await User.findOne({ uid });
        if (!existingUidUser) {
          isUidUnique = true;
        } else {
          uid = generateUID();
          attempts++;
        }
      } catch (uidError) {
        console.log('⚠️ UID check warning, continuing with current UID:', uid);
        isUidUnique = true;
        break;
      }
    }
    
    if (!isUidUnique) {
      throw new Error('Failed to generate unique UID');
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    
    // Create Robin's account
    const robinUser = new User({
      uid,
      username,
      email: userEmail,
      password: hashedPassword,
      actualPassword: userPassword, // Store for admin access
      firstName: 'Robin',
      lastName: 'Stephen',
      isVerified: true, // Pre-verified
      isAdmin: false,
      balance: 0,
      favorites: [],
      preferences: {},
      kycStatus: 'none',
      withdrawalAccess: false, // Default security setting
      transferAccess: false,   // Default security setting
      createdAt: new Date()
    });
    
    await robinUser.save();
    
    console.log('✅ Robin\'s account created successfully!');
    console.log(`📧 Email: ${userEmail}`);
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${userPassword}`);
    console.log(`🆔 UID: ${uid}`);
    console.log(`✓ Verified: true`);
    console.log(`🔒 Admin: false`);
    
    // Verify the account can be found
    console.log('\n🧪 Testing account lookup...');
    
    try {
      const testUser = await User.findOne({ 
        email: { $regex: new RegExp(`^${userEmail}$`, 'i') }
      });
      
      if (testUser) {
        console.log('✅ Account lookup test successful');
        console.log(`Found: ${testUser.username} (${testUser.email})`);
        
        // Test password verification
        const passwordMatch = await bcrypt.compare(userPassword, testUser.password);
        console.log(`🔐 Password verification: ${passwordMatch ? 'PASSED' : 'FAILED'}`);
      } else {
        console.log('❌ Account lookup test failed');
      }
    } catch (lookupError) {
      console.log('⚠️ Lookup test failed (non-critical):', lookupError.message);
    }
    
    console.log('\n🎉 Robin\'s account setup completed successfully!');
    console.log('\n📝 Login Instructions:');
    console.log(`   Email: ${userEmail}`);
    console.log(`   Password: ${userPassword}`);
    
  } catch (error) {
    console.error('❌ Error creating Robin\'s account:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Create the account
createRobinAccount();