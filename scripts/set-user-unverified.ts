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

async function setUserUnverified(userId: string) {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/nedaxer_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`❌ User with ID ${userId} not found`);
      return false;
    }

    // Set user as unverified
    user.isVerified = false;
    await user.save();

    console.log(`✅ Successfully set user ${user.username} (ID: ${userId}) as unverified`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Verification Status: ${user.isVerified}`);
    
    return true;

  } catch (error) {
    console.error('❌ Error setting user as unverified:', error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: tsx scripts/set-user-unverified.ts <USER_ID>');
  console.log('Example: tsx scripts/set-user-unverified.ts 685bdf95034a966dd56b573c');
  process.exit(1);
}

// Run the function
setUserUnverified(userId).then((success) => {
  process.exit(success ? 0 : 1);
});