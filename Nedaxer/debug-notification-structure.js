import { MongoClient } from 'mongodb';

async function debugNotificationStructure() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('\n🔍 Checking notification structure...');
    
    // Find recent notifications with transaction data
    const notifications = await db.collection('notifications').find({
      $or: [
        { type: 'deposit' },
        { type: 'transfer_sent' },
        { type: 'transfer_received' },
        { type: 'withdrawal' }
      ]
    }).sort({ createdAt: -1 }).limit(5).toArray();
    
    console.log(`Found ${notifications.length} transaction notifications:`);
    notifications.forEach((notification, index) => {
      console.log(`\n${index + 1}. ${notification.type} - ${notification._id}`);
      console.log(`   Title: ${notification.title}`);
      console.log(`   Data:`, JSON.stringify(notification.data, null, 2));
    });
    
    console.log('\n🔍 Checking actual transaction IDs in collections...');
    
    // Check deposit transactions
    const deposits = await db.collection('deposittransactions').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    console.log(`\nDeposit transactions (${deposits.length}):`);
    deposits.forEach((deposit, index) => {
      console.log(`${index + 1}. ID: ${deposit._id}, Amount: ${deposit.cryptoAmount} ${deposit.cryptoSymbol}`);
    });
    
    // Check transfer transactions
    const transfers = await db.collection('transfers').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    console.log(`\nTransfer transactions (${transfers.length}):`);
    transfers.forEach((transfer, index) => {
      console.log(`${index + 1}. ID: ${transfer._id}, Transaction ID: ${transfer.transactionId}, Amount: ${transfer.amount}`);
    });
    
    // Check withdrawal transactions
    const withdrawals = await db.collection('withdrawaltransactions').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    console.log(`\nWithdrawal transactions (${withdrawals.length}):`);
    withdrawals.forEach((withdrawal, index) => {
      console.log(`${index + 1}. ID: ${withdrawal._id}, Amount: ${withdrawal.cryptoAmount} ${withdrawal.cryptoSymbol}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugNotificationStructure();