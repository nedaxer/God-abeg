import fetch from 'node-fetch';

async function testApiEndpoints() {
  console.log('🧪 Testing API Endpoints with Authentication...\n');
  
  let sessionCookie = '';
  
  try {
    // Step 1: Login to get session cookie
    console.log('=== STEP 1: LOGIN ===');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'robinstephen003@outlook.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.text();
    console.log('Login response:', loginData);
    
    // Extract session cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      sessionCookie = setCookieHeader.split(';')[0];
      console.log('Session cookie extracted:', sessionCookie);
    }
    
    if (!loginResponse.ok) {
      // Try with a different user credential
      console.log('Trying alternative login...');
      const altLoginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'nedaxer.us@gmail.com',
          password: 'SMART456'
        })
      });
      
      const altLoginData = await altLoginResponse.text();
      console.log('Alternative login response:', altLoginData);
      
      const altSetCookieHeader = altLoginResponse.headers.get('set-cookie');
      if (altSetCookieHeader) {
        sessionCookie = altSetCookieHeader.split(';')[0];
        console.log('Alternative session cookie:', sessionCookie);
      }
    }
    
    if (!sessionCookie) {
      console.log('❌ No session cookie obtained, continuing without authentication');
    }
    
    // Step 2: Test withdrawal restriction endpoint
    console.log('\n=== STEP 2: WITHDRAWAL RESTRICTION MESSAGE ===');
    const withdrawalResponse = await fetch('http://localhost:5000/api/user/withdrawal-restriction', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    });
    
    const withdrawalData = await withdrawalResponse.json();
    console.log('Withdrawal restriction response:', JSON.stringify(withdrawalData, null, 2));
    
    if (withdrawalData.success) {
      console.log('✅ Withdrawal restriction message retrieved successfully');
      console.log(`Message: "${withdrawalData.withdrawalRestrictionMessage}"`);
      console.log(`Requires deposit: ${withdrawalData.requiresDeposit}`);
    } else {
      console.log('❌ Failed to get withdrawal restriction message:', withdrawalData.message);
    }
    
    // Step 3: Test transfer history endpoint
    console.log('\n=== STEP 3: TRANSFER HISTORY ===');
    const transferResponse = await fetch('http://localhost:5000/api/transfers/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    });
    
    const transferData = await transferResponse.json();
    console.log('Transfer history response:', JSON.stringify(transferData, null, 2));
    
    if (transferData.success) {
      console.log('✅ Transfer history retrieved successfully');
      console.log(`Found ${transferData.data.length} transfers`);
      
      if (transferData.data.length > 0) {
        console.log('Recent transfers:');
        transferData.data.slice(0, 3).forEach((transfer, index) => {
          console.log(`  ${index + 1}. ${transfer.type.toUpperCase()}: $${transfer.amount}`);
          console.log(`     Transaction ID: ${transfer.transactionId}`);
          console.log(`     Status: ${transfer.status}`);
          console.log(`     Date: ${new Date(transfer.createdAt).toLocaleDateString()}`);
        });
      }
    } else {
      console.log('❌ Failed to get transfer history:', transferData.message);
    }
    
    // Step 4: Test auth/user endpoint to verify session
    console.log('\n=== STEP 4: SESSION VERIFICATION ===');
    const authResponse = await fetch('http://localhost:5000/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    });
    
    const authData = await authResponse.json();
    console.log('Auth verification response:', JSON.stringify(authData, null, 2));
    
    if (authData.success) {
      console.log('✅ User session verified successfully');
      console.log(`User: ${authData.user.email} (UID: ${authData.user.uid})`);
    } else {
      console.log('❌ Session verification failed:', authData.message);
    }
    
    console.log('\n🎉 API ENDPOINT TESTING COMPLETE');
    
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }
}

testApiEndpoints().catch(console.error);