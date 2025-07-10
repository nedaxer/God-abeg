import { connectToDatabase, getMongoClient } from './server/mongodb';
import bcrypt from 'bcrypt';

async function fixUserAuthentication() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    console.log('🔧 Fixing user authentication issues...');

    // Get all users
    const users = await db.collection('users').find({}).toArray();
    console.log(`📊 Processing ${users.length} users`);

    // Fix passwords for users that don't have working ones
    const usersToFix = [
      { email: 'Nedaxer.us@gmail.com', password: 'admin123' },
      { email: 'numerictest@nedaxer.com', password: 'test123' },
      { email: 'uidtest@nedaxer.com', password: 'test123' },
      { email: 'testuser@nedaxer.com', password: 'test123' },
      { email: 'admin@nedaxer.com', password: 'admin123' },
      { email: 'kyctest@nedaxer.com', password: 'test123' },
      { email: 'test.kyc.user@nedaxer.com', password: 'test123' }
    ];

    console.log('\n🔐 Updating passwords for users without working passwords...');
    
    for (const userFix of usersToFix) {
      const user = users.find(u => u.email === userFix.email);
      if (user) {
        console.log(`Updating password for: ${userFix.email}`);
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(userFix.password, 10);
        
        // Update the user with new password hash and actualPassword
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

    // Verify all users now have working passwords
    console.log('\n🧪 Testing all user logins...');
    const updatedUsers = await db.collection('users').find({}).toArray();
    
    for (const user of updatedUsers) {
      console.log(`\nTesting: ${user.email}`);
      
      if (user.actualPassword) {
        const isValid = await bcrypt.compare(user.actualPassword, user.password);
        console.log(`  Password "${user.actualPassword}": ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      } else {
        console.log(`  ❌ No password set`);
      }
    }

    // Create a working summary for user reference
    console.log('\n📋 FINAL USER LOGIN CREDENTIALS:');
    console.log('==========================================');
    
    const finalUsers = await db.collection('users').find({}).toArray();
    for (const user of finalUsers) {
      if (user.actualPassword) {
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${user.actualPassword}`);
        console.log(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
        console.log(`Verified: ${user.isVerified ? 'Yes' : 'No'}`);
        console.log('---');
      }
    }
    
    console.log('\n🎯 Admin Login Credentials:');
    console.log('Email: admin@nedaxer.com');
    console.log('Password: SMART456 (hardcoded) OR admin123 (database)');
    console.log('');
    console.log('Email: Nedaxer.us@gmail.com');
    console.log('Password: admin123');

    // Ensure currencies and balances are set up
    console.log('\n💰 Checking balances...');
    const currencies = await db.collection('currencies').find({}).toArray();
    const usdCurrency = currencies.find(c => c.symbol === 'USD');
    
    if (usdCurrency) {
      console.log('USD currency found, checking user balances...');
      
      for (const user of finalUsers) {
        const existingBalance = await db.collection('userbalances').findOne({
          userId: user._id,
          currencyId: usdCurrency._id
        });
        
        if (!existingBalance) {
          console.log(`Creating USD balance for: ${user.email}`);
          await db.collection('userbalances').insertOne({
            userId: user._id,
            currencyId: usdCurrency._id,
            amount: user.isAdmin ? 10000000 : 1000, // Admins get $10M, users get $1K
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    console.log('\n✅ Authentication fix completed successfully!');
    console.log('\n🚀 Users can now log in with the credentials shown above.');
    
  } catch (error) {
    console.error('❌ Error fixing authentication:', error);
  } finally {
    process.exit(0);
  }
}

fixUserAuthentication();