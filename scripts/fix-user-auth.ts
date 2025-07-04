import { connectToDatabase, getMongoClient } from '../server/mongodb';
import bcrypt from 'bcrypt';

async function fixUserAuth() {
  try {
    const client = await getMongoClient();
    const db = client.db('nedaxer');
    
    // Find user with email
    const user = await db.collection('users').findOne({ 
      email: 'robinstephen003@outlook.com' 
    });
    
    if (user) {
      console.log('Current user data:', {
        _id: user._id,
        username: user.username,
        email: user.email
      });
      
      // Update user to ensure username field exists and matches email
      await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: { 
            username: 'robinstephen003@outlook.com',
            updatedAt: new Date()
          }
        }
      );
      
      console.log('Updated user username to match email for authentication');
      
      // Test password hash
      const testPassword = await bcrypt.hash('password123', 10);
      await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: { 
            password: testPassword,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('Updated user password hash');
      
    } else {
      console.log('User not found');
    }
    
  } catch (error) {
    console.error('Error fixing user auth:', error);
  } finally {
    process.exit(0);
  }
}

fixUserAuth();