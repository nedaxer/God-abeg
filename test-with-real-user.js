import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';

async function testWithRealUser() {
  let client;
  
  try {
    // Connect to MongoDB to create a test user with proper credentials
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('🔧 Setting up test user with proper authentication...\n');
    
    // Find an existing user with proper password
    const existingUser = await db.collection('users').findOne({ 
      email: 'robinstephen003@outlook.com' 
    });
    
    if (existingUser) {
      console.log(`✅ Found existing user: ${existingUser.email}`);
      console.log(`User ID: ${existingUser._id}`);
      
      // Update this user's password to a known value for testing
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      
      await db.collection('users').updateOne(
        { _id: existingUser._id },
        { 
          $set: { 
            password: hashedPassword,
            actualPassword: 'testpass123', // Store plain text for admin viewing
            withdrawalRestrictionMessage: "You need to deposit $500 to unlock withdrawals and transfers. This helps secure your account.",
            requiresDeposit: true
          } 
        }
      );
      
      // Create a transfer for testing history
      await db.collection('transfers').insertOne({
        transactionId: 'TEST-TXN-' + Date.now(),
        fromUserId: existingUser._id,
        toUserId: existingUser._id, // Self-transfer for testing
        amount: 100,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date()
      });
      
      console.log('✅ Updated user credentials and withdrawal restriction message');
      
      // Test login with this user
      console.log('\n=== TESTING WITH REAL USER ===');
      
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'robinstephen003@outlook.com',
          password: 'testpass123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginData.success) {
        // Extract session cookie
        const setCookieHeader = loginResponse.headers.get('set-cookie');
        const sessionCookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';
        console.log('Session cookie:', sessionCookie);
        
        // Test withdrawal restriction message
        console.log('\n=== TESTING WITHDRAWAL RESTRICTION ===');
        const withdrawalResponse = await fetch('http://localhost:5000/api/user/withdrawal-restriction', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie
          }
        });
        
        const withdrawalData = await withdrawalResponse.json();
        console.log('Withdrawal restriction response:', JSON.stringify(withdrawalData, null, 2));
        
        // Test transfer history
        console.log('\n=== TESTING TRANSFER HISTORY ===');
        const transferResponse = await fetch('http://localhost:5000/api/transfers/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie
          }
        });
        
        const transferData = await transferResponse.json();
        console.log('Transfer history response:', JSON.stringify(transferData, null, 2));
        
        // Test auth verification
        console.log('\n=== TESTING AUTH VERIFICATION ===');
        const authResponse = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie
          }
        });
        
        const authData = await authResponse.json();
        console.log('Auth verification response:', JSON.stringify(authData, null, 2));
        
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    } else {
      console.log('❌ Test user not found');
    }
    
  } catch (error) {
    console.error('Error testing with real user:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testWithRealUser().catch(console.error);