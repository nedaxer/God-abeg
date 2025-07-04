#!/usr/bin/env tsx

import { MongoClient, ObjectId } from 'mongodb';
import { generateUID } from '../server/utils/uid';

async function fixCurrentUserUID() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Get the current logged-in user from session (685c46d9b3dc40aeae0ed7fa)
    const currentUser = await usersCollection.findOne({ 
      _id: new ObjectId('685c46d9b3dc40aeae0ed7fa') 
    });
    
    if (currentUser) {
      console.log('Found current user:');
      console.log('Current UID:', currentUser.uid);
      console.log('UID format is numeric:', /^[0-9]{10}$/.test(currentUser.uid || ''));
      
      if (!/^[0-9]{10}$/.test(currentUser.uid || '')) {
        console.log('User has old UID format, updating to numeric...');
        
        // Generate new numeric UID
        let newUID;
        do {
          newUID = generateUID();
          // Check if this UID already exists
          const existingUser = await usersCollection.findOne({ uid: newUID });
          if (!existingUser) break;
        } while (true);
        
        // Update the user with new numeric UID
        const result = await usersCollection.updateOne(
          { _id: currentUser._id },
          { 
            $set: { 
              uid: newUID,
              updatedAt: new Date()
            } 
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Updated user UID from "${currentUser.uid}" to "${newUID}"`);
          
          // Verify the update
          const updatedUser = await usersCollection.findOne({ 
            _id: currentUser._id 
          });
          
          console.log('Verification:');
          console.log('New UID:', updatedUser?.uid);
          console.log('Is numeric:', /^[0-9]{10}$/.test(updatedUser?.uid || ''));
          
        } else {
          console.log('❌ Failed to update user UID');
        }
      } else {
        console.log('✅ User already has numeric UID format');
      }
      
    } else {
      console.log('❌ Current session user not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

console.log('🔧 Fixing current user UID to numeric format...');
fixCurrentUserUID()
  .then(() => {
    console.log('Fix completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fix failed:', error);
    process.exit(1);
  });