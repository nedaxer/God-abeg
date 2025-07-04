
const mongoose = require('mongoose');

// MongoDB User Schema (matching your server/models/User.ts)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  verificationCode: { type: String, default: null },
  verificationCodeExpires: { type: Date, default: null },
  resetPasswordCode: { type: String, default: null },
  resetPasswordCodeExpires: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function verifyUserMongo(userId) {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nedaxer_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`❌ User with ID ${userId} not found`);
      return false;
    }

    // Check if already verified
    if (user.isVerified) {
      console.log(`✅ User ${user.username} (ID: ${userId}) is already verified`);
      return true;
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    console.log(`✅ Successfully verified user ${user.username} (ID: ${userId})`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    
    return true;

  } catch (error) {
    console.error('❌ Error verifying user:', error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

// Get user ID from command line arguments
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: node scripts/verify-user-mongo.js <USER_ID>');
  console.log('Example: node scripts/verify-user-mongo.js 672661763');
  process.exit(1);
}

// Run verification
verifyUserMongo(userId).then((success) => {
  process.exit(success ? 0 : 1);
});
