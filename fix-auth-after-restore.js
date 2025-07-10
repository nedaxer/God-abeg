#!/usr/bin/env node
// Fix authentication and session issues after backup restore

import { MongoClient } from 'mongodb';

async function fixAuthAfterRestore() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  console.log('🔧 Fixing authentication and session issues after restore...');
  
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
    
    // 1. Clear all existing sessions to force fresh logins
    console.log('\n🧹 Clearing all session data...');
    
    const databases = ['nedaxer', 'test'];
    let totalSessionsCleared = 0;
    
    for (const dbName of databases) {
      const db = client.db(dbName);
      
      try {
        const result = await db.collection('sessions').deleteMany({});
        console.log(`  Cleared ${result.deletedCount} sessions from ${dbName} database`);
        totalSessionsCleared += result.deletedCount;
      } catch (error) {
        console.log(`  No sessions collection found in ${dbName} database`);
      }
    }
    
    console.log(`✅ Total sessions cleared: ${totalSessionsCleared}`);
    
    // 2. Verify user data integrity
    console.log('\n🔍 Verifying user data integrity...');
    
    for (const dbName of databases) {
      const db = client.db(dbName);
      
      const users = await db.collection('users').find({}).toArray();
      const userBalances = await db.collection('userbalances').find({}).toArray();
      const currencies = await db.collection('currencies').find({}).toArray();
      
      console.log(`\n📂 ${dbName} database:`);
      console.log(`  - ${users.length} users`);
      console.log(`  - ${userBalances.length} balance records`);
      console.log(`  - ${currencies.length} currencies`);
      
      // Check for users with balances > 0
      const usersWithBalances = users.filter(u => u.balance > 0);
      if (usersWithBalances.length > 0) {
        console.log('  💰 Users with main balance:');
        usersWithBalances.forEach(u => {
          console.log(`    - ${u.username || u.email}: $${u.balance}`);
        });
      }
      
      // Check user balance records
      if (userBalances.length > 0) {
        console.log('  📊 User balance distribution:');
        const balancesByUser = {};
        userBalances.forEach(balance => {
          const userId = balance.userId.toString();
          if (!balancesByUser[userId]) balancesByUser[userId] = 0;
          balancesByUser[userId] += balance.amount;
        });
        
        Object.entries(balancesByUser).forEach(([userId, totalBalance]) => {
          const user = users.find(u => u._id.toString() === userId);
          if (user && totalBalance > 0) {
            console.log(`    - ${user.username || user.email}: $${totalBalance} (detailed balances)`);
          }
        });
      }
    }
    
    // 3. Fix any missing or invalid user data
    console.log('\n🔧 Checking for data integrity issues...');
    
    for (const dbName of databases) {
      const db = client.db(dbName);
      
      // Ensure all users have required fields
      const usersNeedingFix = await db.collection('users').find({
        $or: [
          { isVerified: { $exists: false } },
          { isAdmin: { $exists: false } },
          { balance: { $exists: false } }
        ]
      }).toArray();
      
      if (usersNeedingFix.length > 0) {
        console.log(`  Found ${usersNeedingFix.length} users needing data fixes in ${dbName}`);
        
        for (const user of usersNeedingFix) {
          const updates = {};
          if (user.isVerified === undefined) updates.isVerified = true;
          if (user.isAdmin === undefined) updates.isAdmin = false;
          if (user.balance === undefined) updates.balance = 0;
          
          await db.collection('users').updateOne(
            { _id: user._id },
            { $set: updates }
          );
          
          console.log(`    Fixed user: ${user.username || user.email}`);
        }
      }
    }
    
    console.log('\n✅ Authentication fixes completed!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Restart the application server');
    console.log('2. Clear browser cache and cookies');
    console.log('3. Users can now log in with their original credentials');
    console.log('4. User balances should display correctly after login');
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error during auth fix:', error);
  }
}

fixAuthAfterRestore();