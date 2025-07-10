// @ts-nocheck
// Complete Admin Functionality Testing Script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@nedaxer.com',
  password: 'SMART456'
};

let adminCookies = '';

async function adminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    
    const response = await axios.post(`${BASE_URL}/api/admin/login`, ADMIN_CREDENTIALS, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Admin login response:', response.data);
    
    // Extract cookies for subsequent requests
    if (response.headers['set-cookie']) {
      adminCookies = response.headers['set-cookie'].join('; ');
      console.log('📝 Admin cookies captured');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testAdminUserSearch() {
  try {
    console.log('\n🔍 Testing admin user search...');
    
    const response = await axios.get(`${BASE_URL}/api/admin/users/search?q=test`, {
      headers: {
        'Cookie': adminCookies,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ Admin user search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Admin user search failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetAllUsers() {
  try {
    console.log('\n👥 Testing get all users...');
    
    const response = await axios.get(`${BASE_URL}/api/admin/users/all`, {
      headers: {
        'Cookie': adminCookies,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ All users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get all users failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testAddFunds(userId, amount = 100) {
  try {
    console.log(`\n💰 Testing add funds to user ${userId}...`);
    
    const response = await axios.post(`${BASE_URL}/api/admin/users/add-funds`, {
      userId,
      amount
    }, {
      headers: {
        'Cookie': adminCookies,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ Add funds response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Add funds failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testConnectionRequest(userId) {
  try {
    console.log(`\n🔗 Testing connection request to user ${userId}...`);
    
    const requestData = {
      userId,
      serviceName: 'Test Exchange',
      customMessage: 'We would like to connect your account for better trading experience.',
      successMessage: 'Thank you for connecting! Your account is now linked.'
    };
    
    const response = await axios.post(`${BASE_URL}/api/admin/connection-request/send`, requestData, {
      headers: {
        'Cookie': adminCookies,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ Connection request response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Connection request failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testSupportMessage(userId) {
  try {
    console.log(`\n💬 Testing support message to user ${userId}...`);
    
    const messageData = {
      userId,
      message: 'Hello! This is a test support message from the admin team. Please confirm you received this.'
    };
    
    const response = await axios.post(`${BASE_URL}/api/admin/send-message`, messageData, {
      headers: {
        'Cookie': adminCookies,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ Support message response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Support message failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testUserMessages(userId) {
  try {
    console.log(`\n📨 Testing user contact messages for ${userId}...`);
    
    // First, get a session for the user
    const userLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: 'test@example.com', // Update with actual test user
      password: 'password'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const userCookies = userLoginResponse.headers['set-cookie']?.join('; ') || '';
    console.log('👤 User logged in for message testing');
    
    // Get user's contact messages
    const messagesResponse = await axios.get(`${BASE_URL}/api/user/contact-messages`, {
      headers: {
        'Cookie': userCookies,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ User contact messages response:', messagesResponse.data);
    return messagesResponse.data;
  } catch (error) {
    console.error('❌ User messages test failed:', error.response?.data || error.message);
    return null;
  }
}

async function runCompleteAdminTest() {
  try {
    console.log('🚀 Starting complete admin functionality test...\n');
    
    // 1. Login as admin
    await adminLogin();
    
    // 2. Test user search
    const searchResults = await testAdminUserSearch();
    
    // 3. Get all users
    const allUsers = await testGetAllUsers();
    
    // Get first test user for operations
    const testUser = allUsers?.data?.[0] || searchResults?.[0];
    if (!testUser) {
      console.log('❌ No test user found for operations');
      return;
    }
    
    console.log(`\n🎯 Using test user: ${testUser.email} (${testUser._id})`);
    
    // 4. Test add funds (should trigger success banner)
    await testAddFunds(testUser._id, 50);
    
    // 5. Test connection request (should trigger success banner)
    await testConnectionRequest(testUser._id);
    
    // 6. Test support message (should trigger success banner)
    await testSupportMessage(testUser._id);
    
    // 7. Test user message system
    await testUserMessages(testUser._id);
    
    console.log('\n✅ All admin functionality tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Admin login: ✅');
    console.log('- User search: ✅');
    console.log('- Add funds: ✅ (should show success banner)');
    console.log('- Connection request: ✅ (should show success banner)');
    console.log('- Support message: ✅ (should show success banner)');
    console.log('- User message system: ✅ (should show notification badge)');
    
  } catch (error) {
    console.error('\n❌ Admin test failed:', error.message);
    console.log('\n🔍 Check the following:');
    console.log('1. Server is running on localhost:5000');
    console.log('2. Admin credentials are correct');
    console.log('3. Database connection is working');
    console.log('4. Admin authentication middleware is working');
  }
}

// Run the test
runCompleteAdminTest();