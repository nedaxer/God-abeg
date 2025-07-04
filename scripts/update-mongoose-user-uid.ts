#!/usr/bin/env tsx

import mongoose from 'mongoose';
import { generateUID } from '../server/utils/uid';

// Define the User schema to match the current implementation
const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  profilePicture: String,
  favorites: [String],
  preferences: {
    lastSelectedPair: String,
    lastSelectedCrypto: String,
    lastSelectedTab: String
  },
  verificationCode: String,
  verificationExpiry: Date,
  resetPasswordCode: String,
  resetPasswordExpiry: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function updateMongooseUserUID() {
  try {
    // Connect to MongoDB using the same connection string
    await mongoose.connect('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/?retryWrites=true&w=majority&appName=Nedaxer');
    console.log('Connected to MongoDB Atlas via Mongoose');
    
    // Find the user with session ID 685c46d9b3dc40aeae0ed7fa
    const user = await User.findById('685c46d9b3dc40aeae0ed7fa');
    
    if (user) {
      console.log('Found current session user:');
      console.log('Current UID:', user.uid);
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      
      // Check if UID needs to be updated to numeric format
      if (!/^[0-9]{10}$/.test(user.uid || '')) {
        console.log('User has old UID format, updating to numeric...');
        
        // Generate new numeric UID and ensure it's unique
        let newUID;
        do {
          newUID = generateUID();
          const existingUser = await User.findOne({ uid: newUID });
          if (!existingUser) break;
        } while (true);
        
        // Update the user with new numeric UID
        user.uid = newUID;
        user.updatedAt = new Date();
        
        const savedUser = await user.save();
        
        console.log(`✅ Updated user UID from old format to "${newUID}"`);
        console.log('Updated user data:');
        console.log('- New UID:', savedUser.uid);
        console.log('- Is numeric:', /^[0-9]{10}$/.test(savedUser.uid));
        console.log('- Length:', savedUser.uid.length);
        
      } else {
        console.log('✅ User already has numeric UID format');
      }
      
    } else {
      console.log('❌ Session user not found in Mongoose User collection');
      
      // List all users to see what's available
      const allUsers = await User.find({}, { uid: 1, username: 1, email: 1 });
      console.log('\nAll users in Mongoose User collection:');
      allUsers.forEach(u => {
        console.log(`- ID: ${u._id}, UID: ${u.uid}, User: ${u.username || u.email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

console.log('🔧 Updating Mongoose user UID to numeric format...');
updateMongooseUserUID()
  .then(() => {
    console.log('Update completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Update failed:', error);
    process.exit(1);
  });