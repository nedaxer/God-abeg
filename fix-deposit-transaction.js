// Fix deposit transaction display issue
const { MongoClient } = require('mongodb');

async function fixDepositTransaction() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  const client = new MongoClient(mongoUri);
  
  try {
    await client.connect();
    const db = client.db('nedaxer');
    
    const userId = '685c46d9b3dc40aeae0ed7fa';
    
    // Get current deposit transactions
    const deposits = await db.collection('deposittransactions').find({ userId }).toArray();
    console.log(`Found ${deposits.length} deposit transactions for user ${userId}`);
    
    if (deposits.length > 0) {
      deposits.forEach((deposit, index) => {
        console.log(`${index + 1}. ${deposit.cryptoAmount} ${deposit.cryptoSymbol} - $${deposit.usdAmount}`);
        console.log(`   Network: ${deposit.networkName}`);
        console.log(`   Date: ${deposit.createdAt}`);
        console.log(`   ID: ${deposit._id}`);
      });
    } else {
      // Create a test deposit transaction if none exist
      console.log('Creating test deposit transaction...');
      
      const testDeposit = {
        userId: userId,
        adminId: 'admin',
        cryptoSymbol: 'USDT',
        cryptoName: 'Tether USD',
        chainType: 'TRC20',
        networkName: 'TRON Network',
        senderAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        usdAmount: 100,
        cryptoAmount: 100,
        cryptoPrice: 1.0,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('deposittransactions').insertOne(testDeposit);
      console.log('Test deposit created:', result.insertedId);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixDepositTransaction();