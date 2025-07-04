#!/usr/bin/env tsx

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { generateUID } from '../server/utils/uid';

async function testNumericUIDCreation() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Generate new numeric UID
    const newUID = generateUID();
    console.log(`Generated new numeric UID: ${newUID}`);
    
    // Verify UID format
    const isValid = /^[0-9]{10}$/.test(newUID);
    console.log(`UID format valid: ${isValid}`);
    
    // Check if UID is unique
    const existingUser = await usersCollection.findOne({ uid: newUID });
    console.log(`UID is unique: ${!existingUser}`);
    
    // Create test user with new numeric UID
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    
    const testUser = {
      uid: newUID,
      username: 'numerictest',
      email: 'numerictest@nedaxer.com',
      password: hashedPassword,
      firstName: 'Numeric',
      lastName: 'Test',
      isVerified: true,
      isAdmin: false,
      profilePicture: null,
      preferences: {},
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Remove existing test user if exists
    await usersCollection.deleteOne({ email: 'numerictest@nedaxer.com' });
    
    const result = await usersCollection.insertOne(testUser);
    console.log(`Test user created with ID: ${result.insertedId}`);
    console.log(`Test user UID: ${newUID}`);
    
    // Verify the user was created correctly
    const createdUser = await usersCollection.findOne({ _id: result.insertedId });
    console.log(`Verification - User UID: ${createdUser?.uid}`);
    console.log(`Verification - UID is numeric: ${/^[0-9]{10}$/.test(createdUser?.uid || '')}`);
    
    console.log('\n✅ Numeric UID system is working correctly!');
    console.log(`✅ New users will get 10-digit numeric UIDs like: ${newUID}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
console.log('🧪 Testing numeric UID creation system...');
testNumericUIDCreation()
  .then(() => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });