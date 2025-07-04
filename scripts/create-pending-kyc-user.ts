import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://glo54t875:HC3kFetCuyWe9u28@nedaxer.qzntzfb.mongodb.net/';

function generateUID(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

async function createPendingKycUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('nedaxer');
    const usersCollection = db.collection('users');
    const balancesCollection = db.collection('userbalances');
    
    // Create test user with pending KYC
    const hashedPassword = await bcrypt.hash('password123', 10);
    const uid = generateUID();
    
    const testUser = {
      uid: uid,
      username: 'testuser_pending_kyc',
      email: 'pending.kyc@test.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Pending',
      isVerified: false,
      isAdmin: false,
      kycStatus: 'submitted', // This will make it appear in pending KYC
      kycData: {
        personalInfo: {
          fullName: 'John Pending',
          dateOfBirth: '1990-01-01',
          nationality: 'US',
          phoneNumber: '+1234567890'
        },
        addressInfo: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'United States'
        },
        documents: {
          documentType: 'passport',
          documentNumber: 'TEST123456',
          frontImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          backImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        },
        submittedAt: new Date(),
        questionnaire: {
          investmentExperience: 'beginner',
          riskTolerance: 'low',
          investmentGoals: 'long-term',
          annualIncome: '50000-100000',
          sourceOfFunds: 'salary'
        }
      },
      profilePicture: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the user
    const result = await usersCollection.insertOne(testUser);
    console.log('Test user created with ID:', result.insertedId);
    console.log('User UID:', uid);
    console.log('Email:', testUser.email);
    console.log('KYC Status:', testUser.kycStatus);

    // Create initial balance for the user
    const initialBalance = {
      userId: result.insertedId.toString(),
      currency: 'USD',
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await balancesCollection.insertOne(initialBalance);
    console.log('Initial USD balance created for user');

    // Create another test user with verified status for comparison
    const verifiedUID = generateUID();
    const verifiedUser = {
      uid: verifiedUID,
      username: 'testuser_verified',
      email: 'verified.user@test.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Verified',
      isVerified: true, // This user is already verified
      isAdmin: false,
      kycStatus: 'verified',
      kycData: {
        personalInfo: {
          fullName: 'Jane Verified',
          dateOfBirth: '1988-05-15',
          nationality: 'US',
          phoneNumber: '+1987654321'
        },
        addressInfo: {
          street: '456 Verified Avenue',
          city: 'Verified City',
          state: 'Verified State',
          zipCode: '54321',
          country: 'United States'
        },
        documents: {
          documentType: 'driving_license',
          documentNumber: 'VER789012',
          frontImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          backImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        },
        approvedAt: new Date(),
        questionnaire: {
          investmentExperience: 'intermediate',
          riskTolerance: 'medium',
          investmentGoals: 'growth',
          annualIncome: '100000+',
          sourceOfFunds: 'business'
        }
      },
      profilePicture: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const verifiedResult = await usersCollection.insertOne(verifiedUser);
    console.log('Verified test user created with ID:', verifiedResult.insertedId);
    console.log('Verified user UID:', verifiedUID);
    console.log('Email:', verifiedUser.email);

    // Create balance for verified user
    const verifiedBalance = {
      userId: verifiedResult.insertedId.toString(),
      currency: 'USD',
      balance: 1000,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await balancesCollection.insertOne(verifiedBalance);
    console.log('Initial USD balance created for verified user');

    console.log('\n=== TEST USERS CREATED ===');
    console.log('1. PENDING KYC USER:');
    console.log('   Email: pending.kyc@test.com');
    console.log('   Password: password123');
    console.log('   UID:', uid);
    console.log('   Status: submitted (pending approval)');
    console.log('\n2. VERIFIED USER:');
    console.log('   Email: verified.user@test.com');
    console.log('   Password: password123');
    console.log('   UID:', verifiedUID);
    console.log('   Status: verified (should show orange badge)');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await client.close();
  }
}

// Run the script
createPendingKycUser().catch(console.error);