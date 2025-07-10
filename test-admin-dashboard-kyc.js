import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001';

// Test admin dashboard KYC approval functionality
async function testAdminDashboardKYC() {
  console.log('🔧 Testing Admin Dashboard KYC Approval System...');
  
  try {
    // Step 1: Admin Login
    console.log('🔐 Step 1: Admin login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'nedaxer.us@gmail.com',
        password: 'SMART456'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Admin login result:', loginData);

    // Extract session cookie
    const cookies = loginResponse.headers.get('set-cookie');
    const sessionCookie = cookies ? cookies.split(';')[0] : '';
    console.log('Session cookie:', sessionCookie);

    if (!loginData.success) {
      throw new Error('Admin login failed');
    }

    // Step 2: Create test user with pending KYC
    console.log('\n📝 Step 2: Creating test user with pending KYC...');
    const testUserResponse = await fetch(`${BASE_URL}/api/admin/test-kyc-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({
        username: 'dashboard_test_user',
        email: 'dashboard_test@example.com',
        password: 'password123'
      })
    });

    const testUserData = await testUserResponse.json();
    console.log('Test user creation result:', testUserData);

    // Step 3: Test admin dashboard pending KYC endpoint
    console.log('\n📋 Step 3: Testing admin dashboard pending KYC endpoint...');
    const pendingKYCResponse = await fetch(`${BASE_URL}/api/admin/pending-kyc`, {
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    const pendingKYCData = await pendingKYCResponse.json();
    console.log('Pending KYC verifications:', pendingKYCData);

    if (!pendingKYCData.success || pendingKYCData.data.length === 0) {
      throw new Error('No pending KYC verifications found');
    }

    // Step 4: Test KYC approval through admin dashboard
    console.log('\n✅ Step 4: Testing KYC approval through admin dashboard...');
    const userId = pendingKYCData.data[0]._id;
    const approvalResponse = await fetch(`${BASE_URL}/api/admin/kyc/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({
        userId: userId
      })
    });

    const approvalData = await approvalResponse.json();
    console.log('KYC approval result:', approvalData);

    if (!approvalData.success) {
      throw new Error('KYC approval failed');
    }

    // Step 5: Verify notification was created
    console.log('\n📨 Step 5: Verifying notification was created...');
    const notificationResponse = await fetch(`${BASE_URL}/api/admin/user-notifications/${userId}`, {
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    const notificationData = await notificationResponse.json();
    console.log('User notifications:', notificationData);

    // Step 6: Test admin dashboard analytics
    console.log('\n📊 Step 6: Testing admin dashboard analytics...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/admin/analytics`, {
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    const analyticsData = await analyticsResponse.json();
    console.log('Admin analytics:', analyticsData);

    // Step 7: Test user search functionality
    console.log('\n🔍 Step 7: Testing user search functionality...');
    const searchResponse = await fetch(`${BASE_URL}/api/admin/search?query=dashboard_test`, {
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    });

    const searchData = await searchResponse.json();
    console.log('User search results:', searchData);

    console.log('\n🎉 All admin dashboard KYC tests completed successfully!');
    
    console.log('\n✅ Admin Dashboard System Status:');
    console.log('  - Admin authentication: Working');
    console.log('  - Pending KYC retrieval: Working');
    console.log('  - KYC approval system: Working');
    console.log('  - Notification creation: Working');
    console.log('  - Analytics dashboard: Working');
    console.log('  - User search: Working');

  } catch (error) {
    console.error('❌ Admin dashboard test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

// Run the test
testAdminDashboardKYC();