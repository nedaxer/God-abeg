#!/usr/bin/env tsx

import { MongoClient, ObjectId } from 'mongodb';

async function debugCurrentSession() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Get the user from the session logs (685c46d9b3dc40aeae0ed7fa)
    const user = await usersCollection.findOne({ 
      _id: new ObjectId('685c46d9b3dc40aeae0ed7fa') 
    });
    
    if (!user) {
      console.log('❌ User not found with session ID: 685c46d9b3dc40aeae0ed7fa');
      console.log('Let me check all users in the database:');
      
      const allUsers = await usersCollection.find({}, { 
        projection: { 
          _id: 1, 
          uid: 1, 
          username: 1, 
          email: 1 
        } 
      }).toArray();
      
      console.log('\nAll users in database:');
      allUsers.forEach(u => {
        console.log(`- ID: ${u._id}, UID: ${u.uid}, User: ${u.username || u.email}`);
      });
      
      // Check if there's a user with matching email from the logs
      const robinUser = await usersCollection.findOne({ 
        email: 'robinstephen003@outlook.com' 
      });
      
      if (robinUser) {
        console.log('\nFound Robin user - this might be the correct one:');
        console.log('_id:', robinUser._id);
        console.log('uid:', robinUser.uid);
        console.log('username:', robinUser.username);
        console.log('email:', robinUser.email);
      }
      
      return;
    }
    
    if (user) {
      console.log('Current session user data:');
      console.log('=================================');
      console.log('_id:', user._id);
      console.log('uid:', user.uid);
      console.log('username:', user.username);
      console.log('email:', user.email);
      console.log('firstName:', user.firstName);
      console.log('lastName:', user.lastName);
      console.log('isAdmin:', user.isAdmin);
      console.log('isVerified:', user.isVerified);
      console.log('=================================');
      
      // Check UID specifically
      if (user.uid) {
        console.log(`✅ UID exists: "${user.uid}"`);
        console.log(`✅ UID type: ${typeof user.uid}`);
        console.log(`✅ UID is numeric: ${/^[0-9]{10}$/.test(user.uid)}`);
        console.log(`✅ UID length: ${user.uid.length}`);
      } else {
        console.log('❌ UID field is missing, null, or undefined');
        console.log('Raw UID value:', user.uid);
      }
      
      // Simulate the exact data structure returned by /api/auth/user
      const userData = {
        _id: user._id,
        uid: user.uid,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture || null,
        favorites: user.favorites || [],
        preferences: user.preferences,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      };
      
      console.log('\nSimulated API response structure:');
      console.log(JSON.stringify(userData, null, 2));
      
    } else {
      console.log('❌ User not found with ID: 685c46d9b3dc40aeae0ed7fa');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

console.log('🔍 Debugging current session user data...');
debugCurrentSession()
  .then(() => {
    console.log('Debug completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Debug failed:', error);
    process.exit(1);
  });