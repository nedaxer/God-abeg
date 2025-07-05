import mongoose from 'mongoose';

async function createTestKYCWithDocuments() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
    const User = mongoose.model('TempUser', userSchema, 'users');
    
    // Create fake base64 image data (small test image)
    const fakeImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    // Create test user with KYC documents
    const testUser = await User.create({
      email: 'test-kyc-docs@example.com',
      username: 'testkycdocs',
      firstName: 'Test',
      lastName: 'KYCDocs',
      uid: '1234567890',
      password: 'hashedpassword',
      kycStatus: 'pending',
      kycData: {
        hearAboutUs: 'Social Media',
        dateOfBirth: { day: 15, month: 5, year: 1990 },
        sourceOfIncome: 'Employment',
        annualIncome: '$50,000 - $100,000',
        investmentExperience: 'Beginner',
        plannedDeposit: '$1,000 - $5,000',
        investmentGoal: 'Long-term growth',
        documentType: 'passport',
        documents: {
          single: fakeImageBase64
        }
      }
    });
    
    console.log('✅ Created test user with KYC documents:', testUser._id);
    console.log('   Email:', testUser.email);
    console.log('   KYC Status:', testUser.kycStatus);
    console.log('   Document Type:', testUser.kycData.documentType);
    console.log('   Has Single Document:', !!testUser.kycData.documents.single);
    console.log('   Document Length:', testUser.kycData.documents.single.length);
    
    // Verify the document was saved correctly
    const savedUser = await User.findById(testUser._id);
    console.log('\n🔍 Verification after save:');
    console.log('   Has KYC Data:', !!savedUser.kycData);
    console.log('   Has Documents:', !!savedUser.kycData?.documents);
    console.log('   Document Keys:', Object.keys(savedUser.kycData?.documents || {}));
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
}

createTestKYCWithDocuments();