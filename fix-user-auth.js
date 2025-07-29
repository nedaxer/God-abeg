import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://nedax:test123@nedaxer.eyejj2k.mongodb.net/?retryWrites=true&w=majority&appName=Nadax';

async function fixUserAuth() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema);
    
    const user = await User.findOne({ email: 'leesmart995@gmail.com' });
    
    if (user) {
      console.log('📝 Current user password hash:', user.password);
      
      // Test if the current password works with our expected password
      const testPasswords = ['Nedaxer@2025', 'nedaxer@2025', 'Smart@123'];
      
      for (const testPassword of testPasswords) {
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log(`🔑 Password "${testPassword}" matches:`, isMatch);
        if (isMatch) {
          console.log(`✅ Found correct password: ${testPassword}`);
          break;
        }
      }
      
      // Update password to known value
      const newPassword = 'Nedaxer@2025';
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      await User.updateOne(
        { email: 'leesmart995@gmail.com' },
        { 
          password: hashedPassword,
          actualPassword: newPassword // Store actual password for admin view
        }
      );
      
      console.log(`✅ Password updated to: ${newPassword}`);
      console.log('📝 User can now login with updated credentials');
      
    } else {
      console.log('❌ User not found');
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUserAuth();