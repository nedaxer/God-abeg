import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';

async function testAdminFunctionality() {
  try {
    console.log('🔧 Testing Admin Functionality...');
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    
    // Get a test user
    const testUser = await db.collection('users').findOne({
      email: { $exists: true }
    });
    
    if (!testUser) {
      console.log('❌ No test users found');
      return;
    }
    
    console.log('👤 Found test user:', testUser.email, 'ID:', testUser._id.toString());
    
    // Get current balance
    const currentBalance = await db.collection('userbalances').findOne({
      userId: testUser._id.toString(),
      currency: 'USD'
    });
    
    console.log('💰 Current USD balance:', currentBalance?.amount || 0);
    
    // Test admin fund addition via direct API call
    
    // Test admin login first
    console.log('\n🔐 Testing admin login...');
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@nedaxer.com',
        password: 'SMART456'
      }),
    });
    
    const loginText = await loginResponse.text();
    console.log('Login response:', loginResponse.status, loginText);
    
    // Get session cookie from response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Session cookies:', cookies);
    
    if (cookies && loginResponse.ok) {
      // Test add funds with session
      console.log('\n💰 Testing add funds with session...');
      const addFundsResponse = await fetch('http://localhost:5000/api/admin/users/add-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        body: JSON.stringify({
          userId: testUser._id.toString(),
          amount: 100
        }),
      });
      
      const addFundsText = await addFundsResponse.text();
      console.log('Add funds response:', addFundsResponse.status, addFundsText);
      
      // Check balance after addition
      const newBalance = await db.collection('userbalances').findOne({
        userId: testUser._id.toString(),
        currency: 'USD'
      });
      
      console.log('💰 New USD balance:', newBalance?.amount || 0);
      
      if (newBalance && newBalance.amount > (currentBalance?.amount || 0)) {
        console.log('✅ Admin fund addition working correctly!');
      } else {
        console.log('❌ Admin fund addition failed - balance not updated');
      }
    } else {
      console.log('❌ Admin login failed');
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Admin functionality test error:', error);
  }
}

testAdminFunctionality();