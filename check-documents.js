import { MongoClient } from 'mongodb';

async function checkDocuments() {
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
    
    // Find the pending user and check documents
    const user = await users.findOne({ kycStatus: 'pending' });
    
    if (user) {
      console.log('User found:', user.email);
      console.log('Has kycData:', !!user.kycData);
      console.log('Has documents:', !!user.kycData?.documents);
      
      if (user.kycData?.documents) {
        console.log('Documents object:', typeof user.kycData.documents);
        console.log('Document keys:', Object.keys(user.kycData.documents));
        console.log('Front exists:', !!user.kycData.documents.front);
        console.log('Back exists:', !!user.kycData.documents.back);
        console.log('Single exists:', !!user.kycData.documents.single);
        
        if (user.kycData.documents.front) {
          console.log('Front length:', user.kycData.documents.front.length);
        }
        if (user.kycData.documents.back) {
          console.log('Back length:', user.kycData.documents.back.length);
        }
        if (user.kycData.documents.single) {
          console.log('Single length:', user.kycData.documents.single.length);
        }
      }
    } else {
      console.log('No pending user found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDocuments().catch(console.error);