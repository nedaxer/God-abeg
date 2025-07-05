import { MongoClient } from 'mongodb';

async function testFinalVerification() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('\n🔍 FINAL VERIFICATION: Testing comprehensive zero transaction system...');
    
    // 1. Check that all zero transactions have been removed
    console.log('\n=== ZERO TRANSACTION CLEANUP VERIFICATION ===');
    
    const zeroDeposits = await db.collection('deposittransactions').find({
      $or: [
        { cryptoAmount: { $lte: 0 } },
        { usdAmount: { $lte: 0 } },
        { cryptoAmount: { $exists: false } },
        { usdAmount: { $exists: false } }
      ]
    }).toArray();
    
    const zeroTransfers = await db.collection('transfers').find({
      $or: [
        { amount: { $lte: 0 } },
        { amount: { $exists: false } }
      ]
    }).toArray();
    
    const zeroWithdrawals = await db.collection('withdrawaltransactions').find({
      $or: [
        { cryptoAmount: { $lte: 0 } },
        { usdAmount: { $lte: 0 } }
      ]
    }).toArray();
    
    console.log(`Zero deposits remaining: ${zeroDeposits.length} (should be 0)`);
    console.log(`Zero transfers remaining: ${zeroTransfers.length} (should be 0)`);
    console.log(`Zero withdrawals remaining: ${zeroWithdrawals.length} (should be 0)`);
    
    // 2. Check valid transactions
    console.log('\n=== VALID TRANSACTIONS CHECK ===');
    
    const validDeposits = await db.collection('deposittransactions').find({
      cryptoAmount: { $gt: 0 },
      usdAmount: { $gt: 0 }
    }).toArray();
    
    const validTransfers = await db.collection('transfers').find({
      amount: { $gt: 0 }
    }).toArray();
    
    const validWithdrawals = await db.collection('withdrawaltransactions').find({
      cryptoAmount: { $gt: 0 },
      usdAmount: { $gt: 0 }
    }).toArray();
    
    console.log(`Valid deposits: ${validDeposits.length}`);
    console.log(`Valid transfers: ${validTransfers.length}`);
    console.log(`Valid withdrawals: ${validWithdrawals.length}`);
    
    // 3. Check notification-to-transaction ID mapping
    console.log('\n=== NOTIFICATION MAPPING VERIFICATION ===');
    
    const notifications = await db.collection('notifications').find({
      type: { $in: ['deposit', 'transfer_sent', 'transfer_received', 'withdrawal'] }
    }).toArray();
    
    console.log(`Found ${notifications.length} transaction notifications`);
    
    for (const notification of notifications) {
      if (notification.type === 'deposit') {
        const deposit = await db.collection('deposittransactions').findOne({
          _id: notification.data?.transactionId || new require('mongodb').ObjectId(notification.data?.transactionId)
        });
        console.log(`Deposit notification ${notification._id} -> ${deposit ? '✅ MAPPED' : '❌ BROKEN'}`);
      } else if (notification.type === 'transfer_sent' || notification.type === 'transfer_received') {
        const transfer = await db.collection('transfers').findOne({
          _id: notification.data?.transferId || new require('mongodb').ObjectId(notification.data?.transferId)
        });
        console.log(`Transfer notification ${notification._id} -> ${transfer ? '✅ MAPPED' : '❌ BROKEN'}`);
      }
    }
    
    // 4. Show sample transaction data for frontend testing
    console.log('\n=== SAMPLE DATA FOR FRONTEND TESTING ===');
    
    if (validDeposits.length > 0) {
      const sampleDeposit = validDeposits[0];
      console.log(`Sample deposit for highlighting test:`);
      console.log(`  ID: ${sampleDeposit._id}`);
      console.log(`  Amount: ${sampleDeposit.cryptoAmount} ${sampleDeposit.cryptoSymbol}`);
      console.log(`  USD: $${sampleDeposit.usdAmount}`);
      console.log(`  Test URL: #/mobile/assets-history?highlight=${sampleDeposit._id}`);
    }
    
    if (validTransfers.length > 0) {
      const sampleTransfer = validTransfers[0];
      console.log(`Sample transfer for highlighting test:`);
      console.log(`  ID: ${sampleTransfer._id}`);
      console.log(`  Transaction ID: ${sampleTransfer.transactionId}`);
      console.log(`  Amount: $${sampleTransfer.amount}`);
      console.log(`  Test URL: #/mobile/assets-history?highlight=${sampleTransfer._id}`);
    }
    
    console.log('\n✅ Comprehensive zero transaction cleanup and highlighting system verification complete!');
    
  } catch (error) {
    console.error('Verification error:', error);
  } finally {
    await client.close();
  }
}

testFinalVerification();