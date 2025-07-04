const { MongoClient } = require('mongodb');

async function testTransferRestrictionSystem() {
  let client;
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('🔧 Testing Transfer Restriction System...\n');
    
    // 1. Check current user restriction states
    console.log('=== CURRENT USER RESTRICTION STATES ===');
    const users = await db.collection('users').find({}).toArray();
    console.log(`Total users found: ${users.length}`);
    
    users.forEach(user => {
      console.log(`User ${user.uid || user._id.toString()}:`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - requiresDeposit: ${user.requiresDeposit}`);
      console.log(`  - withdrawalRestrictionMessage: "${user.withdrawalRestrictionMessage || 'None'}"`);
      console.log('');
    });
    
    // 2. Find a test user to work with
    const testUser = users.find(u => u.email === 'robinstephen003@outlook.com') || users[0];
    if (!testUser) {
      console.log('❌ No test user found');
      return;
    }
    
    console.log(`Using test user: ${testUser.email} (${testUser._id})`);
    
    // 3. Test admin login
    console.log('\n=== TESTING ADMIN LOGIN ===');
    const adminLoginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@nedaxer.com',
        password: 'SMART456'
      })
    });
    
    const adminLoginData = await adminLoginResponse.json();
    console.log('Admin login response:', adminLoginData.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (!adminLoginData.success) {
      console.log('Cannot continue without admin access');
      return;
    }
    
    const adminSessionCookie = adminLoginResponse.headers.get('set-cookie')?.split(';')[0] || '';
    console.log('Admin session cookie obtained:', adminSessionCookie ? '✅' : '❌');
    
    // 4. Test enabling deposit requirement
    console.log('\n=== TESTING ENABLE DEPOSIT REQUIREMENT ===');
    const enableResponse = await fetch('http://localhost:5000/api/admin/users/toggle-deposit-requirement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminSessionCookie
      },
      body: JSON.stringify({
        userId: testUser._id.toString(),
        requiresDeposit: true
      })
    });
    
    const enableData = await enableResponse.json();
    console.log('Enable requirement response:', enableData.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('Response data:', JSON.stringify(enableData, null, 2));
    
    // 5. Check database after enable
    console.log('\n=== DATABASE STATE AFTER ENABLE ===');
    const userAfterEnable = await db.collection('users').findOne({ _id: testUser._id });
    console.log(`User requiresDeposit: ${userAfterEnable.requiresDeposit}`);
    
    // 6. Test user API endpoint for deposit requirement
    console.log('\n=== TESTING USER DEPOSIT REQUIREMENT ENDPOINT ===');
    
    // First create a user session for the test user
    const userLoginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUser.email,
        password: 'testpass123' // Assuming this is the password from our fix scripts
      })
    });
    
    const userLoginData = await userLoginResponse.json();
    console.log('User login response:', userLoginData.success ? '✅ SUCCESS' : '❌ FAILED');
    
    if (userLoginData.success) {
      const userSessionCookie = userLoginResponse.headers.get('set-cookie')?.split(';')[0] || '';
      
      const depositReqResponse = await fetch('http://localhost:5000/api/user/deposit-requirement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': userSessionCookie
        }
      });
      
      const depositReqData = await depositReqResponse.json();
      console.log('User deposit requirement check:', depositReqData.success ? '✅ SUCCESS' : '❌ FAILED');
      console.log('Deposit requirement data:', JSON.stringify(depositReqData, null, 2));
    }
    
    // 7. Test disabling deposit requirement
    console.log('\n=== TESTING DISABLE DEPOSIT REQUIREMENT ===');
    const disableResponse = await fetch('http://localhost:5000/api/admin/users/toggle-deposit-requirement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminSessionCookie
      },
      body: JSON.stringify({
        userId: testUser._id.toString(),
        requiresDeposit: false
      })
    });
    
    const disableData = await disableResponse.json();
    console.log('Disable requirement response:', disableData.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('Response data:', JSON.stringify(disableData, null, 2));
    
    // 8. Check database after disable
    console.log('\n=== DATABASE STATE AFTER DISABLE ===');
    const userAfterDisable = await db.collection('users').findOne({ _id: testUser._id });
    console.log(`User requiresDeposit: ${userAfterDisable.requiresDeposit}`);
    
    // 9. Test user API endpoint again after disable
    if (userLoginData.success) {
      const userSessionCookie = userLoginResponse.headers.get('set-cookie')?.split(';')[0] || '';
      
      const depositReqResponse2 = await fetch('http://localhost:5000/api/user/deposit-requirement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': userSessionCookie
        }
      });
      
      const depositReqData2 = await depositReqResponse2.json();
      console.log('User deposit requirement check after disable:', depositReqData2.success ? '✅ SUCCESS' : '❌ FAILED');
      console.log('Deposit requirement data after disable:', JSON.stringify(depositReqData2, null, 2));
    }
    
    console.log('\n=== TEST SUMMARY ===');
    console.log('✅ Transfer restriction system test completed');
    console.log('Check the logs above to see if admin enable/disable is working properly');
    
  } catch (error) {
    console.error('❌ Error testing transfer restriction system:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testTransferRestrictionSystem();