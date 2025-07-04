import { connectToDatabase, getMongoClient } from '../server/mongodb';
import bcrypt from 'bcrypt';

async function testUserLogin() {
  try {
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Find user by email
    const user = await db.collection('users').findOne({ 
      email: 'robinstephen003@outlook.com' 
    });
    
    if (user) {
      console.log('Found user:', {
        _id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      });
      
      // Test password
      const passwordMatch = await bcrypt.compare('password123', user.password);
      console.log('Password matches:', passwordMatch);
      
      // Check notifications for this user
      const notifications = await db.collection('notifications').find({ 
        userId: user._id.toString() 
      }).sort({ createdAt: -1 }).limit(3).toArray();
      
      console.log('User notifications:', notifications.length);
      if (notifications.length > 0) {
        console.log('Latest notification:', {
          type: notifications[0].type,
          title: notifications[0].title,
          createdAt: notifications[0].createdAt
        });
      }
    } else {
      console.log('User not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testUserLogin();