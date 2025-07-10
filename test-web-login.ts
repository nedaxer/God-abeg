import axios from 'axios';

async function testWebLogin() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🌐 Testing web login functionality...');
  
  // Test users with their credentials
  const testUsers = [
    { email: 'admin@nedaxer.com', password: 'SMART456', role: 'ADMIN (hardcoded)' },
    { email: 'admin@nedaxer.com', password: 'admin123', role: 'ADMIN (database)' },
    { email: 'Nedaxer.us@gmail.com', password: 'admin123', role: 'ADMIN' },
    { email: 'robinstephen003@outlook.com', password: 'testpass123', role: 'USER' },
    { email: 'testuser@nedaxer.com', password: 'test123', role: 'USER' },
    { email: 'test@example.com', password: 'password', role: 'USER' }
  ];

  for (const testUser of testUsers) {
    console.log(`\n🔐 Testing login: ${testUser.email} (${testUser.role})`);
    
    try {
      // Test login
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        username: testUser.email,
        password: testUser.password
      }, {
        timeout: 10000,
        withCredentials: true
      });

      if (loginResponse.data.success) {
        console.log(`✅ Login successful for ${testUser.email}`);
        console.log(`   User ID: ${loginResponse.data.user._id}`);
        console.log(`   Admin: ${loginResponse.data.user.isAdmin}`);
        console.log(`   Verified: ${loginResponse.data.user.isVerified}`);
        
        // Try to get user info with session
        try {
          const userResponse = await axios.get(`${baseURL}/api/auth/user`, {
            headers: {
              'Cookie': loginResponse.headers['set-cookie']?.[0] || ''
            },
            timeout: 5000
          });
          
          if (userResponse.data.success) {
            console.log(`✅ Session working - user authenticated`);
          } else {
            console.log(`❌ Session not working: ${userResponse.data.message}`);
          }
        } catch (sessionError) {
          console.log(`❌ Session test failed: ${sessionError.message}`);
        }
        
      } else {
        console.log(`❌ Login failed: ${loginResponse.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ Login error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.log(`❌ Network error: ${error.message}`);
      }
    }
  }

  // Test user registration
  console.log('\n📝 Testing user registration...');
  const newUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@nedaxer.com`,
    password: 'newpassword123',
    firstName: 'Test',
    lastName: 'User'
  };

  try {
    const registerResponse = await axios.post(`${baseURL}/api/auth/register`, newUser, {
      timeout: 10000
    });

    if (registerResponse.data.success) {
      console.log(`✅ Registration successful for ${newUser.email}`);
      console.log(`   Auto-login: ${registerResponse.data.message}`);
    } else {
      console.log(`❌ Registration failed: ${registerResponse.data.message}`);
    }
  } catch (regError) {
    if (regError.response) {
      console.log(`❌ Registration error: ${regError.response.status} - ${regError.response.data.message}`);
    } else {
      console.log(`❌ Registration network error: ${regError.message}`);
    }
  }

  console.log('\n✅ Web login testing completed');
}

testWebLogin().catch(console.error);