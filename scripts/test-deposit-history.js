import { MongoClient } from 'mongodb';

async function testDepositHistory() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('=== Testing Deposit History ===');
    
    // Check deposit transactions for test user
    const userId = '685c46d9b3dc40aeae0ed7fa';
    const transactions = await db.collection('deposittransactions').find({ userId }).sort({ createdAt: -1 }).toArray();
    
    console.log(`Found ${transactions.length} deposit transactions for user ${userId}`);
    
    transactions.forEach((transaction, index) => {
      console.log(`\n${index + 1}. Transaction ID: ${transaction._id}`);
      console.log(`   Crypto: ${transaction.cryptoAmount} ${transaction.cryptoSymbol}`);
      console.log(`   USD Value: $${transaction.usdAmount}`);
      console.log(`   Network: ${transaction.chainType} (${transaction.networkName})`);
      console.log(`   Address: ${transaction.senderAddress}`);
      console.log(`   Created: ${transaction.createdAt}`);
    });
    
    // Check notifications for the same user
    const notifications = await db.collection('notifications').find({ 
      userId,
      type: 'deposit'
    }).sort({ createdAt: -1 }).toArray();
    
    console.log(`\nFound ${notifications.length} deposit notifications for user ${userId}`);
    
    // Create a test deposit transaction if none exist
    if (transactions.length === 0) {
      console.log('\nCreating test deposit transaction...');
      
      const testTransaction = {
        userId: userId,
        adminId: 'admin',
        cryptoSymbol: 'USDT',
        cryptoName: 'Tether',
        chainType: 'ERC20',
        networkName: 'Ethereum Network',
        senderAddress: '0x742d35Cc6084C36b3e3E4e1C8d4C8f4D6F4CeB9c',
        usdAmount: 150,
        cryptoAmount: 150.0,
        cryptoPrice: 1.0,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('deposittransactions').insertOne(testTransaction);
      console.log('Test deposit transaction created:', result.insertedId);
      
      // Create corresponding notification
      const testNotification = {
        userId: userId,
        type: 'deposit',
        title: 'Deposit Confirmed',
        message: `Dear valued Nedaxer trader,
Your deposit has been confirmed.
Deposit amount: ${testTransaction.cryptoAmount.toFixed(8)} ${testTransaction.cryptoSymbol}
Deposit address: ${testTransaction.senderAddress}
Timestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)`,
        data: {
          transactionId: result.insertedId,
          cryptoSymbol: testTransaction.cryptoSymbol,
          cryptoAmount: testTransaction.cryptoAmount,
          usdAmount: testTransaction.usdAmount,
          senderAddress: testTransaction.senderAddress,
          chainType: testTransaction.chainType,
          networkName: testTransaction.networkName
        },
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const notificationResult = await db.collection('notifications').insertOne(testNotification);
      console.log('Test notification created:', notificationResult.insertedId);
    }
    
  } catch (error) {
    console.error('Error testing deposit history:', error);
  } finally {
    await client.close();
  }
}

testDepositHistory();