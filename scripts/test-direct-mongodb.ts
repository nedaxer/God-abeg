import { connectToDatabase, getMongoClient } from '../server/mongodb';

async function testDirectMongoDB() {
  try {
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Test direct MongoDB query without Mongoose
    const users = await db.collection('users').find({}).toArray();
    console.log('Direct MongoDB - Users found:', users.length);
    
    if (users.length > 0) {
      console.log('Sample user:', {
        _id: users[0]._id,
        username: users[0].username,
        email: users[0].email
      });
    }
    
    // Test notifications
    const notifications = await db.collection('notifications').find({}).toArray();
    console.log('Direct MongoDB - Notifications found:', notifications.length);
    
    if (notifications.length > 0) {
      console.log('Sample notification:', {
        _id: notifications[0]._id,
        type: notifications[0].type,
        title: notifications[0].title,
        userId: notifications[0].userId
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testDirectMongoDB();