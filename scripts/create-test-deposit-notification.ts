import { connectToDatabase, getMongoClient } from '../server/mongodb';

async function createTestDepositNotification() {
  try {
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Create a new deposit notification
    const notification = {
      userId: "685c46d9b3dc40aeae0ed7fa",
      type: "deposit",
      title: "Deposit Confirmed",
      message: `Dear valued Nedaxer trader,
Your deposit has been confirmed.
Deposit amount: 50.00000000 USDT
Deposit address: TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE
Timestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)`,
      data: {
        transactionId: "test_" + Date.now(),
        cryptoSymbol: "USDT",
        cryptoAmount: 50,
        usdAmount: 50,
        senderAddress: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        chainType: "TRC20",
        networkName: "TRON Network"
      },
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the notification
    const result = await db.collection('notifications').insertOne(notification);
    console.log('✓ Test deposit notification created:', result.insertedId);
    
    // Also add funds to user balance
    await db.collection('userbalances').updateOne(
      { userId: "685c46d9b3dc40aeae0ed7fa", currency: "USD" },
      { 
        $inc: { balance: 50 },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
    
    console.log('✓ Added $50 to user balance');
    console.log('🔔 New deposit notification should appear automatically in mobile app');
    
  } catch (error) {
    console.error('Error creating test deposit notification:', error);
  } finally {
    process.exit(0);
  }
}

createTestDepositNotification();