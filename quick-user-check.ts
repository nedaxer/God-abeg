import { connectToDatabase, getMongoClient } from './server/mongodb';
import bcrypt from 'bcrypt';
import fs from 'fs';

async function quickUserCheck() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    console.log(`📊 Found ${users.length} users in database`);

    if (users.length > 0) {
      // Create backup
      const backupData = {
        timestamp: new Date().toISOString(),
        totalUsers: users.length,
        users: users.map(user => ({
          _id: user._id.toString(),
          uid: user.uid,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin,
          actualPassword: user.actualPassword,
          kycStatus: user.kycStatus,
          transferAccess: user.transferAccess,
          withdrawalAccess: user.withdrawalAccess,
          createdAt: user.createdAt
        }))
      };

      const backupFile = `user-backup-${Date.now()}.json`;
      fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
      console.log(`✅ Backup saved to: ${backupFile}`);

      // Display users
      console.log('\n👥 Existing Users:');
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        console.log(`${i + 1}. ${user.username} (${user.email})`);
        console.log(`   UID: ${user.uid}`);
        console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
        console.log(`   Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
        if (user.actualPassword) {
          console.log(`   Password: ${user.actualPassword}`);
        }
        console.log('');
      }

      // Test login for each user
      console.log('🔐 Testing login for existing users...');
      for (const user of users) {
        console.log(`\nTesting: ${user.email}`);
        
        if (user.actualPassword) {
          const isValid = await bcrypt.compare(user.actualPassword, user.password);
          console.log(`  Password "${user.actualPassword}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        } else {
          // Try common passwords
          const testPasswords = ['password', 'password123', '123456', user.username];
          let found = false;
          for (const pwd of testPasswords) {
            const isValid = await bcrypt.compare(pwd, user.password);
            if (isValid) {
              console.log(`  Password "${pwd}": ✅ VALID`);
              found = true;
              break;
            }
          }
          if (!found) {
            console.log(`  ❌ No common password works`);
          }
        }
      }
    } else {
      console.log('No users found in database');
    }

    // Check balances
    const balances = await db.collection('userbalances').find({}).toArray();
    console.log(`\n💰 Found ${balances.length} balance records`);

    // Check currencies
    const currencies = await db.collection('currencies').find({}).toArray();
    console.log(`💱 Found ${currencies.length} currencies`);

    console.log('\n✅ User check completed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

quickUserCheck();