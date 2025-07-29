import mongoose from 'mongoose';

// Use the MongoDB URI from environment
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://nedax:test123@nedaxer.eyejj2k.mongodb.net/?retryWrites=true&w=majority&appName=Nadax';

async function checkUserData() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Create User model
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', UserSchema);
    
    // Create PendingRegistration model
    const PendingRegSchema = new mongoose.Schema({}, { strict: false });
    const PendingReg = mongoose.model('PendingRegistration', PendingRegSchema);
    
    // Check for user with email
    const user = await User.findOne({ email: 'leesmart995@gmail.com' });
    
    if (user) {
      console.log('📝 User found:');
      console.log('  ID:', user._id);
      console.log('  Email:', user.email);
      console.log('  Username:', user.username);
      console.log('  First Name:', user.firstName);
      console.log('  Last Name:', user.lastName);
      console.log('  Phone:', user.phone);
      console.log('  Phone Number:', user.phoneNumber);
      console.log('  Date of Birth:', user.dateOfBirth);
      console.log('  Month of Birth:', user.monthOfBirth);
      console.log('  Year of Birth:', user.yearOfBirth);
      console.log('  Gender:', user.gender);
      console.log('  Is Verified:', user.isVerified);
      console.log('  Created At:', user.createdAt);
    } else {
      console.log('❌ No user found with email leesmart995@gmail.com');
      
      // Check pending registrations
      const pending = await PendingReg.findOne({ email: 'leesmart995@gmail.com' });
      
      if (pending) {
        console.log('⏳ Found pending registration:');
        console.log('  Email:', pending.email);
        console.log('  Phone:', pending.phone);
        console.log('  Date of Birth:', pending.dateOfBirth);
        console.log('  Gender:', pending.gender);
        console.log('  OTP:', pending.otp);
        console.log('  Expires:', pending.expiresAt);
        console.log('  Current Time:', new Date());
        console.log('  Is Expired:', new Date() > pending.expiresAt);
      } else {
        console.log('❌ No pending registration found either');
      }
    }
    
    // Check if there are any users at all
    const userCount = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${userCount}`);
    
    if (userCount > 0) {
      const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
      console.log('\n🔍 Recent users:');
      recentUsers.forEach((u, index) => {
        console.log(`  ${index + 1}. ${u.email} - ${u.firstName} ${u.lastName} (${u.isVerified ? 'Verified' : 'Not Verified'})`);
      });
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUserData();