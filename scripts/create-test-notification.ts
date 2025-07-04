import { MongoClient, ObjectId } from 'mongodb';

async function createTestNotification() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    // Create a test deposit notification
    const notification = {
      userId: '685c46d9b3dc40aeae0ed7fa', // Your user ID
      type: 'deposit',
      title: 'Deposit Confirmed',
      message: `Dear valued Nedaxer trader,
Your deposit has been confirmed.
Deposit amount: 0.10000000 USDT
Deposit address: TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE
Timestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)`,
      data: {
        transactionId: new ObjectId(),
        cryptoSymbol: 'USDT',
        cryptoAmount: 0.1,
        usdAmount: 100,
        senderAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
        chainType: 'TRC20',
        networkName: 'TRON Network'
      },
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('notifications').insertOne(notification);
    console.log('Test notification created:', result.insertedId);
    
    // Also create a test deposit transaction
    const transaction = {
      userId: '685c46d9b3dc40aeae0ed7fa',
      adminId: 'admin',
      cryptoSymbol: 'USDT',
      cryptoName: 'Tether',
      chainType: 'TRC20',
      networkName: 'TRON Network',
      senderAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      usdAmount: 100,
      cryptoAmount: 0.1,
      cryptoPrice: 1.00,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const transactionResult = await db.collection('depositTransactions').insertOne(transaction);
    console.log('Test deposit transaction created:', transactionResult.insertedId);
    
    // Update the notification with the actual transaction ID
    await db.collection('notifications').updateOne(
      { _id: result.insertedId },
      { $set: { 'data.transactionId': transactionResult.insertedId } }
    );
    
    console.log('Test data created successfully!');
    
  } catch (error) {
    console.error('Error creating test notification:', error);
  } finally {
    await client.close();
  }
}

createTestNotification();