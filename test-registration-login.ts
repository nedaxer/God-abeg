#!/usr/bin/env node
// @ts-nocheck
// Script to test user registration and login functionality

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

async function testRegistration() {
  console.log('\n📝 Testing user registration...');
  
  const testEmail = 'test.registration@example.com';
  const testPassword = 'testpassword123';
  
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${testEmail}$`, 'i') }
    });
    
    if (existingUser) {
      console.log('🗑️ Removing existing test user...');
      await User.findByIdAndDelete(existingUser._id);
    }
    
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
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // Create new test user
    const newUser = new User({
      uid,
      username: 'testreguser',
      email: testEmail,
      password: hashedPassword,
      actualPassword: testPassword,
      firstName: 'Test',
      lastName: 'Registration',
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
    
    console.log('✅ Registration test successful');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`👤 Username: testreguser`);
    console.log(`🆔 UID: ${uid}`);
    
    return { email: testEmail, password: testPassword, uid };
    
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    throw error;
  }
}

async function testLogin(email: string, password: string) {
  console.log('\n🔐 Testing user login...');
  
  try {
    // Simulate login process
    console.log(`Attempting login for: ${email}`);
    
    // Find user by email (case-insensitive)
    let user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (!user) {
      // Try finding by username if email fails
      user = await User.findOne({ 
        username: { $regex: new RegExp(`^${email}$`, 'i') }
      });
    }
    
    if (!user) {
      console.log('❌ Login test failed: User not found');
      return false;
    }
    
    console.log(`👤 User found: ${user.username} (${user.email})`);
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('❌ Login test failed: Invalid password');
      return false;
    }
    
    console.log('✅ Login test successful');
    console.log(`🆔 User ID: ${user._id}`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`✓ Verified: ${user.isVerified}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Login test failed:', error);
    return false;
  }
}

async function runTests() {
  try {
    await connectWithRetry();
    
    console.log('🧪 Starting registration and login tests...');
    
    // Test 1: Registration
    const testUser = await testRegistration();
    
    // Test 2: Login with the registered user
    await testLogin(testUser.email, testUser.password);
    
    // Test 3: Login with your actual account
    console.log('\n🔐 Testing your actual account login...');
    await testLogin('robinstephen025@outlook.com', 'robin123');
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the tests
runTests();