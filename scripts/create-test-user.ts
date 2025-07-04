import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

async function createTestUser() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: 'robinstephen003@outlook.com' });
    if (existingUser) {
      console.log('User robinstephen003@outlook.com already exists');
      return;
    }
    
    // Generate UID
    function generateUID(): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create test user
    const testUser = {
      uid: generateUID(),
      username: 'robinstephen003',
      email: 'robinstephen003@outlook.com',
      password: hashedPassword,
      firstName: 'Robin',
      lastName: 'Stephen',
      isVerified: true,
      isAdmin: false,
      profilePicture: null,
      preferences: {
        lastSelectedPair: 'BTCUSDT',
        lastSelectedCrypto: 'bitcoin',
        lastSelectedTab: 'spot'
      },
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(testUser);
    console.log('Test user created:', result.insertedId);
    
    // Create USD balance for the user
    const balance = {
      userId: result.insertedId.toString(),
      currency: 'USD',
      amount: 0.00,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('userBalances').insertOne(balance);
    console.log('USD balance created for user');
    
    console.log('Test user robinstephen003@outlook.com created successfully!');
    console.log('Email: robinstephen003@outlook.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.close();
  }
}

createTestUser();