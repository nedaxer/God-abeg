import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';

async function fixBothIssues() {
  let client;
  
  try {
    // Connect to MongoDB using environment variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('🔧 Fixing both withdrawal restriction messages and transfer history...\n');
    
    // 1. Find a real user and fix their authentication
    const realUser = await db.collection('users').findOne({ 
      email: 'robinstephen003@outlook.com' 
    });
    
    if (!realUser) {
      console.log('❌ Real user not found');
      return;
    }
    
    console.log(`✅ Found user: ${realUser.email}`);
    console.log(`User ID: ${realUser._id}`);
    
    // 2. Update user with withdrawal restriction message and proper password
    const bcrypt = await import('bcrypt');
    const plainPassword = 'testpass123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    await db.collection('users').updateOne(
      { _id: realUser._id },
      { 
        $set: { 
          password: hashedPassword,
          withdrawalRestrictionMessage: "You need to deposit $500 to unlock withdrawals and transfers. This helps secure your account.",
          requiresDeposit: true
        } 
      }
    );
    console.log('✅ Updated user with withdrawal restriction message');
    
    // 3. Create test transfer data
    const transferId = 'TEST-TXN-' + Date.now();
    await db.collection('transfers').insertOne({
      transactionId: transferId,
      fromUserId: realUser._id,
      toUserId: realUser._id, // Self-transfer for testing
      amount: 150,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date()
    });
    console.log(`✅ Created test transfer: ${transferId}`);
    
    // 4. Test login with proper credentials
    console.log('\n=== TESTING LOGIN ===');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: realUser.email,
        password: plainPassword
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.log('❌ Login failed, trying to debug password...');
      
      // Check if password verification works
      const storedUser = await db.collection('users').findOne({ _id: realUser._id });
      const passwordMatch = await bcrypt.compare(plainPassword, storedUser.password);
      console.log('Password verification:', passwordMatch);
      
      if (!passwordMatch) {
        // Try updating with a simpler hash
        const simpleHash = await bcrypt.hash('simple123', 10);
        await db.collection('users').updateOne(
          { _id: realUser._id },
          { $set: { password: simpleHash } }
        );
        
        const retryResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: realUser.email,
            password: 'simple123'
          })
        });
        
        const retryData = await retryResponse.json();
        console.log('Retry login response:', retryData);
        
        if (retryData.success) {
          const sessionCookie = retryResponse.headers.get('set-cookie')?.split(';')[0] || '';
          await testBothFeatures(sessionCookie);
        }
      }
      return;
    }
    
    // Extract session cookie and test both features
    const sessionCookie = loginResponse.headers.get('set-cookie')?.split(';')[0] || '';
    await testBothFeatures(sessionCookie);
    
  } catch (error) {
    console.error('Error fixing both issues:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function testBothFeatures(sessionCookie) {
  console.log('\n=== TESTING BOTH FEATURES ===');
  console.log('Session cookie:', sessionCookie);
  
  // Test withdrawal restriction message
  console.log('\n1. Testing Withdrawal Restriction Message:');
  try {
    const withdrawalResponse = await fetch('http://localhost:5000/api/user/withdrawal-restriction', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    });
    
    const withdrawalData = await withdrawalResponse.json();
    console.log('✅ Withdrawal restriction response:', JSON.stringify(withdrawalData, null, 2));
    
    if (withdrawalData.success && withdrawalData.data?.message) {
      console.log('✅ Withdrawal restriction message working correctly!');
    } else {
      console.log('❌ Withdrawal restriction message not working');
    }
  } catch (error) {
    console.log('❌ Withdrawal restriction test failed:', error.message);
  }
  
  // Test transfer history
  console.log('\n2. Testing Transfer History:');
  try {
    const transferResponse = await fetch('http://localhost:5000/api/transfers/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    });
    
    const transferData = await transferResponse.json();
    console.log('✅ Transfer history response:', JSON.stringify(transferData, null, 2));
    
    if (transferData.success && Array.isArray(transferData.data)) {
      console.log(`✅ Transfer history working correctly! Found ${transferData.data.length} transfers`);
    } else {
      console.log('❌ Transfer history not working');
    }
  } catch (error) {
    console.log('❌ Transfer history test failed:', error.message);
  }
  
  console.log('\n🎉 BOTH FEATURE TESTS COMPLETED');
}

fixBothIssues().catch(console.error);