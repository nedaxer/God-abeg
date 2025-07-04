#!/usr/bin/env tsx

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { generateUID } from '../server/utils/uid';

async function createTestUserForUID() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Delete existing test user if exists
    await usersCollection.deleteOne({ email: 'uidtest@nedaxer.com' });
    
    // Generate numeric UID
    const numericUID = generateUID();
    console.log(`Generated numeric UID: ${numericUID}`);
    
    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    // Create test user with known password and numeric UID
    const testUser = {
      uid: numericUID,
      username: 'uidtest',
      email: 'uidtest@nedaxer.com',
      password: hashedPassword,
      firstName: 'UID',
      lastName: 'Test',
      isVerified: true,
      isAdmin: false,
      profilePicture: null,
      preferences: {},
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(testUser);
    console.log('Created test user with ID:', result.insertedId);
    console.log('User credentials:');
    console.log('- Email: uidtest@nedaxer.com');
    console.log('- Password: test123');
    console.log('- UID:', numericUID);
    
    // Test login immediately
    console.log('\nTesting login...');
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'uidtest@nedaxer.com',
        password: 'test123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login successful');
      console.log('Login response UID:', loginData.user.uid);
      
      // Test auth endpoint
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        const authResponse = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          headers: {
            'Cookie': setCookieHeader
          }
        });
        
        const authData = await authResponse.json();
        console.log('Auth endpoint UID:', authData.uid);
        
        if (authData.uid === numericUID) {
          console.log('✅ UID correctly returned from auth endpoint');
        } else {
          console.log('❌ UID mismatch in auth endpoint');
        }
      }
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

createTestUserForUID()
  .then(() => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });