import { MongoClient } from 'mongodb';

async function debugUserIssues() {
  let client;
  
  try {
    // Connect to MongoDB using environment variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('🔍 Debugging User Issues...\n');
    
    // 1. Check users with withdrawal restriction messages
    console.log('=== WITHDRAWAL RESTRICTION MESSAGES ===');
    const usersWithRestrictions = await db.collection('users').find({
      withdrawalRestrictionMessage: { $exists: true, $ne: "", $ne: null }
    }).toArray();
    
    console.log(`Found ${usersWithRestrictions.length} users with withdrawal restriction messages:`);
    usersWithRestrictions.forEach(user => {
      console.log(`- User ${user.uid || user._id}: "${user.withdrawalRestrictionMessage}"`);
    });
    
    // 2. Check all users and their restriction status
    console.log('\n=== ALL USERS STATUS ===');
    const allUsers = await db.collection('users').find({}).toArray();
    console.log(`Total users: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`User ${user.uid || user._id}:`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Requires Deposit: ${user.requiresDeposit || false}`);
      console.log(`  - Withdrawal Message: "${user.withdrawalRestrictionMessage || 'None'}"`);
      console.log('');
    });
    
    // 3. Check transfer history
    console.log('=== TRANSFER HISTORY ===');
    const transfers = await db.collection('transfers').find({}).sort({ createdAt: -1 }).toArray();
    console.log(`Total transfers found: ${transfers.length}`);
    
    if (transfers.length > 0) {
      console.log('Recent transfers:');
      transfers.slice(0, 5).forEach(transfer => {
        console.log(`- ${transfer.transactionId}: $${transfer.amount} from ${transfer.fromUserId} to ${transfer.toUserId}`);
        console.log(`  Status: ${transfer.status}, Created: ${transfer.createdAt}`);
      });
    } else {
      console.log('No transfers found in database');
    }
    
    // 4. Check if Transfer model exists and is properly structured
    console.log('\n=== TRANSFER COLLECTION STRUCTURE ===');
    const transferCount = await db.collection('transfers').countDocuments();
    console.log(`Transfer collection document count: ${transferCount}`);
    
    if (transferCount > 0) {
      const sampleTransfer = await db.collection('transfers').findOne({});
      console.log('Sample transfer document structure:');
      console.log(JSON.stringify(sampleTransfer, null, 2));
    }
    
    // 5. Test specific user transfer history
    console.log('\n=== USER-SPECIFIC TRANSFER HISTORY ===');
    const testUserId = allUsers[0]?._id;
    if (testUserId) {
      const userTransfers = await db.collection('transfers').find({
        $or: [
          { fromUserId: testUserId },
          { toUserId: testUserId }
        ]
      }).toArray();
      
      console.log(`Transfers for user ${testUserId}: ${userTransfers.length}`);
      userTransfers.forEach(transfer => {
        const isSender = transfer.fromUserId.toString() === testUserId.toString();
        console.log(`- ${isSender ? 'SENT' : 'RECEIVED'}: $${transfer.amount} (${transfer.transactionId})`);
      });
    }
    
  } catch (error) {
    console.error('Error debugging user issues:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

debugUserIssues().catch(console.error);