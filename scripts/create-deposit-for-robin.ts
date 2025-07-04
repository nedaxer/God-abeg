import { MongoClient, ObjectId } from 'mongodb';

async function createDepositForRobin() {
  const client = new MongoClient('mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/');
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    // Find Robin's user ID
    const user = await db.collection('users').findOne({ email: 'robinstephen003@outlook.com' });
    if (!user) {
      console.log('User robinstephen003@outlook.com not found');
      return;
    }
    
    console.log('Found user:', user._id);
    
    // Create deposit transaction
    const transaction = {
      userId: user._id.toString(),
      adminId: 'admin',
      cryptoSymbol: 'USDT',
      cryptoName: 'Tether',
      chainType: 'TRC20',
      networkName: 'TRON Network',
      senderAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      usdAmount: 500,
      cryptoAmount: 500,
      cryptoPrice: 1.00,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const transactionResult = await db.collection('depositTransactions').insertOne(transaction);
    console.log('Deposit transaction created:', transactionResult.insertedId);
    
    // Add funds to user balance
    await db.collection('userBalances').updateOne(
      { userId: user._id.toString(), currency: 'USD' },
      { 
        $inc: { amount: 500 },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
    console.log('Added $500 to user balance');
    
    // Create notification
    const notification = {
      userId: user._id.toString(),
      type: 'deposit',
      title: 'Deposit Confirmed',
      message: `Dear valued Nedaxer trader,
Your deposit has been confirmed.
Deposit amount: 500.00000000 USDT
Deposit address: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
Timestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)`,
      data: {
        transactionId: transactionResult.insertedId,
        cryptoSymbol: 'USDT',
        cryptoAmount: 500,
        usdAmount: 500,
        senderAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        chainType: 'TRC20',
        networkName: 'TRON Network'
      },
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const notificationResult = await db.collection('notifications').insertOne(notification);
    console.log('Notification created:', notificationResult.insertedId);
    
    console.log('Successfully created $500 USDT deposit for robinstephen003@outlook.com');
    
  } catch (error) {
    console.error('Error creating deposit:', error);
  } finally {
    await client.close();
  }
}

createDepositForRobin();