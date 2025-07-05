import { MongoClient } from 'mongodb';

async function debugKycStatus() {
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
    
    // Check all users and their KYC status
    const allUsers = await users.find({}).project({
      email: 1,
      kycStatus: 1,
      kycData: 1
    }).toArray();
    
    console.log('\n=== ALL USERS KYC STATUS ===');
    allUsers.forEach(user => {
      console.log(`User: ${user.email}`);
      console.log(`KYC Status: ${user.kycStatus || 'none'}`);
      console.log(`Has KYC Data: ${!!user.kycData}`);
      if (user.kycData?.documents) {
        console.log(`Documents: front=${!!user.kycData.documents.front}, back=${!!user.kycData.documents.back}, single=${!!user.kycData.documents.single}`);
      }
      console.log('---');
    });
    
    // Specifically look for pending users
    const pendingUsers = await users.find({ 
      kycStatus: { $in: ['pending', 'submitted'] }
    }).toArray();
    
    console.log('\n=== PENDING KYC USERS ===');
    console.log(`Found ${pendingUsers.length} pending KYC users`);
    
    pendingUsers.forEach(user => {
      console.log(`\nPending User: ${user.email}`);
      console.log(`UID: ${user.uid}`);
      console.log(`KYC Status: ${user.kycStatus}`);
      console.log(`KYC Data exists: ${!!user.kycData}`);
      
      if (user.kycData) {
        console.log(`Document Type: ${user.kycData.documentType || 'Not specified'}`);
        console.log(`Source of Income: ${user.kycData.sourceOfIncome || 'Not specified'}`);
        
        if (user.kycData.documents) {
          console.log('Documents object exists');
          console.log(`Front document: ${user.kycData.documents.front ? 'YES (' + user.kycData.documents.front.length + ' chars)' : 'NO'}`);
          console.log(`Back document: ${user.kycData.documents.back ? 'YES (' + user.kycData.documents.back.length + ' chars)' : 'NO'}`);
          console.log(`Single document: ${user.kycData.documents.single ? 'YES (' + user.kycData.documents.single.length + ' chars)' : 'NO'}`);
        } else {
          console.log('No documents object found');
        }
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugKycStatus();