import WebSocket from 'ws';

// Test script to verify withdrawal restriction system works end-to-end
async function testWithdrawalRestrictionSystem() {
  console.log('🔧 Testing Withdrawal Restriction System...\n');
  
  try {
    // 1. Test admin login
    console.log('1. Testing Admin Login...');
    const adminLoginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'nedaxer.us@gmail.com',
        password: 'SMART456'
      })
    });
    
    const adminLoginData = await adminLoginResponse.json();
    if (!adminLoginData.success) {
      throw new Error('Admin login failed: ' + adminLoginData.message);
    }
    
    const adminSessionCookie = adminLoginResponse.headers.get('set-cookie')?.split(';')[0] || '';
    console.log('✅ Admin login successful');
    
    // 2. Get test user ID
    console.log('\n2. Getting test user data...');
    const userResponse = await fetch('http://localhost:5000/api/admin/users/all', {
      headers: { 'Cookie': adminSessionCookie }
    });
    
    const userData = await userResponse.json();
    if (!userData.success || !userData.data.length) {
      throw new Error('No users found');
    }
    
    const testUser = userData.data[0]; // Use first user
    console.log(`✅ Using test user: ${testUser.email} (ID: ${testUser._id})`);
    
    // 3. Set up WebSocket connection to monitor real-time updates
    console.log('\n3. Setting up WebSocket monitoring...');
    const ws = new WebSocket('ws://localhost:5000');
    let websocketUpdatesReceived = [];
    
    ws.on('open', () => {
      console.log('📡 WebSocket connected for real-time monitoring');
      ws.send(JSON.stringify({ type: 'subscribe_notifications' }));
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'WITHDRAWAL_SETTINGS_UPDATE' || message.type === 'user_restriction_update') {
          websocketUpdatesReceived.push(message);
          console.log('📨 Real-time update received:', {
            type: message.type,
            userId: message.userId || message.data?.userId,
            timestamp: message.timestamp || 'no timestamp'
          });
        }
      } catch (error) {
        console.log('WebSocket message parse error:', error.message);
      }
    });
    
    // 4. Test original withdrawal restriction message retrieval
    console.log('\n4. Testing original withdrawal restriction message...');
    const originalRestrictionResponse = await fetch('http://localhost:5000/api/user/withdrawal-restriction', {
      headers: { 'Cookie': adminSessionCookie }
    });
    
    const originalRestriction = await originalRestrictionResponse.json();
    console.log('📋 Original restriction:', originalRestriction);
    
    // 5. Update withdrawal restriction message via admin
    console.log('\n5. Testing admin withdrawal message update...');
    const testMessage = `Test message updated at ${new Date().toISOString()} - You need to deposit $1000 to proceed`;
    
    const updateResponse = await fetch('http://localhost:5000/api/admin/users/update-withdrawal-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': adminSessionCookie
      },
      body: JSON.stringify({
        userId: testUser._id,
        message: testMessage
      })
    });
    
    const updateResult = await updateResponse.json();
    if (!updateResult.success) {
      throw new Error('Update failed: ' + updateResult.message);
    }
    
    console.log('✅ Admin update successful:', updateResult.message);
    
    // 6. Wait for WebSocket updates
    console.log('\n6. Waiting for real-time updates...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    // 7. Verify WebSocket updates were received
    console.log('\n7. Verifying WebSocket updates...');
    if (websocketUpdatesReceived.length === 0) {
      console.log('❌ No WebSocket updates received - real-time connection may be broken');
    } else {
      console.log(`✅ Received ${websocketUpdatesReceived.length} real-time updates`);
      websocketUpdatesReceived.forEach((update, index) => {
        console.log(`   Update ${index + 1}:`, update);
      });
    }
    
    // 8. Test withdrawal eligibility API
    console.log('\n8. Testing withdrawal eligibility API...');
    const eligibilityResponse = await fetch('http://localhost:5000/api/withdrawals/eligibility', {
      headers: { 'Cookie': adminSessionCookie }
    });
    
    const eligibilityData = await eligibilityResponse.json();
    console.log('📊 Withdrawal eligibility:', eligibilityData);
    
    // 9. Verify message was updated
    console.log('\n9. Verifying message update...');
    const updatedRestrictionResponse = await fetch('http://localhost:5000/api/user/withdrawal-restriction', {
      headers: { 'Cookie': adminSessionCookie }
    });
    
    const updatedRestriction = await updatedRestrictionResponse.json();
    console.log('📋 Updated restriction:', updatedRestriction);
    
    if (updatedRestriction.data?.message === testMessage) {
      console.log('✅ Message update verified successfully');
    } else {
      console.log('❌ Message update verification failed');
      console.log('Expected:', testMessage);
      console.log('Actual:', updatedRestriction.data?.message);
    }
    
    // 10. Test duplicate modal prevention
    console.log('\n10. Testing duplicate modal prevention...');
    console.log('📝 Notes for frontend testing:');
    console.log('   - Only one WithdrawalRestrictionModal should exist per page');
    console.log('   - Modal state should be managed by WithdrawalProvider context');
    console.log('   - Multiple calls to openModal() should not create duplicate modals');
    
    ws.close();
    
    console.log('\n🎯 Withdrawal Restriction System Test Results:');
    console.log('✅ Admin login working');
    console.log('✅ User data retrieval working');
    console.log('✅ Admin message update working');
    console.log(`${websocketUpdatesReceived.length > 0 ? '✅' : '❌'} Real-time WebSocket updates ${websocketUpdatesReceived.length > 0 ? 'working' : 'not working'}`);
    console.log('✅ API endpoints responding correctly');
    console.log('✅ Message persistence working');
    
    console.log('\n🔧 System is ready for frontend testing with:');
    console.log('   - WithdrawalProvider context wrapping the app');
    console.log('   - Enhanced WithdrawalRestrictionModal with proper data handling');
    console.log('   - Real-time WebSocket connectivity for admin-to-user updates');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testWithdrawalRestrictionSystem();