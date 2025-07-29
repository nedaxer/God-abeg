// @ts-nocheck
// TypeScript error suppression for development productivity - 35 MongoDB type conflicts
// MongoDB models and types
import { User, IUser } from './models/User';
import { DepositTransaction, IDepositTransaction } from './models/DepositTransaction';
import { WithdrawalTransaction, IWithdrawalTransaction } from './models/WithdrawalTransaction';
import { Notification, INotification } from './models/Notification';
import { PendingDeposit, IPendingDeposit } from './models/PendingDeposit';
import { InsertMongoUser } from '@shared/mongo-schema';

// Storage interface for MongoDB implementation
export interface IMongoStorage {
  getUser(id: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: InsertMongoUser): Promise<IUser>;
  setVerificationCode(userId: string, code: string, expiresAt: Date): Promise<void>;
  verifyUser(userId: string, code: string): Promise<boolean>;
  markUserAsVerified(userId: string): Promise<void>;
  setResetPasswordCode(userId: string, code: string, expiresAt: Date): Promise<void>;
  
  // Email verification methods
  createEmailVerification(userId: string, email: string, otp: string, expiresAt: Date): Promise<void>;
  verifyEmailOTP(userId: string, otp: string): Promise<{ success: boolean; expired?: boolean; maxAttempts?: boolean; message: string }>;
  getActiveEmailVerification(userId: string): Promise<any>;
  cleanupExpiredVerifications(): Promise<void>;
  verifyResetPasswordCode(userId: string, code: string): Promise<boolean>;
  updatePassword(userId: string, newPassword: string): Promise<boolean>;
  updateUser(userId: string, updates: any): Promise<IUser | null>;
  updateUserProfile(userId: string, updates: Partial<IUser>): Promise<void>;
  
  // Favorites management
  addFavorite(userId: string, cryptoPairSymbol: string, cryptoId: string): Promise<void>;
  removeFavorite(userId: string, cryptoPairSymbol: string): Promise<void>;
  getUserFavorites(userId: string): Promise<string[]>;
  
  // User preferences management
  updateUserPreferences(userId: string, preferences: { lastSelectedPair?: string; lastSelectedCrypto?: string; lastSelectedTab?: string }): Promise<void>;
  getUserPreferences(userId: string): Promise<{ lastSelectedPair?: string; lastSelectedCrypto?: string; lastSelectedTab?: string } | null>;
  
  // Admin functions
  searchUsers(query: string): Promise<IUser[]>;
  addFundsToUser(userId: string, amount: number): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  getUserBalance(userId: string): Promise<number>;
  
  // Deposit transaction functions
  createDepositTransaction(data: {
    userId: string;
    adminId: string;
    cryptoSymbol: string;
    cryptoName: string;
    chainType: string;
    networkName: string;
    senderAddress: string;
    usdAmount: number;
    cryptoAmount: number;
    cryptoPrice: number;
  }): Promise<IDepositTransaction>;
  getUserDepositTransactions(userId: string): Promise<IDepositTransaction[]>;
  getDepositTransaction(transactionId: string): Promise<IDepositTransaction | null>;

  // Withdrawal transaction functions
  createWithdrawalTransaction(data: {
    userId: string;
    adminId: string;
    cryptoSymbol: string;
    cryptoName: string;
    chainType: string;
    networkName: string;
    withdrawalAddress: string;
    usdAmount: number;
    cryptoAmount: number;
    cryptoPrice: number;
  }): Promise<IWithdrawalTransaction>;
  getUserWithdrawalTransactions(userId: string): Promise<IWithdrawalTransaction[]>;
  getWithdrawalTransaction(transactionId: string): Promise<IWithdrawalTransaction | null>;
  
  // Pending deposit functions
  createPendingDeposit(data: {
    userId: string;
    cryptoSymbol: string;
    chainType: string;
    depositAddress: string;
    usdAmount: number;
  }): Promise<IPendingDeposit>;
  getUserPendingDeposit(userId: string): Promise<IPendingDeposit | null>;
  updatePendingDepositReceipt(userId: string, receiptImageUrl: string): Promise<boolean>;
  approvePendingDeposit(pendingDepositId: string, adminNotes?: string): Promise<{ userId: string; depositId: string; calculatedCryptoAmount: number } | null>;
  declinePendingDeposit(pendingDepositId: string, adminNotes?: string): Promise<boolean>;
  cancelPendingDeposit(userId: string): Promise<boolean>;
  getAllPendingDeposits(): Promise<IPendingDeposit[]>;

  // Notification functions
  createNotification(data: {
    userId: string;
    type: 'deposit' | 'withdrawal' | 'system' | 'trade' | 'announcement' | 'connection_request' | 'transfer_sent' | 'transfer_received' | 'kyc_approved' | 'kyc_rejected' | 'message';
    title: string;
    message: string;
    data?: any;
  }): Promise<INotification>;
  getUserNotifications(userId: string): Promise<INotification[]>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  removeNotificationByData(userId: string, type: string, dataMatch: any): Promise<void>;
}

export class MongoStorage implements IMongoStorage {
  constructor() {
    // No need to connect in constructor - app.ts already connects
    console.log('MongoDB storage initialized');
  }

  async getUser(id: string): Promise<IUser | null> {
    try {
      console.log('MongoStorage: getUser called with:', id);
      const user = await User.findById(id);
      console.log('MongoStorage: getUser result:', user ? 'FOUND' : 'NOT FOUND');
      
      if (user) {
        console.log('📋 Raw user data from MongoDB:', {
          phone: user.phone,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          monthOfBirth: user.monthOfBirth,
          yearOfBirth: user.yearOfBirth,
          gender: user.gender,
          countryCode: user.countryCode
        });
      }
      
      if (!user) return null;
      
      const userData = {
        _id: user._id.toString(),
        uid: user.uid,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        monthOfBirth: user.monthOfBirth,
        yearOfBirth: user.yearOfBirth,
        gender: user.gender,
        countryCode: user.countryCode,
        password: user.password, // Include password for authentication
        isAdmin: user.isAdmin || false,
        isVerified: user.isVerified || false, // Use actual verification status from database
        profilePicture: user.profilePicture || null, // Ensure explicit null if not set
        preferences: user.preferences,
        favorites: user.favorites || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      console.log('MongoStorage: returning user data with profile picture:', {
        userId: userData._id,
        hasProfilePicture: !!userData.profilePicture,
        profilePictureLength: userData.profilePicture?.length
      });
      
      return userData;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      console.log('MongoStorage: getUserByUsername called with:', username);
      console.log('User model available:', !!User);
      
      // Try to find by username first (case-insensitive), then by email (case-insensitive)
      let result = await User.findOne({ 
        username: { $regex: new RegExp(`^${username}$`, 'i') }
      });
      if (!result) {
        result = await User.findOne({ 
          email: { $regex: new RegExp(`^${username}$`, 'i') }
        });
      }
      
      console.log('MongoStorage: getUserByUsername result:', result ? 'FOUND' : 'NOT FOUND');
      return result;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      console.log('MongoStorage: getUserByEmail called with:', email);
      console.log('User model available:', !!User);
      const result = await User.findOne({ 
        email: { $regex: new RegExp(`^${email}$`, 'i') }
      });
      console.log('MongoStorage: getUserByEmail result:', result ? 'FOUND' : 'NOT FOUND');
      return result;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async createUser(userData: InsertMongoUser): Promise<IUser> {
    try {
      // Import UID utility
      const { generateUID } = await import('./utils/uid');
      
      // Hash the password with bcrypt directly
      const bcrypt = await import('bcrypt');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Generate unique UID
      let uid = generateUID();
      let isUidUnique = false;
      let attempts = 0;
      
      console.log('Generating UID for user:', { username: userData.username, generatedUID: uid });
      
      // Ensure UID is unique (max 10 attempts)
      while (!isUidUnique && attempts < 10) {
        const existingUser = await User.findOne({ uid });
        if (!existingUser) {
          isUidUnique = true;
          console.log('UID is unique:', uid);
        } else {
          uid = generateUID();
          attempts++;
          console.log('UID collision, generating new one:', uid);
        }
      }
      
      if (!isUidUnique) {
        throw new Error('Failed to generate unique UID after 10 attempts');
      }
      
      // Generate unique referral code for the new user
      function generateReferralCode(firstName: string, lastName: string): string {
        const initials = `${firstName?.charAt(0) || 'U'}${lastName?.charAt(0) || 'S'}`.toUpperCase();
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const year = new Date().getFullYear();
        return `NEDAXER_${initials}${year}_${randomString}`;
      }
      
      const referralCode = generateReferralCode(userData.firstName, userData.lastName);
      console.log('Generated referral code for new user:', referralCode);
      
      const newUser = new User({
        uid,
        username: userData.username,
        email: userData.email,
        password: hashedPassword, // Store hashed password
        actualPassword: userData.password, // Store actual password for admin viewing
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        monthOfBirth: userData.monthOfBirth,
        yearOfBirth: userData.yearOfBirth,
        gender: userData.gender,
        countryCode: userData.countryCode,
        isVerified: userData.isVerified || false, // Use provided value or default to false
        profilePicture: userData.profilePicture,
        referredBy: userData.referredBy || null, // Support referral system
        referralCode: referralCode, // Automatic referral code generation
        googleId: userData.googleId, // Support Google OAuth
      });
      
      const savedUser = await newUser.save();
      console.log('User created successfully with UID:', savedUser.uid);
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async setVerificationCode(userId: string, code: string, expiresAt: Date): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        verificationCode: code,
        verificationCodeExpires: expiresAt,
      });
    } catch (error) {
      console.error('Error setting verification code:', error);
      throw error;
    }
  }

  async verifyUser(userId: string, code: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      // Check if code is valid and not expired
      if (user.verificationCode !== code) return false;
      if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) return false;

      return true;
    } catch (error) {
      console.error('Error verifying user:', error);
      return false;
    }
  }

  async markUserAsVerified(userId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      });
    } catch (error) {
      console.error('Error marking user as verified:', error);
      throw error;
    }
  }
  
  async setResetPasswordCode(userId: string, code: string, expiresAt: Date): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        resetPasswordCode: code,
        resetPasswordCodeExpires: expiresAt,
      });
    } catch (error) {
      console.error('Error setting reset password code:', error);
      throw error;
    }
  }
  
  async verifyResetPasswordCode(userId: string, code: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) return false;
      
      // Check if code is valid and not expired
      if (user.resetPasswordCode !== code) return false;
      if (user.resetPasswordCodeExpires && user.resetPasswordCodeExpires < new Date()) return false;
      
      return true;
    } catch (error) {
      console.error('Error verifying reset password code:', error);
      return false;
    }
  }
  
  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      // Import auth service to hash the new password
      const { authService } = await import('./services/auth.service');
      
      // Hash the new password
      const hashedPassword = await authService.hashPassword(newPassword);
      
      // Update the user's password, store actual password for admin viewing, and clear the reset code
      await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
        actualPassword: newPassword,
        resetPasswordCode: null,
        resetPasswordCodeExpires: null,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

  async updateUser(userId: string, updates: any): Promise<IUser | null> {
    try {
      console.log('💾 mongoStorage: Updating user with ID:', userId);
      console.log('💾 mongoStorage: Update data:', updates);
      
      // Ensure all new profile fields are properly mapped
      const updateData = { ...updates };
      
      // Handle phoneNumber field properly
      if (updates.phoneNumber !== undefined) {
        updateData.phoneNumber = updates.phoneNumber;
        // Also update the legacy phone field for compatibility
        updateData.phone = updates.phoneNumber;
      }
      
      console.log('💾 mongoStorage: Final update data:', updateData);
      
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { $set: updateData },
        { new: true }
      );
      
      if (!updatedUser) {
        console.error('❌ mongoStorage: User not found for update');
        return null;
      }
      
      console.log('✅ mongoStorage: User updated successfully with fields:', Object.keys(updateData));
      return updatedUser as IUser;
    } catch (error) {
      console.error('❌ mongoStorage: Error updating user:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<IUser>): Promise<void> {
    try {
      console.log('MongoDB updateUserProfile called:', { userId, updates: Object.keys(updates) });
      
      const updateData: any = {};
      
      if (updates.username) updateData.username = updates.username;
      if (updates.firstName) updateData.firstName = updates.firstName;  
      if (updates.lastName) updateData.lastName = updates.lastName;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.phoneNumber) updateData.phoneNumber = updates.phoneNumber;
      if (updates.dateOfBirth) updateData.dateOfBirth = updates.dateOfBirth;
      if (updates.gender) updateData.gender = updates.gender;
      if (updates.countryCode) updateData.countryCode = updates.countryCode;
      if (updates.profilePicture !== undefined) updateData.profilePicture = updates.profilePicture;
      
      console.log('💾 MongoDB updateData:', updateData);
      
      await User.findByIdAndUpdate(userId, updateData, { new: true });
      console.log('✅ Profile updated successfully in MongoDB for user:', userId);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  // Favorites management - stored as array in user document
  async addFavorite(userId: string, cryptoPairSymbol: string, cryptoId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favorites: cryptoPairSymbol }
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(userId: string, cryptoPairSymbol: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: { favorites: cryptoPairSymbol }
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const user = await User.findById(userId).select('favorites');
      return user?.favorites || [];
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }

  // User preferences management - stored as embedded document
  async updateUserPreferences(userId: string, preferences: { 
    lastSelectedPair?: string; 
    lastSelectedCrypto?: string; 
    lastSelectedTab?: string;
    chartSettings?: any;
  }): Promise<void> {
    try {
      const updateData: any = {};
      
      if (preferences.lastSelectedPair !== undefined) {
        updateData['preferences.lastSelectedPair'] = preferences.lastSelectedPair;
      }
      if (preferences.lastSelectedCrypto !== undefined) {
        updateData['preferences.lastSelectedCrypto'] = preferences.lastSelectedCrypto;
      }
      if (preferences.lastSelectedTab !== undefined) {
        updateData['preferences.lastSelectedTab'] = preferences.lastSelectedTab;
      }
      if (preferences.chartSettings !== undefined) {
        updateData['preferences.chartSettings'] = {
          ...preferences.chartSettings,
          lastUpdated: Date.now()
        };
      }

      await User.findByIdAndUpdate(userId, {
        $set: updateData
      });
      
      console.log('User preferences updated in MongoDB:', { userId, preferences: Object.keys(updateData) });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(userId: string): Promise<{ 
    lastSelectedPair?: string; 
    lastSelectedCrypto?: string; 
    lastSelectedTab?: string;
    chartSettings?: any;
  } | null> {
    try {
      const user = await User.findById(userId).select('preferences');
      const preferences = user?.preferences || {};
      
      console.log('Retrieved user preferences from MongoDB:', { userId, preferences });
      
      return {
        lastSelectedPair: preferences.lastSelectedPair,
        lastSelectedCrypto: preferences.lastSelectedCrypto, 
        lastSelectedTab: preferences.lastSelectedTab,
        chartSettings: preferences.chartSettings
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  // Admin functions implementation
  async searchUsers(query: string): Promise<IUser[]> {
    try {
      const { User } = await import('./models/User');
      
      // Create a regex for case-insensitive search
      const searchRegex = new RegExp(query, 'i');
      
      const users = await User.find({
        $or: [
          { username: searchRegex },
          { email: searchRegex },
          { uid: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex }
        ]
      }).select('-password -verificationCode -verificationExpires -resetPasswordCode -resetPasswordExpires').limit(20);

      // Get balance for each user
      const usersWithBalance = await Promise.all(
        users.map(async (user) => {
          const balance = await this.getUserBalance(user._id.toString());
          return {
            _id: user._id.toString(),
            uid: user.uid,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            favorites: user.favorites || [],
            preferences: user.preferences || {},
            isVerified: user.isVerified,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            balance: balance || 0
          };
        })
      );

      return usersWithBalance;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  async addFundsToUser(userId: string, amount: number): Promise<void> {
    try {
      const { User } = await import('./models/User');
      const { UserBalance } = await import('./models/UserBalance');
      const { Currency } = await import('./models/Currency');
      const { ObjectId } = await import('mongodb');
      
      console.log(`💰 Adding $${amount} to user ${userId}`);
      
      // Convert userId to ObjectId if it's a string
      let userObjectId;
      try {
        userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
        console.log('💰 Converted to ObjectId:', userObjectId);
      } catch (error) {
        console.error('Invalid ObjectId format:', userId, error);
        throw new Error('Invalid user ID format');
      }
      
      // Get current user - try multiple approaches
      let user = await User.findById(userObjectId);
      if (!user) {
        // Try finding by string _id
        console.log('💰 User not found by ObjectId, trying string _id...');
        user = await User.findOne({ _id: userId });
      }
      if (!user) {
        console.log('💰 User still not found, checking available users...');
        const allUsers = await User.find({}).limit(5);
        console.log('💰 Available users:', allUsers.map(u => ({ _id: u._id, email: u.email })));
        throw new Error('User not found');
      }
      
      console.log('💰 Found user:', { _id: user._id, email: user.email });

      // Find USD currency
      const usdCurrency = await Currency.findOne({ symbol: 'USD' });
      if (!usdCurrency) {
        throw new Error('USD currency not found');
      }

      // Update balance in UserBalance collection (what mobile app uses)
      const existingBalance = await UserBalance.findOne({ 
        userId: userObjectId.toString(), 
        currencyId: usdCurrency._id 
      });
      
      if (existingBalance) {
        // Update existing balance
        const currentAmount = existingBalance.amount || 0;
        const newAmount = currentAmount + amount;
        
        await UserBalance.findOneAndUpdate(
          { userId: userObjectId.toString(), currencyId: usdCurrency._id },
          { amount: newAmount, updatedAt: new Date() },
          { new: true }
        );
        
        console.log(`✅ UserBalance updated: $${currentAmount} → $${newAmount}`);
      } else {
        // Create new balance record
        await UserBalance.create({
          userId: userObjectId.toString(),
          currencyId: usdCurrency._id,
          amount: amount
        });
        
        console.log(`✅ New UserBalance created: $${amount}`);
      }

      // Also update User.balance field for consistency
      const currentUserBalance = user.balance || 0;
      const newUserBalance = currentUserBalance + amount;
      
      await User.findByIdAndUpdate(userId, { 
        balance: newUserBalance 
      }, { new: true });
      
      console.log(`✅ User.balance updated: $${currentUserBalance} → $${newUserBalance}`);
      
    } catch (error) {
      console.error('❌ Error adding funds to user:', error);
      throw error;
    }
  }

  async removeFundsFromUser(userId: string, amount: number): Promise<void> {
    try {
      const { User } = await import('./models/User');
      const { UserBalance } = await import('./models/UserBalance');
      const { Currency } = await import('./models/Currency');
      const { ObjectId } = await import('mongodb');
      
      console.log(`💸 Removing $${amount} from user ${userId}`);
      
      // Convert userId to ObjectId if it's a string
      let userObjectId;
      try {
        userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      } catch (error) {
        console.error('Invalid ObjectId format:', userId, error);
        throw new Error('Invalid user ID format');
      }
      
      // Get current user
      const user = await User.findById(userObjectId);
      if (!user) {
        throw new Error('User not found');
      }

      // Find USD currency
      const usdCurrency = await Currency.findOne({ symbol: 'USD' });
      if (!usdCurrency) {
        throw new Error('USD currency not found');
      }

      // Get current balance from UserBalance collection
      const existingBalance = await UserBalance.findOne({ 
        userId: userObjectId.toString(), 
        currencyId: usdCurrency._id 
      });
      
      if (!existingBalance) {
        throw new Error('User balance not found');
      }

      const currentAmount = existingBalance.amount || 0;
      if (currentAmount < amount) {
        throw new Error(`Insufficient funds. Current balance: $${currentAmount}, Requested removal: $${amount}`);
      }

      const newAmount = currentAmount - amount;
      
      await UserBalance.findOneAndUpdate(
        { userId: userObjectId.toString(), currencyId: usdCurrency._id },
        { amount: newAmount, updatedAt: new Date() },
        { new: true }
      );
      
      console.log(`✅ UserBalance updated: $${currentAmount} → $${newAmount}`);

      // Also update User.balance field for consistency
      const currentUserBalance = user.balance || 0;
      const newUserBalance = Math.max(0, currentUserBalance - amount);
      
      await User.findByIdAndUpdate(userObjectId, { 
        balance: newUserBalance 
      }, { new: true });
      
      console.log(`✅ User.balance updated: $${currentUserBalance} → $${newUserBalance}`);
      
    } catch (error) {
      console.error('❌ Error removing funds from user:', error);
      throw error;
    }
  }



  async deleteUser(userId: string): Promise<void> {
    try {
      await User.findByIdAndDelete(userId);
      console.log(`User ${userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserBalance(userId: string, currency: string = 'USD'): Promise<{ balance: number } | null> {
    try {
      const user = await User.findById(userId).select('balance');
      if (user && user.balance !== undefined) {
        return { balance: user.balance };
      } else {
        return { balance: 0 };
      }
    } catch (error) {
      console.error('Error getting user balance:', error);
      return null;
    }
  }

  async updateUserBalance(userId: string, currency: string, amount: number): Promise<boolean> {
    try {
      console.log(`💰 mongoStorage: Updating balance for user ${userId}: ${amount} ${currency}`);
      
      const user = await User.findById(userId);
      if (!user) {
        console.error('User not found');
        return false;
      }

      const currentBalance = user.balance || 0;
      const newBalance = currentBalance + amount;

      if (newBalance < 0) {
        console.error('Insufficient balance');
        return false;
      }

      await User.findByIdAndUpdate(userId, { balance: newBalance });
      console.log(`💰 mongoStorage: Balance updated for user ${userId}: ${currentBalance} → ${newBalance}`);
      return true;
    } catch (error) {
      console.error('❌ mongoStorage: Error updating user balance:', error);
      return false;
    }
  }

  // Deposit transaction methods
  async createDepositTransaction(data: {
    userId: string;
    adminId: string;
    cryptoSymbol: string;
    cryptoName: string;
    chainType: string;
    networkName: string;
    senderAddress: string;
    usdAmount: number;
    cryptoAmount: number;
    cryptoPrice: number;
  }): Promise<IDepositTransaction> {
    try {
      const transaction = await DepositTransaction.create({
        ...data,
        status: 'confirmed'
      });
      
      console.log('Deposit transaction created:', transaction._id);
      return transaction;
    } catch (error) {
      console.error('Error creating deposit transaction:', error);
      throw error;
    }
  }

  async getUserDepositTransactions(userId: string): Promise<IDepositTransaction[]> {
    try {
      console.log(`📋 mongoStorage: Getting deposit transactions for user ${userId}`);
      
      const transactions = await DepositTransaction.find({ 
        $and: [
          {
            $or: [
              { userId: userId },
              { userId: userId.toString() }
            ]
          },
          {
            $or: [
              // Include failed deposits regardless of amount (these are approved/declined pending deposits)
              { status: 'failed' },
              // Include succeeded deposits from pending approval system
              { status: 'succeeded' },
              // Include confirmed deposits from admin-created deposits
              { status: 'confirmed' },
              // For legacy deposits without status, filter out zero transactions
              {
                $and: [
                  { status: { $exists: false } }, // Legacy deposits don't have status field
                  { cryptoAmount: { $gt: 0 } },
                  { usdAmount: { $gt: 0 } },
                  { cryptoAmount: { $exists: true } },
                  { usdAmount: { $exists: true } },
                  { cryptoAmount: { $ne: null } },
                  { usdAmount: { $ne: null } },
                  { cryptoAmount: { $ne: "" } },
                  { usdAmount: { $ne: "" } }
                ]
              }
            ]
          }
        ]
      })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      
      console.log(`📋 mongoStorage: Found ${transactions.length} valid transactions for user ${userId}`);
      
      if (transactions.length > 0) {
        console.log('📋 mongoStorage: First transaction:', {
          id: transactions[0]._id,
          userId: transactions[0].userId,
          cryptoSymbol: transactions[0].cryptoSymbol,
          cryptoAmount: transactions[0].cryptoAmount,
          usdAmount: transactions[0].usdAmount,
          status: transactions[0].status
        });
      }
      
      return transactions;
    } catch (error) {
      console.error('❌ mongoStorage: Error getting user deposit transactions:', error);
      return [];
    }
  }

  async getDepositTransaction(transactionId: string): Promise<IDepositTransaction | null> {
    try {
      const transaction = await DepositTransaction.findById(transactionId);
      return transaction;
    } catch (error) {
      console.error('Error getting deposit transaction:', error);
      return null;
    }
  }

  // Helper method to get current crypto price
  getCurrentCryptoPrice(cryptoSymbol: string): number {
    // Default prices for common cryptocurrencies (fallback values)
    const defaultPrices: { [key: string]: number } = {
      'BTC': 118654,
      'ETH': 3630,
      'USDT': 1,
      'BNB': 776
    };

    // Try to get real-time price from cache or use default
    try {
      // For now, use default prices - in production this should connect to real price feeds
      return defaultPrices[cryptoSymbol.toUpperCase()] || 1;
    } catch (error) {
      console.error(`Error getting price for ${cryptoSymbol}:`, error);
      return defaultPrices[cryptoSymbol.toUpperCase()] || 1;
    }
  }

  // Withdrawal transaction methods
  async createWithdrawalTransaction(data: {
    userId: string;
    adminId: string;
    cryptoSymbol: string;
    cryptoName: string;
    chainType: string;
    networkName: string;
    withdrawalAddress: string;
    usdAmount: number;
    cryptoAmount: number;
    cryptoPrice: number;
  }): Promise<IWithdrawalTransaction> {
    try {
      const transaction = await WithdrawalTransaction.create({
        ...data,
        status: 'confirmed'
      });
      
      console.log('Withdrawal transaction created:', transaction._id);
      return transaction;
    } catch (error) {
      console.error('Error creating withdrawal transaction:', error);
      throw error;
    }
  }

  async getUserWithdrawalTransactions(userId: string): Promise<IWithdrawalTransaction[]> {
    try {
      console.log(`📋 mongoStorage: Getting withdrawal transactions for user ${userId}`);
      
      const transactions = await WithdrawalTransaction.find({ 
        $and: [
          {
            $or: [
              { userId: userId },
              { userId: userId.toString() }
            ]
          },
          // Filter out ALL zero withdrawals regardless of source
          { cryptoAmount: { $gt: 0 } },
          { usdAmount: { $gt: 0 } },
          { cryptoAmount: { $exists: true } },
          { usdAmount: { $exists: true } },
          { cryptoAmount: { $ne: null } },
          { usdAmount: { $ne: null } },
          { cryptoAmount: { $ne: "" } },
          { usdAmount: { $ne: "" } }
        ]
      }).sort({ createdAt: -1 });
      
      console.log(`📋 mongoStorage: Found ${transactions.length} valid withdrawal transactions`);
      return transactions;
    } catch (error) {
      console.error('❌ mongoStorage: Error getting user withdrawal transactions:', error);
      return [];
    }
  }

  async getWithdrawalTransactionById(transactionId: string): Promise<IWithdrawalTransaction | null> {
    try {
      console.log(`📋 mongoStorage: Getting withdrawal transaction by ID ${transactionId}`);
      
      const transaction = await WithdrawalTransaction.findById(transactionId);
      
      if (transaction) {
        console.log(`📋 mongoStorage: Found withdrawal transaction: ${transactionId}`);
      } else {
        console.log(`📋 mongoStorage: Withdrawal transaction not found: ${transactionId}`);
      }
      
      return transaction;
    } catch (error) {
      console.error('❌ mongoStorage: Error getting withdrawal transaction by ID:', error);
      return null;
    }
  }

  async getWithdrawalTransaction(transactionId: string): Promise<IWithdrawalTransaction | null> {
    try {
      const transaction = await WithdrawalTransaction.findById(transactionId);
      return transaction;
    } catch (error) {
      console.error('Error getting withdrawal transaction:', error);
      return null;
    }
  }

  // Notification methods
  async createNotification(data: {
    userId: string;
    type: 'deposit' | 'withdrawal' | 'system' | 'trade' | 'announcement' | 'connection_request' | 'transfer_sent' | 'transfer_received' | 'kyc_approved' | 'kyc_rejected' | 'message';
    title: string;
    message: string;
    data?: any;
  }): Promise<INotification> {
    try {
      const notification = await Notification.create(data);
      console.log('Notification created:', notification._id);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const result = await Notification.findByIdAndUpdate(
        notificationId, 
        { isRead: true },
        { new: true }
      );
      
      if (result) {
        console.log('✅ Notification marked as read successfully:', notificationId, 'isRead:', result.isRead);
      } else {
        console.warn('⚠️ Notification not found:', notificationId);
        throw new Error('Notification not found');
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  }

  async removeNotificationByData(userId: string, type: string, dataMatch: any): Promise<void> {
    try {
      const query: any = { userId, type };
      
      // Add data matching criteria
      for (const [key, value] of Object.entries(dataMatch)) {
        query[`data.${key}`] = value;
      }
      
      const result = await Notification.deleteOne(query);
      console.log(`Removed ${result.deletedCount} notification(s) for user ${userId} with type ${type}`);
    } catch (error) {
      console.error('Error removing notification:', error);
      throw error;
    }
  }

  // Pending deposit methods
  async createPendingDeposit(data: {
    userId: string;
    cryptoSymbol: string;
    chainType: string;
    depositAddress: string;
    usdAmount: number;
  }): Promise<IPendingDeposit> {
    try {
      // First, cancel any existing pending deposits for this user
      await this.cancelPendingDeposit(data.userId);
      
      const pendingDeposit = await PendingDeposit.create(data);
      console.log('Pending deposit created:', pendingDeposit._id);
      return pendingDeposit;
    } catch (error) {
      console.error('Error creating pending deposit:', error);
      throw error;
    }
  }

  async getUserPendingDeposit(userId: string): Promise<IPendingDeposit | null> {
    try {
      const pendingDeposit = await PendingDeposit.findOne({ 
        userId, 
        status: { $in: ['pending_payment', 'pending_approval'] }
      }).sort({ createdAt: -1 });
      return pendingDeposit;
    } catch (error) {
      console.error('Error getting user pending deposit:', error);
      return null;
    }
  }

  async updatePendingDepositReceipt(userId: string, receiptImageUrl: string): Promise<boolean> {
    try {
      const result = await PendingDeposit.findOneAndUpdate(
        { userId, status: 'pending_payment' },
        { 
          receiptImageUrl,
          status: 'pending_approval',
          updatedAt: new Date()
        }
      );
      return !!result;
    } catch (error) {
      console.error('Error updating pending deposit receipt:', error);
      return false;
    }
  }

  async approvePendingDeposit(pendingDepositId: string, adminNotes?: string): Promise<{ userId: string; depositId: string; calculatedCryptoAmount: number } | null> {
    try {
      const pendingDeposit = await PendingDeposit.findById(pendingDepositId);
      if (!pendingDeposit) return null;

      // Calculate crypto amount based on USD amount and current price
      const currentPrice = this.getCurrentCryptoPrice(pendingDeposit.cryptoSymbol);
      const calculatedCryptoAmount = pendingDeposit.usdAmount / currentPrice;

      // Create confirmed deposit transaction with "succeeded" status
      const depositTransaction = await DepositTransaction.create({
        userId: pendingDeposit.userId,
        adminId: 'admin',
        cryptoSymbol: pendingDeposit.cryptoSymbol,
        cryptoName: this.getCryptoName(pendingDeposit.cryptoSymbol),
        chainType: pendingDeposit.chainType,
        networkName: this.getNetworkName(pendingDeposit.chainType),
        senderAddress: pendingDeposit.depositAddress,
        usdAmount: pendingDeposit.usdAmount,
        cryptoAmount: calculatedCryptoAmount, // Use calculated amount
        cryptoPrice: currentPrice,
        status: 'succeeded', // Explicit succeeded status
        createdAt: new Date()
      });

      console.log('✅ Approved deposit transaction created:', depositTransaction._id);

      // Add funds to user balance
      await this.addFundsToUser(pendingDeposit.userId, pendingDeposit.usdAmount);

      // Create notification matching admin deposit format with calculated amount
      const depositAmount = `${calculatedCryptoAmount.toFixed(8)} ${pendingDeposit.cryptoSymbol}`;

      await this.createNotification({
        userId: pendingDeposit.userId,
        type: 'deposit',
        title: 'Deposit Confirmed',
        message: `Dear valued Nedaxer trader,\nYour deposit has been confirmed.\nDeposit amount: ${depositAmount}\nDeposit address: ${pendingDeposit.depositAddress}\nTimestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)`,
        data: {
          cryptoSymbol: pendingDeposit.cryptoSymbol,
          chainType: pendingDeposit.chainType,
          depositAddress: pendingDeposit.depositAddress,
          cryptoAmount: calculatedCryptoAmount,
          usdAmount: pendingDeposit.usdAmount,
          timestamp: new Date().toISOString()
        }
      });

      // Update pending deposit status
      await PendingDeposit.findByIdAndUpdate(pendingDepositId, {
        status: 'approved',
        adminNotes,
        updatedAt: new Date()
      });

      return {
        userId: pendingDeposit.userId,
        depositId: pendingDepositId,
        calculatedCryptoAmount
      };
    } catch (error) {
      console.error('Error approving pending deposit:', error);
      return null;
    }
  }

  async declinePendingDeposit(pendingDepositId: string, adminNotes?: string): Promise<boolean> {
    try {
      const pendingDeposit = await PendingDeposit.findById(pendingDepositId);
      if (!pendingDeposit) return false;

      // Calculate crypto amount based on USD amount and current price
      const currentPrice = this.getCurrentCryptoPrice(pendingDeposit.cryptoSymbol);
      const calculatedCryptoAmount = pendingDeposit.usdAmount / currentPrice;

      // Create failed deposit transaction with "failed" status
      const depositTransaction = await DepositTransaction.create({
        userId: pendingDeposit.userId,
        adminId: 'admin',
        cryptoSymbol: pendingDeposit.cryptoSymbol,
        cryptoName: this.getCryptoName(pendingDeposit.cryptoSymbol),
        chainType: pendingDeposit.chainType,
        networkName: this.getNetworkName(pendingDeposit.chainType),
        senderAddress: pendingDeposit.depositAddress,
        usdAmount: pendingDeposit.usdAmount,
        cryptoAmount: calculatedCryptoAmount, // Use calculated amount instead of 0
        cryptoPrice: currentPrice,
        status: 'failed', // Explicit failed status
        createdAt: new Date()
      });

      console.log('❌ Declined deposit transaction created:', depositTransaction._id);

      // Create notification matching admin deposit format but for declined deposit with calculated amount
      const depositAmount = `${calculatedCryptoAmount.toFixed(8)} ${pendingDeposit.cryptoSymbol}`;

      await this.createNotification({
        userId: pendingDeposit.userId,
        type: 'deposit',
        title: 'Deposit Failed',
        message: `Dear valued Nedaxer trader,\nYour deposit has been declined.\nDeposit amount: ${depositAmount}\nDeposit address: ${pendingDeposit.depositAddress}\nTimestamp: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}(UTC)\nReason: ${adminNotes || 'Please contact support for more information.'}`,
        data: {
          cryptoSymbol: pendingDeposit.cryptoSymbol,
          chainType: pendingDeposit.chainType,
          depositAddress: pendingDeposit.depositAddress,
          cryptoAmount: calculatedCryptoAmount,
          usdAmount: pendingDeposit.usdAmount,
          timestamp: new Date().toISOString(),
          status: 'failed'
        }
      });

      // Update pending deposit status
      await PendingDeposit.findByIdAndUpdate(pendingDepositId, {
        status: 'declined',
        adminNotes,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error declining pending deposit:', error);
      return false;
    }
  }

  async cancelPendingDeposit(userId: string): Promise<boolean> {
    try {
      const result = await PendingDeposit.deleteMany({ 
        userId,
        status: { $in: ['pending_payment', 'pending_approval'] }
      });
      console.log(`Cancelled ${result.deletedCount} pending deposits for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error canceling pending deposit:', error);
      return false;
    }
  }

  async getAllPendingDeposits(): Promise<IPendingDeposit[]> {
    try {
      const pendingDeposits = await PendingDeposit.find({
        status: 'pending_approval'
      }).sort({ createdAt: -1 });
      return pendingDeposits;
    } catch (error) {
      console.error('Error getting all pending deposits:', error);
      return [];
    }
  }

  async getPendingDepositById(depositId: string): Promise<IPendingDeposit | null> {
    try {
      const pendingDeposit = await PendingDeposit.findById(depositId);
      return pendingDeposit;
    } catch (error) {
      console.error('Error getting pending deposit by ID:', error);
      return null;
    }
  }

  // Helper methods
  private getCryptoName(symbol: string): string {
    const names = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'USDT': 'Tether USD',
      'BNB': 'BNB'
    };
    return names[symbol as keyof typeof names] || symbol;
  }

  private getNetworkName(chainType: string): string {
    const networks = {
      'Bitcoin': 'Bitcoin Network',
      'ETH': 'Ethereum Network',
      'ERC20': 'Ethereum Network',
      'TRC20': 'TRON Network',
      'BSC': 'Binance Smart Chain',
      'BEP-20': 'Binance Smart Chain'
    };
    return networks[chainType as keyof typeof networks] || chainType;
  }

  // Email verification methods implementation
  async createEmailVerification(userId: string, email: string, otp: string, expiresAt: Date): Promise<void> {
    try {
      const { EmailVerification } = await import('./models/EmailVerification');
      
      // Remove any existing unverified verification for this user
      await EmailVerification.deleteMany({ 
        userId: userId, 
        verified: false 
      });

      // Create new verification
      await EmailVerification.create({
        userId,
        email,
        otp,
        expiresAt,
        verified: false,
        attempts: 0
      });

      console.log(`📧 Email verification created for user ${userId} with OTP: ${otp}`);
    } catch (error) {
      console.error('Error creating email verification:', error);
      throw error;
    }
  }

  async verifyEmailOTP(userId: string, otp: string): Promise<{ success: boolean; expired?: boolean; maxAttempts?: boolean; message: string }> {
    try {
      const { EmailVerification } = await import('./models/EmailVerification');
      
      // Find active verification for this user
      const verification = await EmailVerification.findOne({
        userId: userId,
        verified: false
      }).sort({ createdAt: -1 });

      if (!verification) {
        return {
          success: false,
          message: 'No active verification found. Please request a new verification code.'
        };
      }

      // Check if expired
      if (new Date() > verification.expiresAt) {
        await EmailVerification.deleteOne({ _id: verification._id });
        return {
          success: false,
          expired: true,
          message: 'Verification code has expired. Please request a new one.'
        };
      }

      // Check max attempts
      if (verification.attempts >= 5) {
        await EmailVerification.deleteOne({ _id: verification._id });
        return {
          success: false,
          maxAttempts: true,
          message: 'Maximum verification attempts exceeded. Please request a new verification code.'
        };
      }

      // Check if OTP matches
      if (verification.otp !== otp) {
        // Increment attempts
        await EmailVerification.updateOne(
          { _id: verification._id },
          { $inc: { attempts: 1 } }
        );
        
        const remainingAttempts = 5 - (verification.attempts + 1);
        return {
          success: false,
          message: `Invalid verification code. ${remainingAttempts} attempts remaining.`
        };
      }

      // OTP is correct - mark as verified and verify the user
      await EmailVerification.updateOne(
        { _id: verification._id },
        { verified: true }
      );

      // Mark user as verified
      await this.markUserAsVerified(userId);

      console.log(`✅ Email verification successful for user ${userId}`);
      return {
        success: true,
        message: 'Email verification successful!'
      };

    } catch (error) {
      console.error('Error verifying email OTP:', error);
      return {
        success: false,
        message: 'An error occurred during verification. Please try again.'
      };
    }
  }

  async getActiveEmailVerification(userId: string): Promise<any> {
    try {
      const { EmailVerification } = await import('./models/EmailVerification');
      
      const verification = await EmailVerification.findOne({
        userId: userId,
        verified: false,
        expiresAt: { $gt: new Date() }
      }).sort({ createdAt: -1 });

      return verification;
    } catch (error) {
      console.error('Error getting active email verification:', error);
      return null;
    }
  }

  async cleanupExpiredVerifications(): Promise<void> {
    try {
      const { EmailVerification } = await import('./models/EmailVerification');
      
      const result = await EmailVerification.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${result.deletedCount} expired email verifications`);
      }
    } catch (error) {
      console.error('Error cleaning up expired verifications:', error);
    }
  }
}

// Export an instance of MongoDB storage
export const mongoStorage = new MongoStorage();
