import { connectToDatabase, getMongoClient } from './server/mongodb';
import { mongoStorage } from './server/mongoStorage';

async function debugUserLookup() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectToDatabase();
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Direct database lookup
    console.log('\n🔍 Direct database user lookup:');
    const directUsers = await db.collection('users').find({}).toArray();
    console.log(`Found ${directUsers.length} users in database`);
    
    directUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.username})`);
    });

    // Test mongoStorage lookups
    console.log('\n🧪 Testing mongoStorage lookups:');
    
    const testEmails = [
      'robinstephen003@outlook.com',
      'test@example.com',
      'admin@nedaxer.com',
      'Nedaxer.us@gmail.com'
    ];

    for (const email of testEmails) {
      console.log(`\nTesting email: ${email}`);
      
      try {
        const userByEmail = await mongoStorage.getUserByEmail(email);
        console.log(`  getUserByEmail: ${userByEmail ? 'FOUND' : 'NOT FOUND'}`);
        if (userByEmail) {
          console.log(`    ID: ${userByEmail._id}`);
          console.log(`    Username: ${userByEmail.username}`);
        }
        
        const userByUsername = await mongoStorage.getUserByUsername(email);
        console.log(`  getUserByUsername: ${userByUsername ? 'FOUND' : 'NOT FOUND'}`);
        if (userByUsername) {
          console.log(`    ID: ${userByUsername._id}`);
          console.log(`    Email: ${userByUsername.email}`);
        }
      } catch (error) {
        console.log(`  ERROR: ${error.message}`);
      }
    }

    // Check exact login logic
    console.log('\n🔐 Simulating exact login logic:');
    const testLogin = async (username: string, password: string) => {
      console.log(`\nTesting login: ${username}`);
      
      try {
        // Exact same logic as routes.mongo.ts
        let user = await mongoStorage.getUserByUsername(username);
        if (!user) {
          user = await mongoStorage.getUserByEmail(username);
        }

        if (!user) {
          console.log('  ❌ User not found');
          return;
        }

        console.log('  ✅ User found');
        console.log(`    ID: ${user._id}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Username: ${user.username}`);
        console.log(`    Verified: ${user.isVerified}`);
        console.log(`    Admin: ${user.isAdmin}`);
        
        // Test password (if actualPassword exists)
        if (user.actualPassword) {
          const bcrypt = require('bcrypt');
          const passwordValid = await bcrypt.compare(password, user.password);
          console.log(`    Password "${password}": ${passwordValid ? '✅ VALID' : '❌ INVALID'}`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    };

    await testLogin('robinstephen003@outlook.com', 'testpass123');
    await testLogin('test@example.com', 'password');
    await testLogin('admin@nedaxer.com', 'admin123');

    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    process.exit(0);
  }
}

debugUserLookup();