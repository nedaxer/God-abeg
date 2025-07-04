#!/usr/bin/env tsx

import { MongoClient, ObjectId } from 'mongodb';

async function fixSessionUserId() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Get the Robin user (which seems to be the one being used)
    const robinUser = await usersCollection.findOne({ 
      email: 'robinstephen003@outlook.com' 
    });
    
    if (robinUser) {
      console.log('Robin user found with correct numeric UID:');
      console.log('_id:', robinUser._id);
      console.log('uid:', robinUser.uid);
      console.log('username:', robinUser.username);
      console.log('email:', robinUser.email);
      console.log('firstName:', robinUser.firstName);
      console.log('lastName:', robinUser.lastName);
      
      // Create the exact user data structure that should be returned by the API
      const userData = {
        _id: robinUser._id,
        uid: robinUser.uid,
        username: robinUser.username,
        email: robinUser.email,
        firstName: robinUser.firstName,
        lastName: robinUser.lastName,
        profilePicture: robinUser.profilePicture || null,
        favorites: robinUser.favorites || [],
        preferences: robinUser.preferences,
        isVerified: robinUser.isVerified,
        isAdmin: robinUser.isAdmin,
        createdAt: robinUser.createdAt
      };
      
      console.log('\nCorrect user data structure for frontend:');
      console.log(JSON.stringify(userData, null, 2));
      
      console.log(`\n✅ This user should display UID: ${robinUser.uid} in profile and settings`);
      
    } else {
      console.log('❌ Robin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('🔧 Checking correct user data for UID display...');
fixSessionUserId()
  .then(() => {
    console.log('Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Check failed:', error);
    process.exit(1);
  });