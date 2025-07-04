import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  profilePicture: { type: String, default: null },
  preferences: { type: Object, default: {} },
  favorites: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function checkUserVerification() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/nedaxer_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // List all collections first
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log('\n📁 Available collections:');
    collections?.forEach(col => console.log(`  - ${col.name}`));

    // Check the users collection
    const collection = mongoose.connection.db?.collection('users');
    const count = await collection?.countDocuments() || 0;
    console.log(`\n📋 Found ${count} documents in users collection`);
    
    if (count > 0) {
      const users = await collection?.find({}).toArray();
      
      users?.forEach(user => {
        console.log(`ID: ${user._id}`);
        console.log(`UID: ${user.uid || 'N/A'}`);
        console.log(`Email: ${user.email || 'N/A'}`);
        console.log(`Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
        console.log(`Verified: ${user.isVerified ? '✅ YES' : '❌ NO'}`);
        console.log(`Admin: ${user.isAdmin ? '👑 YES' : '👤 NO'}`);
        console.log('-'.repeat(80));
      });
    } else {
      console.log('No users found in the database');
      
      // Check if there are any documents at all
      const allCollections = await mongoose.connection.db?.listCollections().toArray();
      console.log('\nChecking all collections for data:');
      
      for (const col of allCollections || []) {
        const docCount = await mongoose.connection.db?.collection(col.name).countDocuments() || 0;
        console.log(`  ${col.name}: ${docCount} documents`);
        
        if (docCount > 0 && col.name !== 'users') {
          const sampleDoc = await mongoose.connection.db?.collection(col.name).findOne();
          console.log(`    Sample document:`, JSON.stringify(sampleDoc, null, 2));
        }
      }
    }
    
    return true;

  } catch (error) {
    console.error('❌ Error checking user verification:', error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

// Run the function
checkUserVerification().then((success) => {
  process.exit(success ? 0 : 1);
});