// Script to update a user's KYC status for testing admin approval system
import { MongoClient } from 'mongodb';

async function updateUserKycStatus() {
  // Connect to the in-memory MongoDB database used by the application
  const client = new MongoClient('mongodb://localhost:27017/test');
  
  try {
    await client.connect();
    console.log('🔗 Connected to in-memory MongoDB');
    
    const db = client.db('test');
    const usersCollection = db.collection('users');
    
    // Find the test user
    const testUser = await usersCollection.findOne({ username: 'testuser' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('📋 Found test user:', {
      id: testUser._id.toString(),
      username: testUser.username,
      email: testUser.email,
      currentKycStatus: testUser.kycStatus || 'none'
    });
    
    // Update the user to have pending KYC status with test documents
    const updateResult = await usersCollection.updateOne(
      { _id: testUser._id },
      {
        $set: {
          kycStatus: 'pending',
          kycData: {
            dateOfBirth: { day: 15, month: 6, year: 1990 },
            sourceOfIncome: 'Employment',
            documentType: 'driving_license',
            documents: {
              front: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
              back: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
            }
          },
          kycSubmittedAt: new Date()
        }
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log('✅ Successfully updated user KYC status to pending');
      
      // Verify the update
      const updatedUser = await usersCollection.findOne({ _id: testUser._id });
      console.log('📊 Updated user KYC status:', updatedUser.kycStatus);
      console.log('📄 KYC data added:', !!updatedUser.kycData);
    } else {
      console.log('❌ Failed to update user KYC status');
    }
    
  } catch (error) {
    console.error('❌ Error updating user KYC status:', error);
  } finally {
    await client.close();
  }
}

updateUserKycStatus();