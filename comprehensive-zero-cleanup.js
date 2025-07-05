import { MongoClient } from 'mongodb';

async function comprehensiveZeroCleanup() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('\n🔍 Finding ALL zero/fake transactions to remove...');
    
    // Find and remove zero deposits
    const zeroDeposits = await db.collection('deposittransactions').find({
      $or: [
        { cryptoAmount: { $lte: 0 } },
        { cryptoAmount: { $exists: false } },
        { cryptoAmount: null },
        { cryptoAmount: "" },
        { usdAmount: { $lte: 0 } },
        { usdAmount: { $exists: false } },
        { usdAmount: null }
      ]
    }).toArray();
    
    console.log(`Found ${zeroDeposits.length} zero deposits to remove`);
    if (zeroDeposits.length > 0) {
      const deleteResult = await db.collection('deposittransactions').deleteMany({
        $or: [
          { cryptoAmount: { $lte: 0 } },
          { cryptoAmount: { $exists: false } },
          { cryptoAmount: null },
          { cryptoAmount: "" },
          { usdAmount: { $lte: 0 } },
          { usdAmount: { $exists: false } },
          { usdAmount: null }
        ]
      });
      console.log(`✅ Deleted ${deleteResult.deletedCount} zero deposits`);
    }
    
    // Find and remove zero transfers  
    const zeroTransfers = await db.collection('transfers').find({
      $or: [
        { amount: { $lte: 0 } },
        { amount: { $exists: false } },
        { amount: null },
        { amount: "" }
      ]
    }).toArray();
    
    console.log(`Found ${zeroTransfers.length} zero transfers to remove`);
    if (zeroTransfers.length > 0) {
      const deleteResult = await db.collection('transfers').deleteMany({
        $or: [
          { amount: { $lte: 0 } },
          { amount: { $exists: false } },
          { amount: null },
          { amount: "" }
        ]
      });
      console.log(`✅ Deleted ${deleteResult.deletedCount} zero transfers`);
    }
    
    // Find and remove zero withdrawals
    const zeroWithdrawals = await db.collection('withdrawaltransactions').find({
      $or: [
        { cryptoAmount: { $lte: 0 } },
        { cryptoAmount: { $exists: false } },
        { cryptoAmount: null },
        { cryptoAmount: "" },
        { usdAmount: { $lte: 0 } },
        { usdAmount: { $exists: false } },
        { usdAmount: null }
      ]
    }).toArray();
    
    console.log(`Found ${zeroWithdrawals.length} zero withdrawals to remove`);
    if (zeroWithdrawals.length > 0) {
      const deleteResult = await db.collection('withdrawaltransactions').deleteMany({
        $or: [
          { cryptoAmount: { $lte: 0 } },
          { cryptoAmount: { $exists: false } },
          { cryptoAmount: null },
          { cryptoAmount: "" },
          { usdAmount: { $lte: 0 } },
          { usdAmount: { $exists: false } },
          { usdAmount: null }
        ]
      });
      console.log(`✅ Deleted ${deleteResult.deletedCount} zero withdrawals`);
    }
    
    // Find and remove related notifications for deleted transactions
    const fakeNotifications = await db.collection('notifications').find({
      $or: [
        { 'data.cryptoAmount': { $lte: 0 } },
        { 'data.amount': { $lte: 0 } },
        { 'data.usdAmount': { $lte: 0 } },
        { 'data.cryptoAmount': { $exists: false } },
        { 'data.amount': { $exists: false } }
      ]
    }).toArray();
    
    console.log(`Found ${fakeNotifications.length} fake notifications to remove`);
    if (fakeNotifications.length > 0) {
      const deleteResult = await db.collection('notifications').deleteMany({
        $or: [
          { 'data.cryptoAmount': { $lte: 0 } },
          { 'data.amount': { $lte: 0 } },
          { 'data.usdAmount': { $lte: 0 } },
          { 'data.cryptoAmount': { $exists: false } },
          { 'data.amount': { $exists: false } }
        ]
      });
      console.log(`✅ Deleted ${deleteResult.deletedCount} fake notifications`);
    }
    
    console.log('\n✅ Comprehensive cleanup completed!');
    
    // Show remaining valid transactions
    const validDeposits = await db.collection('deposittransactions').find({}).toArray();
    const validTransfers = await db.collection('transfers').find({}).toArray();
    const validWithdrawals = await db.collection('withdrawaltransactions').find({}).toArray();
    
    console.log(`\n📊 Valid transactions remaining:`);
    console.log(`- Deposits: ${validDeposits.length}`);
    console.log(`- Transfers: ${validTransfers.length}`);
    console.log(`- Withdrawals: ${validWithdrawals.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.await client.close();
  }
}

// Use environment variable for MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is required');
}veZeroCleanup();