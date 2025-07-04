#!/usr/bin/env tsx

import fetch from 'node-fetch';

async function testLoginWithNumericUID() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('Testing login with user who has numeric UID...');
    
    // Test login with Robin user (has numeric UID: 4498598160)
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'robinstephen003@outlook.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.success) {
      console.log('✅ Login successful');
      console.log('User data:', {
        _id: loginData.user._id,
        uid: loginData.user.uid,
        username: loginData.user.username,
        email: loginData.user.email
      });
      
      // Extract session cookie
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      console.log('Session cookie:', setCookieHeader);
      
      if (setCookieHeader) {
        // Test auth endpoint with session
        const authResponse = await fetch(`${baseUrl}/api/auth/user`, {
          method: 'GET',
          headers: {
            'Cookie': setCookieHeader
          }
        });
        
        const authData = await authResponse.json();
        console.log('\nAuth endpoint response:', authData);
        
        if (authData.uid) {
          console.log(`✅ UID correctly returned: ${authData.uid}`);
        } else {
          console.log('❌ UID missing from auth response');
        }
      }
      
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

console.log('🧪 Testing login with user who has numeric UID...');
testLoginWithNumericUID()
  .then(() => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });