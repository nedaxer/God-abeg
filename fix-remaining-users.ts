import { connectToDatabase, getMongoClient } from './server/mongodb';
import bcrypt from 'bcrypt';

async function fixRemainingUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Fix the remaining users without passwords
    const remainingUsersToFix = [
      { email: 'pending.kyc@test.com', password: 'password123' },
      { email: 'verified.user@test.com', password: 'password123' },
      { email: 'test@example.com', password: 'password' }
    ];

    console.log('🔐 Fixing remaining users without working passwords...');
    
    for (const userFix of remainingUsersToFix) {
      const user = await db.collection('users').findOne({ email: userFix.email });
      if (user) {
        console.log(`Updating password for: ${userFix.email}`);
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(userFix.password, 10);
        
        // Update the user
        await db.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { 
              password: hashedPassword,
              actualPassword: userFix.password
            }
          }
        );
        
        console.log(`✅ Password updated for ${userFix.email} -> ${userFix.password}`);
      }
    }

    // Test login for all users now
    console.log('\n🧪 Final login test for ALL users...');
    const allUsers = await db.collection('users').find({}).toArray();
    
    for (const user of allUsers) {
      if (user.actualPassword) {
        const isValid = await bcrypt.compare(user.actualPassword, user.password);
        console.log(`${user.email} (${user.actualPassword}): ${isValid ? '✅ WORKING' : '❌ BROKEN'}`);
      } else {
        console.log(`${user.email}: ❌ NO PASSWORD SET`);
      }
    }

    console.log('\n📋 COMPLETE USER LOGIN CREDENTIALS LIST:');
    console.log('===============================================');
    
    const finalUsers = await db.collection('users').find({}).toArray();
    for (const user of finalUsers) {
      if (user.actualPassword) {
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${user.actualPassword}`);
        console.log(`Role: ${user.isAdmin ? 'ADMIN' : 'USER'}`);
        console.log(`Status: ${user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`);
        console.log('---');
      }
    }

    console.log('\n✅ ALL USERS NOW HAVE WORKING LOGIN CREDENTIALS!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

fixRemainingUsers();