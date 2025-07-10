#!/usr/bin/env node
// Debug user authentication and balance issues after restore

import { MongoClient } from 'mongodb';

async function debugBackupRestoreIssues() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  console.log('🔍 Debugging user authentication and balance issues...');
  
  try {
    const client = new MongoClient(mongoUri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000
    });
    
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    // Check both databases
    const databases = ['nedaxer', 'test'];
    
    for (const dbName of databases) {
      console.log(`\n📂 Checking database: ${dbName}`);
      const db = client.db(dbName);
      
      // 1. Check users collection
      console.log('\n👥 USERS ANALYSIS:');
      const users = await db.collection('users').find({}).toArray();
      console.log(`Total users: ${users.length}`);
      
      users.forEach(user => {
        console.log(`- ${user.username || user.email}:`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Verified: ${user.isVerified}`);
        console.log(`  Admin: ${user.isAdmin}`);
        console.log(`  Balance: $${user.balance || 0}`);
        console.log(`  Password Hash: ${user.password ? 'Present' : 'Missing'}`);
        console.log(`  Created: ${user.createdAt || 'Unknown'}`);
      });
      
      // 2. Check user balances
      console.log('\n💰 USER BALANCES ANALYSIS:');
      const userBalances = await db.collection('userbalances').find({}).toArray();
      console.log(`Total balance records: ${userBalances.length}`);
      
      const balancesByUser = {};
      userBalances.forEach(balance => {
        const userId = balance.userId.toString();
        if (!balancesByUser[userId]) balancesByUser[userId] = [];
        balancesByUser[userId].push({
          currency: balance.currencyId,
          amount: balance.amount
        });
      });
      
      console.log('Balance distribution:');
      Object.entries(balancesByUser).forEach(([userId, balances]) => {
        const user = users.find(u => u._id.toString() === userId);
        console.log(`- ${user?.username || user?.email || userId}:`);
        balances.forEach(b => {
          console.log(`    ${b.currency}: ${b.amount}`);
        });
      });
      
      // 3. Check currencies
      console.log('\n💱 CURRENCIES:');
      const currencies = await db.collection('currencies').find({}).toArray();
      currencies.forEach(currency => {
        console.log(`- ${currency.symbol}: ${currency.name}`);
      });
      
      // 4. Check sessions
      console.log('\n🔐 SESSIONS:');
      const sessions = await db.collection('sessions').find({}).toArray();
      console.log(`Active sessions: ${sessions.length}`);
      sessions.forEach(session => {
        console.log(`- Session ID: ${session._id}`);
        console.log(`  User ID: ${session.userId || 'None'}`);
        console.log(`  Expires: ${session.expires || 'No expiry'}`);
      });
    }
    
    console.log('\n🔍 DIAGNOSIS COMPLETE');
    console.log('\n📋 POTENTIAL ISSUES:');
    console.log('1. Session data might not match current session store configuration');
    console.log('2. User balance lookup might be failing due to ObjectId references');
    console.log('3. Authentication middleware might not be finding restored user data');
    console.log('4. Database names might not match application expectations');
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  }
}

debugBackupRestoreIssues();