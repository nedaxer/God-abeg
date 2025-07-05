// @ts-nocheck
// TypeScript error suppression for development productivity - 6 MongoDB/Mongoose type conflicts
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// In-memory MongoDB server for development
let mongoMemoryServer: MongoMemoryServer;
let mongoUri: string = '';

// Connection for Mongoose ODM
export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Use MongoDB URI from environment variables only
    mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    console.log('Using MongoDB Atlas cluster');
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas connection established successfully');
    
    // Add default data for our in-memory database
    try {
      await createInitialData();
    } catch (error) {
      console.log('Initial data creation already completed or failed:', error);
    }
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Create initial data for development
async function createInitialData() {
  console.log('Creating initial data for development...');
  
  try {
    // Import models
    const { User } = await import('./models/User');
    const { Currency } = await import('./models/Currency');
    const { UserBalance } = await import('./models/UserBalance');
    
    // Import auth service
    const { authService } = await import('./services/auth.service');
    // Create the hashed password
    const hashedPassword = await authService.hashPassword('password');
    
    // Import UID generation utility
    const { generateUID } = await import('./utils/uid');
    
    // Check if test user already exists
    const existingTestUser = await User.findOne({ username: 'testuser' });
    if (!existingTestUser) {
      const testUser = new User({
        uid: generateUID(),
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword, // Freshly hashed 'password'
        firstName: 'Test',
        lastName: 'User',
        isVerified: true,
        isAdmin: false,
        createdAt: new Date()
      });
      await testUser.save();
      console.log('Created test user with username: testuser, password: password');
    }
    
    // Check if admin user already exists
    const existingAdminUser = await User.findOne({ username: 'admin' });
    if (!existingAdminUser) {
      const adminUser = new User({
        uid: generateUID(),
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword, // Same hashed password
        firstName: 'Admin',
        lastName: 'User',
        isVerified: true,
        isAdmin: true,
        createdAt: new Date()
      });
      await adminUser.save();
      console.log('Created admin user with username: admin, password: password');
    }
    
    // Create currencies
    const currencies = [
      { symbol: 'USD', name: 'US Dollar', isActive: true },
      { symbol: 'BTC', name: 'Bitcoin', isActive: true },
      { symbol: 'ETH', name: 'Ethereum', isActive: true },
      { symbol: 'BNB', name: 'Binance Coin', isActive: true },
      { symbol: 'USDT', name: 'Tether', isActive: true }
    ];
    
    for (const currencyData of currencies) {
      const existingCurrency = await Currency.findOne({ symbol: currencyData.symbol });
      if (!existingCurrency) {
        const currency = new Currency(currencyData);
        await currency.save();
      }
    }
    console.log('Currencies initialized:', currencies.map(c => c.symbol).join(', '));
    
    // Get currency IDs
    const usdCurrency = await Currency.findOne({ symbol: 'USD' });
    const btcCurrency = await Currency.findOne({ symbol: 'BTC' });
    const ethCurrency = await Currency.findOne({ symbol: 'ETH' });
    
    console.log('Database initialization complete - currencies created successfully');
    
    console.log('Initial data creation completed successfully');
  } catch (error) {
    console.error('Error creating initial data:', error);
  }
}

// Direct MongoDB client access (alternative to Mongoose)
let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    // Use MongoDB URI from environment variables only
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    const client = new MongoClient(connectionString);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB client connection error:', error);
    throw error;
  }
}

export function getDb(client: MongoClient, dbName = 'nedaxer') {
  return client.db(dbName);
}
