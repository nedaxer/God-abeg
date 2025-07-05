import { MongoStorage } from './server/storage.mongo.js';

async function enableTransferAccess() {
  const storage = new MongoStorage();
  
  try {
    const userId = '6863fa4c866058dcc7f026f1';
    
    // Get current user
    const user = await storage.getUser(userId);
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Current user:', user.email);
    console.log('Current transferAccess:', user.transferAccess);
    
    // Enable transfer access
    const updateData = { ...user, transferAccess: true };
    await storage.updateUser(userId, updateData);
    
    console.log('✅ Transfer access enabled for user:', user.email);
    
    // Verify the change
    const updatedUser = await storage.getUser(userId);
    console.log('Updated transferAccess:', updatedUser.transferAccess);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

enableTransferAccess();