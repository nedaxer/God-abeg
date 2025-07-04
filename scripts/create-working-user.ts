import { connectToDatabase, getMongoClient } from '../server/mongodb';
import bcrypt from 'bcrypt';

async function createWorkingUser() {
  try {
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Delete existing user if exists
    await db.collection('users').deleteOne({ 
      email: 'testuser@nedaxer.com' 
    });
    
    // Create fresh user with correct structure
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const newUser = {
      uid: 'TEST123456',
      username: 'testuser@nedaxer.com',
      email: 'testuser@nedaxer.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
      isAdmin: false,
      preferences: {},
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userResult = await db.collection('users').insertOne(newUser);
    console.log('Created test user:', userResult.insertedId);
    
    // Create test notification for this user
    const notification = {
      userId: userResult.insertedId.toString(),
      type: 'deposit',
      title: 'Deposit Confirmed',
      message: `Dear valued Nedaxer trader,
Your deposit has been confirmed.
Deposit amount: 1000.00000000 USDT
Deposit address: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
Timestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)`,
      data: {
        transactionId: '685d4test123456789',
        cryptoSymbol: 'USDT',
        cryptoAmount: 1000,
        usdAmount: 1000,
        senderAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        chainType: 'TRC20',
        networkName: 'TRON Network'
      },
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const notificationResult = await db.collection('notifications').insertOne(notification);
    console.log('Created test notification:', notificationResult.insertedId);
    
    console.log('Test user created successfully!');
    console.log('Login with: testuser@nedaxer.com / test123');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createWorkingUser();