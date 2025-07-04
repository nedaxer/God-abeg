import { MongoClient } from 'mongodb';

async function addDocsToSpecificUser() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('nedaxer');
    const users = db.collection('users');
    
    // Create a small test image (1x1 red pixel)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // Update the specific user that the API is returning
    const result = await users.updateOne(
      { 
        email: 'robinstephen040@outlook.com',
        uid: '2633378244'
      },
      {
        $set: {
          'kycData.documents': {
            front: testImageBase64,
            back: testImageBase64,
            single: testImageBase64
          }
        }
      }
    );
    
    console.log('Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully added test documents to robinstephen040@outlook.com');
      
      // Verify the update
      const updatedUser = await users.findOne({ email: 'robinstephen040@outlook.com' });
      console.log('Updated user has documents:', !!updatedUser.kycData?.documents);
      console.log('Documents:', {
        front: !!updatedUser.kycData?.documents?.front,
        back: !!updatedUser.kycData?.documents?.back,
        single: !!updatedUser.kycData?.documents?.single
      });
    } else {
      console.log('❌ No user was updated');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

addDocsToSpecificUser().catch(console.error);