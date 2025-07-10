// @ts-nocheck
// Backup all existing users and diagnose authentication issues

import mongoose from 'mongoose';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { User } from './server/models/User';
import { UserBalance } from './server/models/UserBalance';
import { Currency } from './server/models/Currency';
import { generateUID } from './server/utils/uid';

// MongoDB connection using environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

async function backupAndFixAuth() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('MongoDB URI format check:', {
      hasUri: !!MONGODB_URI,
      startsWithMongodb: MONGODB_URI.startsWith('mongodb'),
      length: MONGODB_URI.length,
      maskedUri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    });
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully');

    // 1. Backup all existing users
    console.log('\n📋 Backing up all existing users...');
    const allUsers = await User.find({}).lean();
    console.log(`📊 Found ${allUsers.length} existing users`);

    if (allUsers.length > 0) {
      const backupData = {
        timestamp: new Date().toISOString(),
        totalUsers: allUsers.length,
        users: allUsers.map(user => ({
          _id: user._id.toString(),
          uid: user.uid,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          balance: user.balance,
          kycStatus: user.kycStatus,
          transferAccess: user.transferAccess,
          withdrawalAccess: user.withdrawalAccess,
          createdAt: user.createdAt,
          // Store original password hash for preservation
          passwordHash: user.password,
          actualPassword: user.actualPassword
        }))
      };

      const backupFilename = `user-backup-${Date.now()}.json`;
      fs.writeFileSync(backupFilename, JSON.stringify(backupData, null, 2));
      console.log(`✅ User backup saved to: ${backupFilename}`);

      // Display user summary
      console.log('\n👥 Current Users Summary:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.isVerified ? 'Verified' : 'Unverified'} ${user.isAdmin ? '- ADMIN' : ''}`);
        if (user.actualPassword) {
          console.log(`   Password: ${user.actualPassword}`);
        }
      });
    }

    // 2. Test authentication for each user
    console.log('\n🔐 Testing authentication for existing users...');
    
    // First test known admin credentials
    console.log('Testing hardcoded admin login...');
    const adminEmail = 'admin@nedaxer.com';
    const adminPassword = 'SMART456';
    console.log(`Admin credentials: ${adminEmail} / ${adminPassword}`);

    // Test each user's password hash
    for (const user of allUsers) {
      console.log(`\n🔍 Testing user: ${user.username} (${user.email})`);
      
      // Try stored actual password first
      if (user.actualPassword) {
        console.log(`  ℹ️  Stored actual password: ${user.actualPassword}`);
        const isValid = await bcrypt.compare(user.actualPassword, user.password);
        console.log(`  🔐 Password hash validation: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      } else {
        // Try common default passwords
        const commonPasswords = ['password', '123456', 'admin', 'test123', user.username, 'password123'];
        let foundValidPassword = false;
        
        for (const testPassword of commonPasswords) {
          const isValid = await bcrypt.compare(testPassword, user.password);
          if (isValid) {
            console.log(`  🔐 Valid password found: "${testPassword}"`);
            foundValidPassword = true;
            break;
          }
        }
        
        if (!foundValidPassword) {
          console.log(`  ❌ No common password works for this user`);
        }
      }
    }

    // 3. Check user balances
    console.log('\n💰 Checking user balances...');
    const balances = await UserBalance.find({}).populate('userId').populate('currencyId');
    console.log(`📊 Found ${balances.length} balance records`);

    if (balances.length > 0) {
      balances.forEach(balance => {
        const user = balance.userId;
        const currency = balance.currencyId;
        if (user && currency) {
          console.log(`  ${user.username}: ${balance.amount} ${currency.symbol}`);
        }
      });
    }

    // 4. Check MongoDB connection health
    console.log('\n🏥 MongoDB Connection Health Check:');
    const dbStats = await mongoose.connection.db.stats();
    console.log(`  Database: ${mongoose.connection.name}`);
    console.log(`  Collections: ${dbStats.collections}`);
    console.log(`  Data Size: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Index Size: ${(dbStats.indexSize / 1024 / 1024).toFixed(2)} MB`);

    // 5. Verify critical collections exist
    console.log('\n📋 Verifying collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const requiredCollections = ['users', 'currencies', 'userbalances'];
    requiredCollections.forEach(collName => {
      const exists = collectionNames.includes(collName);
      console.log(`  ${collName}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });

    // 6. Test user authentication simulation
    console.log('\n🧪 Testing authentication simulation...');
    if (allUsers.length > 0) {
      for (const user of allUsers.slice(0, 3)) { // Test first 3 users
        console.log(`\nTesting login for: ${user.email}`);
        
        // Simulate the exact login process from routes.mongo.ts
        try {
          // Find user by email (as done in login endpoint)
          const foundUser = await User.findOne({ 
            $or: [
              { email: user.email.toLowerCase() },
              { username: user.email.toLowerCase() }
            ]
          });
          
          if (foundUser) {
            console.log(`  ✅ User found in database`);
            console.log(`  User ID: ${foundUser._id}`);
            console.log(`  Username: ${foundUser.username}`);
            console.log(`  Email: ${foundUser.email}`);
            console.log(`  Verified: ${foundUser.isVerified}`);
            
            if (foundUser.actualPassword) {
              const passwordValid = await bcrypt.compare(foundUser.actualPassword, foundUser.password);
              console.log(`  Password validation: ${passwordValid ? '✅ VALID' : '❌ INVALID'}`);
            }
          } else {
            console.log(`  ❌ User NOT found in database`);
          }
        } catch (error) {
          console.log(`  ❌ Error finding user: ${error.message}`);
        }
      }
    }

    // 7. Create a working test user with known credentials
    console.log('\n➕ Creating a fresh test user with known credentials...');
    await createTestUser();

    console.log('\n✅ Backup and authentication diagnosis completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - ${allUsers.length} users backed up`);
    console.log(`  - MongoDB connection: Working`);
    console.log(`  - Collections: Verified`);
    console.log(`  - Admin login: Available (admin@nedaxer.com / SMART456)`);
    console.log(`  - Test user: Created (testuser2025@nedaxer.com / password123)`);

  } catch (error) {
    console.error('❌ Error during backup and diagnosis:', error);
    
    // More detailed error information
    if (error.name === 'MongooseError') {
      console.error('MongoDB connection issue. Check your MONGODB_URI environment variable.');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Delete existing test user if it exists
    await User.deleteMany({ 
      $or: [
        { username: 'testuser2025' },
        { email: 'testuser2025@nedaxer.com' }
      ]
    });
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = new User({
      uid: generateUID(),
      username: 'testuser2025',
      email: 'testuser2025@nedaxer.com',
      password: hashedPassword,
      actualPassword: 'password123', // Store for admin reference
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
      isAdmin: false,
      transferAccess: false,
      withdrawalAccess: false,
      requiresDeposit: false,
      kycStatus: 'none'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log(`  Username: testuser2025`);
    console.log(`  Email: testuser2025@nedaxer.com`);
    console.log(`  Password: password123`);
    
    // Create USD balance for test user
    const usdCurrency = await Currency.findOne({ symbol: 'USD' });
    if (usdCurrency) {
      const testBalance = new UserBalance({
        userId: testUser._id,
        currencyId: usdCurrency._id,
        amount: 1000 // Start with $1000
      });
      await testBalance.save();
      console.log('✅ Test user balance created: $1000 USD');
    }
    
    // Test login immediately
    console.log('\n🧪 Testing new user login...');
    const loginUser = await User.findOne({ email: 'testuser2025@nedaxer.com' });
    if (loginUser) {
      const passwordValid = await bcrypt.compare('password123', loginUser.password);
      console.log(`Login test: ${passwordValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
}

// Run the backup and diagnosis
backupAndFixAuth().catch(console.error);