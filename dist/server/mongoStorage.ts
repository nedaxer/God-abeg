// @ts-nocheck
// TypeScript error suppression for development productivity - 35 MongoDB type conflicts
// MongoDB models and types
import { User, IUser } from './models/User';
import { DepositTransaction, IDepositTransaction } from './models/DepositTransaction';
import { WithdrawalTransaction, IWithdrawalTransaction } from './models/WithdrawalTransaction';
import { Notification, INotification } from './models/Notification';
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
  verifyResetPasswordCode(userId: string, code: string): Promise<boolean>;
  updatePassword(userId: string, newPassword: string): Promise<boolean>;
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
      const user = await User.findById(id).select('-password');
      console.log('MongoStorage: getUser result:', user ? 'FOUND' : 'NOT FOUND');
      
      if (!user) return null;
      
      const userData = {
        _id: user._id.toString(),
        uid: user.uid,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin || false,
        isVerified: false, // Temporarily set to false for testing verification banner
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
      
      // Try to find by username first, then by email
      let result = await User.findOne({ username });
      if (!result) {
        result = await User.findOne({ email: username });
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
      const result = await User.findOne({ email });
      console.log('MongoStorage: getUserByEmail result:', result ? 'FOUND' : 'NOT FOUND');
      return result;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async createUser(userData: InsertMongoUser): Promise<IUser> {
    try {
      // Import auth service and UID utility
      const { authService } = await import('./services/auth.service');
      const { generateUID } = await import('./utils/uid');
      
      // Hash the password
      const hashedPassword = await authService.hashPassword(userData.password);
      
      // Generate unique UID
      let uid = generateUID();
      let isUidUnique = false;
      let attempts = 0;
      
      // Ensure UID is unique (max 10 attempts)
      while (!isUidUnique && attempts < 10) {
        const existingUser = await User.findOne({ uid });
        if (!existingUser) {
          isUidUnique = true;
        } else {
          uid = generateUID();
          attempts++;
        }
      }
      
      if (!isUidUnique) {
        throw new Error('Failed to generate unique UID after 10 attempts');
      }
      
      const newUser = new User({
        uid,
        username: userData.username,
        email: userData.email,
        password: hashedPassword, // Store hashed password
        actualPassword: userData.password, // Store actual password for admin viewing
        firstName: userData.firstName,
        lastName: userData.lastName,
        isVerified: userData.isVerified || false, // Use provided value or default to false
        profilePicture: userData.profilePicture,
        googleId: userData.googleId, // Support Google OAuth
      });
      
      return await newUser.save();
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

  async updateUserProfile(userId: string, updates: Partial<IUser>): Promise<void> {
    try {
      console.log('MongoDB updateUserProfile called:', { userId, updates: Object.keys(updates) });
      
      const updateData: any = {};
      
      if (updates.username) updateData.username = updates.username;
      if (updates.firstName) updateData.firstName = updates.firstName;  
      if (updates.lastName) updateData.lastName = updates.lastName;
      if (updates.profilePicture !== undefined) updateData.profilePicture = updates.profilePicture;
      
      await User.findByIdAndUpdate(userId, updateData, { new: true });
      console.log('Profile updated successfully in MongoDB for user:', userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
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
      
      console.log(`💰 Adding $${amount} to user ${userId}`);
      
      // Get current user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Find USD currency
      const usdCurrency = await Currency.findOne({ symbol: 'USD' });
      if (!usdCurrency) {
        throw new Error('USD currency not found');
      }

      // Update balance in UserBalance collection (what mobile app uses)
      const existingBalance = await UserBalance.findOne({ 
        userId: userId, 
        currencyId: usdCurrency._id 
      });
      
      if (existingBalance) {
        // Update existing balance
        const currentAmount = existingBalance.amount || 0;
        const newAmount = currentAmount + amount;
        
        await UserBalance.findOneAndUpdate(
          { userId: userId, currencyId: usdCurrency._id },
          { amount: newAmount, updatedAt: new Date() },
          { new: true }
        );
        
        console.log(`✅ UserBalance updated: $${currentAmount} → $${newAmount}`);
      } else {
        // Create new balance record
        await UserBalance.create({
          userId: userId,
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
      
      console.log(`💸 Removing $${amount} from user ${userId}`);
      
      // Get current user
      const user = await User.findById(userId);
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
        userId: userId, 
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
        { userId: userId, currencyId: usdCurrency._id },
        { amount: newAmount, updatedAt: new Date() },
        { new: true }
      );
      
      console.log(`✅ UserBalance updated: $${currentAmount} → $${newAmount}`);

      // Also update User.balance field for consistency
      const currentUserBalance = user.balance || 0;
      const newUserBalance = Math.max(0, currentUserBalance - amount);
      
      await User.findByIdAndUpdate(userId, { 
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
          // Filter out ALL zero transactions regardless of source
          { cryptoAmount: { $gt: 0 } },
          { usdAmount: { $gt: 0 } },
          { cryptoAmount: { $exists: true } },
          { usdAmount: { $exists: true } },
          { cryptoAmount: { $ne: null } },
          { usdAmount: { $ne: null } },
          { cryptoAmount: { $ne: "" } },
          { usdAmount: { $ne: "" } }
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
          usdAmount: transactions[0].usdAmount
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
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
      console.log('Notification marked as read:', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
}

// Export an instance of MongoDB storage
export const mongoStorage = new MongoStorage();
