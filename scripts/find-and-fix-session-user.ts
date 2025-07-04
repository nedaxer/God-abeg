#!/usr/bin/env tsx

import { MongoClient, ObjectId } from 'mongodb';
import { generateUID } from '../server/utils/uid';

async function findAndFixSessionUser() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    
    // Check all collections for the session user ID
    const collections = ['users', 'user'];
    let foundUser = null;
    let foundCollection = null;
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const user = await collection.findOne({ 
          _id: new ObjectId('685c46d9b3dc40aeae0ed7fa') 
        });
        
        if (user) {
          console.log(`Found user in "${collectionName}" collection:`);
          console.log('Current UID:', user.uid);
          console.log('Username:', user.username);
          console.log('Email:', user.email);
          foundUser = user;
          foundCollection = collection;
          break;
        }
      } catch (err) {
        console.log(`Collection "${collectionName}" doesn't exist or error:`, err.message);
      }
    }
    
    if (foundUser && foundCollection) {
      // Check if UID needs to be updated
      if (!/^[0-9]{10}$/.test(foundUser.uid || '')) {
        console.log('\nUser has old UID format, updating to numeric...');
        
        // Generate new numeric UID
        let newUID;
        do {
          newUID = generateUID();
          // Check if this UID already exists in any collection
          const existingUser = await foundCollection.findOne({ uid: newUID });
          if (!existingUser) break;
        } while (true);
        
        // Update the user with new numeric UID
        const result = await foundCollection.updateOne(
          { _id: foundUser._id },
          { 
            $set: { 
              uid: newUID,
              updatedAt: new Date()
            } 
          }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Updated user UID from "${foundUser.uid}" to "${newUID}"`);
          
          // Verify the update
          const updatedUser = await foundCollection.findOne({ 
            _id: foundUser._id 
          });
          
          console.log('\nVerification:');
          console.log('New UID:', updatedUser?.uid);
          console.log('Is numeric:', /^[0-9]{10}$/.test(updatedUser?.uid || ''));
          console.log('Length:', updatedUser?.uid?.length);
          
        } else {
          console.log('❌ Failed to update user UID');
        }
      } else {
        console.log('✅ User already has numeric UID format');
      }
    } else {
      console.log('❌ Session user not found in any collection');
      
      // List all collections to see what's available
      const allCollections = await db.listCollections().toArray();
      console.log('\nAvailable collections:');
      allCollections.forEach(col => console.log(`- ${col.name}`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('🔍 Finding and fixing session user UID...');
findAndFixSessionUser()
  .then(() => {
    console.log('Operation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Operation failed:', error);
    process.exit(1);
  });