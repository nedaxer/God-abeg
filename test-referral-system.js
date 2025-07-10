/**
 * Test script to create sample referral data for testing the invite/referral system
 * Usage: node test-referral-system.js
 */

import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jerremy75464:H1fkebRe6RFCEfQE@nedaxer.qzntzfb.mongodb.net/';

async function createTestReferralData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import the models (using module format)
    console.log('📦 Loading model files with fs...');
    
    // Create test user to use as referrer
    const testUserData = {
      uid: '1234567890',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
      referralCode: 'NEDAXER_TU2025_ABC123'
    };

    // Manually create user document with referral code
    const existingUser = await mongoose.connection.db.collection('users').findOne({
      email: testUserData.email
    });

    if (!existingUser) {
      await mongoose.connection.db.collection('users').insertOne({
        ...testUserData,
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Created test user with referral code');
    }

    // Find the test user we created
    const user = await mongoose.connection.db.collection('users').findOne({
      email: testUserData.email
    });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }

    console.log(`👤 Using test user: ${user.email} (${user._id})`);
    console.log(`🔗 Referral code: ${user.referralCode}`);

    // Create sample referral earnings using MongoDB collection directly
    const sampleEarnings = [
      {
        referrerId: user._id.toString(),
        referredUserId: new mongoose.Types.ObjectId().toString(),
        amount: 25.50,
        percentage: 25,
        transactionType: 'trading',
        originalAmount: 102.00,
        currencyId: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        referrerId: user._id.toString(),
        referredUserId: new mongoose.Types.ObjectId().toString(),
        amount: 15.75,
        percentage: 15,
        transactionType: 'deposit',
        originalAmount: 105.00,
        currencyId: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        referrerId: user._id.toString(),
        referredUserId: new mongoose.Types.ObjectId().toString(),
        amount: 12.25,
        percentage: 20,
        transactionType: 'trading',
        originalAmount: 61.25,
        currencyId: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('💰 Creating sample referral earnings...');
    
    // Remove existing earnings for this user first
    await mongoose.connection.db.collection('referralearnings').deleteMany({ 
      referrerId: user._id.toString() 
    });
    
    // Create new earnings
    await mongoose.connection.db.collection('referralearnings').insertMany(sampleEarnings);
    console.log(`  ✅ Created ${sampleEarnings.length} referral earnings`);

    console.log('\n🎉 Test referral data created successfully!');
    console.log(`📊 Referral Code: ${user.referralCode}`);
    console.log(`🔗 Invite Link: https://nedaxer.onrender.com/register?ref=${user.referralCode}`);
    console.log(`💰 Total Earnings: $${sampleEarnings.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`);
    console.log(`👥 Total Referrals: ${sampleEarnings.length}`);

  } catch (error) {
    console.error('❌ Error creating test referral data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the test
createTestReferralData();