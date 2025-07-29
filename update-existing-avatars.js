/**
 * Script to update existing users' bot avatars to smile face avatars
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Smile face avatar options
function generateSmileFaceAvatar(username) {
  const smileFaceAvatars = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=1&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=short01&hairColor=FF6B35',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=2&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=short02&hairColor=8B4513',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=3&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=short03&hairColor=FF6B35',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=4&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=short04&hairColor=D2691E',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=5&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=long01&hairColor=FF6B35',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=6&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=long02&hairColor=8B4513',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=7&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=curly&hairColor=FF6B35',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=8&backgroundColor=FF8C00&mood=happy&eyes=happy&mouth=smile&hair=dreadlocks&hairColor=D2691E'
  ];
  
  const avatarIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % smileFaceAvatars.length;
  return smileFaceAvatars[avatarIndex];
}

async function updateExistingAvatars() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Find users with bot avatars (containing 'bottts')
    const botAvatarUsers = await users.find({
      profilePicture: { $regex: 'bottts', $options: 'i' }
    }).toArray();
    
    console.log(`Found ${botAvatarUsers.length} users with bot avatars to update`);
    
    let updatedCount = 0;
    
    for (const user of botAvatarUsers) {
      const newAvatar = generateSmileFaceAvatar(user.username);
      
      await users.updateOne(
        { _id: user._id },
        { $set: { profilePicture: newAvatar } }
      );
      
      console.log(`Updated avatar for user ${user.username}: ${newAvatar}`);
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} user avatars to smile faces!`);
    
  } catch (error) {
    console.error('Error updating avatars:', error);
  } finally {
    await client.close();
  }
}

// Run the update
updateExistingAvatars();