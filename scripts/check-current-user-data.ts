#!/usr/bin/env tsx

import { MongoClient } from 'mongodb';

async function checkCurrentUserData() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Get any user with numeric UID to check structure
    const user = await usersCollection.findOne({ uid: { $regex: /^[0-9]{10}$/ } });
    
    if (!user) {
      console.log('No users with numeric UIDs found');
      // Show any user to check structure
      const anyUser = await usersCollection.findOne({});
      if (anyUser) {
        console.log('Found user (checking structure):', {
          _id: anyUser._id,
          uid: anyUser.uid,
          username: anyUser.username,
          email: anyUser.email
        });
      }
      return;
    }
    
    console.log('Current user data structure:');
    console.log({
      _id: user._id,
      uid: user.uid,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      hasProfilePicture: !!user.profilePicture
    });
    
    // Check if UID exists and is numeric
    if (user.uid) {
      console.log(`✓ UID exists: ${user.uid}`);
      console.log(`✓ UID is numeric: ${/^[0-9]{10}$/.test(user.uid)}`);
      console.log(`✓ UID length: ${user.uid.length}`);
    } else {
      console.log('❌ UID field is missing or null');
    }
    
    // Show all users and their UIDs
    console.log('\nAll users and their UIDs:');
    const allUsers = await usersCollection.find({}, { 
      projection: { 
        _id: 1, 
        uid: 1, 
        username: 1, 
        email: 1 
      } 
    }).toArray();
    
    allUsers.forEach(u => {
      console.log(`- ${u.username || u.email}: UID=${u.uid} (${u._id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

console.log('🔍 Checking current user data structure...');
checkCurrentUserData()
  .then(() => {
    console.log('Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Check failed:', error);
    process.exit(1);
  });