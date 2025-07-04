import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/';

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@nedaxer.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
      uid: '0000000001',
      username: 'admin',
      email: 'admin@nedaxer.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      isAdmin: true,
      kycStatus: 'verified',
      profilePicture: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created with ID:', result.insertedId);
    console.log('Admin Email: admin@nedaxer.com');
    console.log('Admin Password: admin123');
    console.log('Admin UID: 0000000001');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser().catch(console.error);