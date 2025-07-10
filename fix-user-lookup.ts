import { connectToDatabase, getMongoClient } from './server/mongodb';

async function fixUserLookup() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    console.log('🔍 Checking exact database records...');
    const allUsers = await db.collection('users').find({}).toArray();
    
    console.log('Database users:');
    allUsers.forEach(user => {
      console.log(`Email: "${user.email}" | Username: "${user.username}"`);
    });
    
    // Check specific problematic users
    const problemEmails = ['admin@nedaxer.com', 'Nedaxer.us@gmail.com'];
    
    for (const email of problemEmails) {
      console.log(`\n🔍 Searching for: "${email}"`);
      
      // Case-sensitive search
      const exactMatch = await db.collection('users').findOne({ email: email });
      console.log(`  Exact match: ${exactMatch ? 'FOUND' : 'NOT FOUND'}`);
      
      // Case-insensitive search
      const caseInsensitive = await db.collection('users').findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') } 
      });
      console.log(`  Case-insensitive: ${caseInsensitive ? 'FOUND' : 'NOT FOUND'}`);
      if (caseInsensitive) {
        console.log(`    Actual email in DB: "${caseInsensitive.email}"`);
      }
      
      // Search by username too
      const byUsername = await db.collection('users').findOne({ username: email });
      console.log(`  By username: ${byUsername ? 'FOUND' : 'NOT FOUND'}`);
    }

    // Fix the mongoStorage getUserByEmail and getUserByUsername functions
    console.log('\n🔧 Updating users to ensure consistent email format...');
    
    // Normalize email formats for problematic users
    const updates = [
      { currentEmail: 'admin@nedaxer.com', newEmail: 'admin@nedaxer.com' },
      { currentEmail: 'Nedaxer.us@gmail.com', newEmail: 'nedaxer.us@gmail.com' }
    ];
    
    for (const update of updates) {
      const user = await db.collection('users').findOne({
        $or: [
          { email: update.currentEmail },
          { email: update.newEmail },
          { username: update.currentEmail }
        ]
      });
      
      if (user) {
        console.log(`Updating user: ${user.email} -> ${update.newEmail}`);
        await db.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { 
              email: update.newEmail.toLowerCase(),
              username: user.username || update.newEmail.toLowerCase()
            }
          }
        );
        console.log(`✅ Updated user email to lowercase`);
      }
    }

    // Test again after updates
    console.log('\n🧪 Testing lookups after normalization...');
    const testEmails = ['admin@nedaxer.com', 'nedaxer.us@gmail.com'];
    
    for (const email of testEmails) {
      const user = await db.collection('users').findOne({ 
        email: email.toLowerCase() 
      });
      console.log(`${email}: ${user ? 'FOUND' : 'NOT FOUND'}`);
      if (user && user.actualPassword) {
        console.log(`  Password: ${user.actualPassword}`);
      }
    }

    console.log('\n✅ User lookup fix completed');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

fixUserLookup();