#!/usr/bin/env node
// @ts-nocheck
// Script to restore user account with proper connection handling

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './server/models/User';
import { generateUID } from './server/utils/uid';

// MongoDB connection using environment variable
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

async function connectWithRetry() {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`🔗 Attempting MongoDB connection (attempt ${retryCount + 1}/${maxRetries})...`);
      
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
      retryCount++;
      console.log(`❌ Connection attempt ${retryCount} failed:`, error.message);
      
      if (retryCount < maxRetries) {
        console.log(`⏳ Waiting 2 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        throw error;
      }
    }
  }
}

async function restoreUserAccount() {
  try {
    await connectWithRetry();
    
    const userEmail = 'robinstephen025@outlook.com';
    const userPassword = 'robin123';
    
    console.log('\n🔍 Checking for existing user account...');
    
    // Check if user already exists
    let existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${userEmail}$`, 'i') }
    });
    
    if (existingUser) {
      console.log('👤 User account found, updating...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      
      // Update existing user
      await User.findByIdAndUpdate(existingUser._id, {
        password: hashedPassword,
        actualPassword: userPassword,
        isVerified: true,
        isAdmin: false,
        username: 'robinstephen025',
        firstName: 'Robin',
        lastName: 'Stephen'
      });
      
      console.log('✅ User account updated successfully');
      console.log(`📧 Email: ${userEmail}`);
      console.log(`👤 Username: robinstephen025`);
      console.log(`🔑 Password: ${userPassword}`);
      console.log(`✓ Verified: true`);
      
    } else {
      console.log('👤 Creating new user account...');
      
      // Generate unique UID
      let uid = generateUID();
      let isUidUnique = false;
      let attempts = 0;
      
      while (!isUidUnique && attempts < 10) {
        const existingUidUser = await User.findOne({ uid });
        if (!existingUidUser) {
          isUidUnique = true;
        } else {
          uid = generateUID();
          attempts++;
        }
      }
      
      if (!isUidUnique) {
        throw new Error('Failed to generate unique UID');
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      
      // Create new user
      const newUser = new User({
        uid,
        username: 'robinstephen025',
        email: userEmail,
        password: hashedPassword,
        actualPassword: userPassword,
        firstName: 'Robin',
        lastName: 'Stephen',
        isVerified: true,
        isAdmin: false,
        balance: 0,
        favorites: [],
        preferences: {},
        kycStatus: 'none',
        withdrawalAccess: false,
        transferAccess: false,
        createdAt: new Date()
      });
      
      await newUser.save();
      
      console.log('✅ User account created successfully');
      console.log(`📧 Email: ${userEmail}`);
      console.log(`👤 Username: robinstephen025`);
      console.log(`🔑 Password: ${userPassword}`);
      console.log(`🆔 UID: ${uid}`);
      console.log(`✓ Verified: true`);
    }
    
    // Verify the user can be found
    console.log('\n🧪 Testing user lookup...');
    const testUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${userEmail}$`, 'i') }
    });
    
    if (testUser) {
      console.log('✅ User lookup test successful');
      console.log(`Found user: ${testUser.username} (${testUser.email})`);
      
      // Test password verification
      const passwordMatch = await bcrypt.compare(userPassword, testUser.password);
      console.log(`🔐 Password verification test: ${passwordMatch ? 'PASSED' : 'FAILED'}`);
    } else {
      console.log('❌ User lookup test failed');
    }
    
    console.log('\n🎉 Account restoration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error restoring user account:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the restoration
restoreUserAccount();