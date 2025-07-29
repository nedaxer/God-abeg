#!/usr/bin/env node
// @ts-nocheck
// Comprehensive account test and creation script

import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Test data
const ROBIN_ACCOUNT = {
  username: 'robinstephen025',
  email: 'robinstephen025@outlook.com',
  password: 'robin123',
  firstName: 'Robin',
  lastName: 'Stephen'
};

const TEST_ACCOUNT = {
  username: 'testuser456',
  email: 'testuser456@example.com',
  password: 'testpass456',
  firstName: 'Test',
  lastName: 'User456'
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRegistration(userData: typeof ROBIN_ACCOUNT) {
  console.log(`\n📝 Testing registration for ${userData.email}...`);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, userData, {
      timeout: 60000
    });
    
    console.log('✅ Registration response:', response.status);
    console.log('📧 Message:', response.data.message);
    
    if (response.data.requiresVerification) {
      console.log('📨 Verification required - check email for code');
      return { success: true, needsVerification: true, data: response.data };
    }
    
    return { success: true, needsVerification: false, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration failed:', error.response.status, error.response.data.message);
      return { success: false, error: error.response.data };
    } else {
      console.log('❌ Registration error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

async function testVerification(email: string, code: string) {
  console.log(`\n🔐 Testing verification for ${email} with code ${code}...`);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/verify`, {
      email,
      code
    }, {
      timeout: 30000
    });
    
    console.log('✅ Verification response:', response.status);
    console.log('📧 Message:', response.data.message);
    
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log('❌ Verification failed:', error.response.status, error.response.data.message);
      return { success: false, error: error.response.data };
    } else {
      console.log('❌ Verification error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

async function testLogin(username: string, password: string) {
  console.log(`\n🔑 Testing login for ${username}...`);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password
    }, {
      timeout: 120000, // 2 minutes timeout for login
      withCredentials: true
    });
    
    console.log('✅ Login response:', response.status);
    console.log('📧 Message:', response.data.message);
    
    // Extract cookies
    const cookies = response.headers['set-cookie'];
    console.log('🍪 Session cookies received');
    
    return { success: true, data: response.data, cookies };
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed:', error.response.status, error.response.data.message);
      return { success: false, error: error.response.data };
    } else {
      console.log('❌ Login error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

async function testAuthenticatedRequest(cookies: string[]) {
  console.log('\n🔒 Testing authenticated request...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/user`, {
      headers: {
        'Cookie': cookies.join('; ')
      },
      timeout: 30000
    });
    
    console.log('✅ Auth check response:', response.status);
    console.log('👤 User data:', response.data);
    
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log('❌ Auth check failed:', error.response.status, error.response.data.message);
      return { success: false, error: error.response.data };
    } else {
      console.log('❌ Auth check error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

async function runComprehensiveTest() {
  console.log('🧪 Starting comprehensive account testing...');
  console.log('=' .repeat(60));
  
  // Test 1: Create and test new account
  console.log('\n🔬 TEST 1: New Account Flow');
  console.log('-' .repeat(30));
  
  const registrationResult = await testRegistration(TEST_ACCOUNT);
  
  if (registrationResult.success && registrationResult.needsVerification) {
    console.log('\n⏳ Waiting for manual verification...');
    console.log('📱 Please check the console logs for the verification code');
    console.log('🕐 Waiting 30 seconds for email processing...');
    
    await delay(30000);
    
    // In real scenario, user would provide the code
    // For now, we'll skip verification test
    console.log('⚠️ Skipping verification test - would need manual code input');
  }
  
  // Test 2: Try to login to Robin's account
  console.log('\n\n🔬 TEST 2: Robin\'s Account Login');
  console.log('-' .repeat(30));
  
  const loginResult = await testLogin(ROBIN_ACCOUNT.email, ROBIN_ACCOUNT.password);
  
  if (loginResult.success) {
    console.log('\n🎉 Login successful! Testing authenticated requests...');
    
    const authResult = await testAuthenticatedRequest(loginResult.cookies);
    
    if (authResult.success) {
      console.log('\n✅ COMPLETE SUCCESS: Account is fully functional!');
      console.log('🎯 Robin can now login with:');
      console.log(`   📧 Email: ${ROBIN_ACCOUNT.email}`);
      console.log(`   🔑 Password: ${ROBIN_ACCOUNT.password}`);
    } else {
      console.log('\n⚠️ Login succeeded but auth check failed');
    }
  } else {
    console.log('\n❌ Login failed for Robin\'s account');
    
    // Try alternative login methods
    console.log('\n🔄 Trying alternative login with username...');
    const altLoginResult = await testLogin(ROBIN_ACCOUNT.username, ROBIN_ACCOUNT.password);
    
    if (altLoginResult.success) {
      console.log('✅ Alternative login successful!');
      
      const authResult = await testAuthenticatedRequest(altLoginResult.cookies);
      
      if (authResult.success) {
        console.log('\n✅ COMPLETE SUCCESS: Account is fully functional!');
        console.log('🎯 Robin can now login with:');
        console.log(`   👤 Username: ${ROBIN_ACCOUNT.username}`);
        console.log(`   🔑 Password: ${ROBIN_ACCOUNT.password}`);
      }
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Comprehensive testing completed');
}

// Run the tests
runComprehensiveTest().catch(console.error);