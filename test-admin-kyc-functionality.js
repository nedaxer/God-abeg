// Test script to verify admin KYC functionality
const { MongoClient } = require('mongodb');

async function testAdminKycFunctionality() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Check for pending KYC users
    const pendingUsers = await usersCollection.find({
      kycStatus: { $in: ['pending', 'submitted'] }
    }).toArray();
    
    console.log(`📋 Found ${pendingUsers.length} pending KYC users`);
    
    if (pendingUsers.length > 0) {
      const testUser = pendingUsers[0];
      console.log('🧪 Testing KYC approval with user:', {
        id: testUser._id.toString(),
        email: testUser.email,
        status: testUser.kycStatus
      });
      
      // Test admin login and KYC approval
      const adminLoginResponse = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@nedaxer.com',
          password: 'SMART456'
        })
      });
      
      if (adminLoginResponse.ok) {
        // Extract cookies from login response
        const setCookieHeader = adminLoginResponse.headers.get('set-cookie');
        console.log('✅ Admin login successful');
        
        // Test KYC approval
        const kycApprovalResponse = await fetch('http://localhost:5000/api/admin/approve-kyc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': setCookieHeader || ''
          },
          body: JSON.stringify({
            userId: testUser._id.toString(),
            status: 'verified'
          })
        });
        
        const kycResult = await kycApprovalResponse.json();
        console.log('🎯 KYC approval result:', kycResult);
        
        if (kycResult.success) {
          console.log('✅ KYC approval working correctly!');
          
          // Check if user status was updated
          const updatedUser = await usersCollection.findOne({ _id: testUser._id });
          console.log('📊 Updated user status:', updatedUser.kycStatus);
        } else {
          console.log('❌ KYC approval failed:', kycResult.message);
        }
        
      } else {
        console.log('❌ Admin login failed');
      }
    } else {
      console.log('📝 Creating test pending user for KYC testing...');
      
      // Create a test user with pending KYC
      const testUser = await usersCollection.insertOne({
        uid: '1234567890',
        email: 'testkyc@example.com',
        username: 'testkyc',
        passwordHash: 'dummy_hash',
        kycStatus: 'pending',
        kycData: {
          dateOfBirth: { day: 1, month: 1, year: 1990 },
          sourceOfIncome: 'Employment',
          documentType: 'driving_license',
          documents: {
            front: 'test_base64_data',
            back: 'test_base64_data'
          }
        },
        isVerified: false,
        isAdmin: false,
        createdAt: new Date()
      });
      
      console.log('✅ Created test user with ID:', testUser.insertedId.toString());
      console.log('🔄 Run the test again to verify KYC approval functionality');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await client.close();
  }
}

testAdminKycFunctionality();