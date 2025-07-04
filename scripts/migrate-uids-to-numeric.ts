#!/usr/bin/env tsx

import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

// Generate a numeric UID (10 digits)
function generateNumericUID(): string {
  // Generate a 10-digit number
  let result = '';
  
  // First digit should not be 0 to ensure it's always 10 digits
  result += Math.floor(Math.random() * 9) + 1;
  
  // Generate remaining 9 digits
  for (let i = 0; i < 9; i++) {
    result += Math.floor(Math.random() * 10);
  }
  
  return result;
}

async function migrateUIDsToNumeric() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    
    // Find all users with non-numeric UIDs
    const usersWithOldUIDs = await usersCollection.find({
      uid: { $not: /^[0-9]{10}$/ }
    }).toArray();
    
    console.log(`Found ${usersWithOldUIDs.length} users with old UID format`);
    
    if (usersWithOldUIDs.length === 0) {
      console.log('All users already have numeric UIDs');
      return;
    }
    
    // Track generated UIDs to ensure uniqueness
    const existingUIDs = new Set();
    
    // Get all existing numeric UIDs
    const usersWithNumericUIDs = await usersCollection.find({
      uid: /^[0-9]{10}$/
    }).toArray();
    
    usersWithNumericUIDs.forEach(user => {
      existingUIDs.add(user.uid);
    });
    
    let updatedCount = 0;
    
    for (const user of usersWithOldUIDs) {
      let newUID: string;
      
      // Generate unique numeric UID
      do {
        newUID = generateNumericUID();
      } while (existingUIDs.has(newUID));
      
      existingUIDs.add(newUID);
      
      // Update user with new numeric UID
      const result = await usersCollection.updateOne(
        { _id: user._id },
        { $set: { uid: newUID, updatedAt: new Date() } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Updated user ${user.username || user.email} from UID "${user.uid}" to "${newUID}"`);
        updatedCount++;
      } else {
        console.error(`Failed to update user ${user.username || user.email}`);
      }
    }
    
    console.log(`\n✅ Migration completed successfully!`);
    console.log(`Updated ${updatedCount} users to numeric UID format`);
    
    // Verify the migration
    const remainingOldUIDs = await usersCollection.countDocuments({
      uid: { $not: /^[0-9]{10}$/ }
    });
    
    if (remainingOldUIDs === 0) {
      console.log('✅ All users now have numeric UIDs');
    } else {
      console.warn(`⚠️  ${remainingOldUIDs} users still have non-numeric UIDs`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
console.log('🚀 Starting UID migration to numeric format...');
console.log('This will convert all existing UIDs to 10-digit numeric format (e.g., 4286363824)');
console.log('');

migrateUIDsToNumeric()
  .then(() => {
    console.log('Migration process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });