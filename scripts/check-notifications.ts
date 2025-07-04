import { connectToDatabase, getMongoClient } from '../server/mongodb';

async function checkNotifications() {
  try {
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Check notifications collection
    const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log('Recent notifications:', JSON.stringify(notifications, null, 2));
    
    // Check users collection to get userId
    const users = await db.collection('users').find({}, { projection: { _id: 1, email: 1, username: 1 } }).limit(3).toArray();
    console.log('Users:', JSON.stringify(users, null, 2));
    
    // Check deposit transactions
    const deposits = await db.collection('depositTransactions').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    console.log('Recent deposits:', JSON.stringify(deposits, null, 2));
    
  } catch (error) {
    console.error('Error checking notifications:', error);
  } finally {
    process.exit(0);
  }
}

checkNotifications();