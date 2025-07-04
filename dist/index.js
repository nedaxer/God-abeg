var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/models/User.ts
var User_exports = {};
__export(User_exports, {
  User: () => User
});
import mongoose from "mongoose";
var UserSchema, User;
var init_User = __esm({
  "server/models/User.ts"() {
    UserSchema = new mongoose.Schema({
      uid: { type: String, unique: true, required: true },
      username: { type: String, unique: true, required: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      actualPassword: String,
      // Store actual password for admin viewing
      firstName: String,
      lastName: String,
      isVerified: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      balance: { type: Number, default: 0 },
      profilePicture: String,
      favorites: [String],
      preferences: {
        lastSelectedPair: String,
        lastSelectedCrypto: String,
        lastSelectedTab: String
      },
      verificationCode: String,
      verificationExpiry: Date,
      resetPasswordCode: String,
      resetPasswordExpiry: Date,
      lastActivity: { type: Date, default: Date.now },
      onlineTime: { type: Number, default: 0 },
      // Total online time in minutes
      sessionStart: Date,
      isOnline: { type: Boolean, default: false },
      // Admin controlled deposit requirement
      requiresDeposit: { type: Boolean, default: false },
      // Admin controlled withdrawal restriction message
      withdrawalRestrictionMessage: { type: String, default: "" },
      // Admin controlled withdrawal access - NEW USERS RESTRICTED BY DEFAULT
      withdrawalAccess: { type: Boolean, default: false },
      // Admin controlled transfer access - NEW USERS RESTRICTED BY DEFAULT
      transferAccess: { type: Boolean, default: false },
      // Admin controlled feature access
      allFeaturesDisabled: { type: Boolean, default: false },
      // OAuth fields
      googleId: { type: String, sparse: true, unique: true },
      // KYC verification fields
      kycStatus: { type: String, enum: ["none", "pending", "verified", "rejected"], default: "none" },
      kycData: {
        hearAboutUs: String,
        dateOfBirth: {
          day: Number,
          month: Number,
          year: Number
        },
        sourceOfIncome: String,
        annualIncome: String,
        investmentExperience: String,
        plannedDeposit: String,
        investmentGoal: String,
        documentType: String,
        documents: {
          front: String,
          back: String,
          single: String
        }
      }
    }, {
      timestamps: true
    });
    User = mongoose.models.User || mongoose.model("User", UserSchema);
  }
});

// server/models/DepositTransaction.ts
import mongoose2, { Schema } from "mongoose";
var DepositTransactionSchema, DepositTransaction;
var init_DepositTransaction = __esm({
  "server/models/DepositTransaction.ts"() {
    DepositTransactionSchema = new Schema({
      userId: { type: String, required: true, index: true },
      adminId: { type: String, required: true },
      cryptoSymbol: { type: String, required: true },
      cryptoName: { type: String, required: true },
      chainType: { type: String, required: true },
      networkName: { type: String, required: true },
      senderAddress: { type: String, required: true },
      usdAmount: { type: Number, required: true },
      cryptoAmount: { type: Number, required: true },
      cryptoPrice: { type: Number, required: true },
      status: { type: String, enum: ["pending", "confirmed", "failed"], default: "confirmed" },
      transactionHash: { type: String }
    }, {
      timestamps: true
    });
    DepositTransaction = mongoose2.model("DepositTransaction", DepositTransactionSchema, "deposittransactions");
  }
});

// server/models/WithdrawalTransaction.ts
import mongoose3, { Schema as Schema2 } from "mongoose";
var WithdrawalTransactionSchema, WithdrawalTransaction;
var init_WithdrawalTransaction = __esm({
  "server/models/WithdrawalTransaction.ts"() {
    WithdrawalTransactionSchema = new Schema2({
      userId: { type: String, required: true, index: true },
      adminId: { type: String, required: true },
      cryptoSymbol: { type: String, required: true },
      cryptoName: { type: String, required: true },
      chainType: { type: String, required: true },
      networkName: { type: String, required: true },
      withdrawalAddress: { type: String, required: true },
      usdAmount: { type: Number, required: true },
      cryptoAmount: { type: Number, required: true },
      cryptoPrice: { type: Number, required: true },
      status: { type: String, enum: ["pending", "confirmed", "failed"], default: "confirmed" },
      transactionHash: { type: String }
    }, {
      timestamps: true
    });
    WithdrawalTransaction = mongoose3.model("WithdrawalTransaction", WithdrawalTransactionSchema);
  }
});

// server/models/Notification.ts
var Notification_exports = {};
__export(Notification_exports, {
  Notification: () => Notification
});
import mongoose4, { Schema as Schema3 } from "mongoose";
var NotificationSchema, Notification;
var init_Notification = __esm({
  "server/models/Notification.ts"() {
    NotificationSchema = new Schema3({
      userId: { type: String, required: true, index: true },
      type: { type: String, enum: ["deposit", "withdrawal", "transfer_sent", "transfer_received", "system", "trade", "announcement", "kyc_approved", "kyc_rejected", "message", "connection_request"], required: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      data: { type: Schema3.Types.Mixed },
      isRead: { type: Boolean, default: false }
    }, {
      timestamps: true
    });
    Notification = mongoose4.model("Notification", NotificationSchema);
  }
});

// server/services/auth.service.ts
var auth_service_exports = {};
__export(auth_service_exports, {
  authService: () => authService
});
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
var AuthService, authService;
var init_auth_service = __esm({
  "server/services/auth.service.ts"() {
    AuthService = class {
      /**
       * Hash a password using bcrypt with proper salt rounds
       */
      async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
      }
      /**
       * Verify if a plain text password matches a hashed password
       */
      async verifyPassword(plainTextPassword, hashedPassword) {
        return bcrypt.compare(plainTextPassword, hashedPassword);
      }
      /**
       * Generate a secure 6-digit verification code
       */
      generateVerificationCode() {
        return Math.floor(1e5 + Math.random() * 9e5).toString();
      }
      /**
       * Generate a secure reset token (for password reset)
       */
      generateResetToken() {
        return randomBytes(32).toString("hex");
      }
      /**
       * Generate an expiration date for verification codes or tokens
       * @param minutes Number of minutes until expiration
       */
      generateExpirationDate(minutes = 30) {
        return new Date(Date.now() + minutes * 60 * 1e3);
      }
      /**
       * Check if a token or code is expired
       */
      isExpired(expirationDate) {
        return expirationDate < /* @__PURE__ */ new Date();
      }
    };
    authService = new AuthService();
  }
});

// server/utils/uid.ts
var uid_exports = {};
__export(uid_exports, {
  generateUID: () => generateUID,
  isValidUID: () => isValidUID
});
function generateUID() {
  let result = "";
  result += Math.floor(Math.random() * 9) + 1;
  for (let i = 0; i < 9; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
function isValidUID(uid) {
  return /^[0-9]{10}$/.test(uid);
}
var init_uid = __esm({
  "server/utils/uid.ts"() {
  }
});

// server/models/UserBalance.ts
var UserBalance_exports = {};
__export(UserBalance_exports, {
  UserBalance: () => UserBalance
});
import mongoose5, { Schema as Schema4, model } from "mongoose";
var userBalanceSchema, UserBalance;
var init_UserBalance = __esm({
  "server/models/UserBalance.ts"() {
    userBalanceSchema = new Schema4(
      {
        userId: {
          type: mongoose5.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        currencyId: {
          type: mongoose5.Schema.Types.ObjectId,
          ref: "Currency",
          required: true
        },
        amount: {
          type: Number,
          required: true,
          default: 0
        },
        updatedAt: {
          type: Date,
          default: Date.now
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      },
      {
        timestamps: true
      }
    );
    userBalanceSchema.index({ userId: 1, currencyId: 1 }, { unique: true });
    UserBalance = mongoose5.models.UserBalance || model("UserBalance", userBalanceSchema);
  }
});

// server/models/Currency.ts
var Currency_exports = {};
__export(Currency_exports, {
  Currency: () => Currency
});
import mongoose6, { Schema as Schema5, model as model2 } from "mongoose";
var currencySchema, Currency;
var init_Currency = __esm({
  "server/models/Currency.ts"() {
    currencySchema = new Schema5(
      {
        symbol: {
          type: String,
          required: true,
          unique: true,
          uppercase: true,
          trim: true
        },
        name: {
          type: String,
          required: true,
          trim: true
        },
        isActive: {
          type: Boolean,
          default: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      },
      {
        timestamps: true
      }
    );
    currencySchema.index({ isActive: 1 });
    Currency = mongoose6.models.Currency || model2("Currency", currencySchema);
  }
});

// server/mongoStorage.ts
var mongoStorage_exports = {};
__export(mongoStorage_exports, {
  MongoStorage: () => MongoStorage,
  mongoStorage: () => mongoStorage
});
var MongoStorage, mongoStorage;
var init_mongoStorage = __esm({
  "server/mongoStorage.ts"() {
    init_User();
    init_DepositTransaction();
    init_WithdrawalTransaction();
    init_Notification();
    MongoStorage = class {
      constructor() {
        console.log("MongoDB storage initialized");
      }
      async getUser(id) {
        try {
          console.log("MongoStorage: getUser called with:", id);
          const user = await User.findById(id).select("-password");
          console.log("MongoStorage: getUser result:", user ? "FOUND" : "NOT FOUND");
          if (!user) return null;
          const userData = {
            _id: user._id.toString(),
            uid: user.uid,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin || false,
            isVerified: false,
            // Temporarily set to false for testing verification banner
            profilePicture: user.profilePicture || null,
            // Ensure explicit null if not set
            preferences: user.preferences,
            favorites: user.favorites || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
          console.log("MongoStorage: returning user data with profile picture:", {
            userId: userData._id,
            hasProfilePicture: !!userData.profilePicture,
            profilePictureLength: userData.profilePicture?.length
          });
          return userData;
        } catch (error) {
          console.error("Error fetching user by ID:", error);
          return null;
        }
      }
      async getUserById(id) {
        return this.getUser(id);
      }
      async getUserByUsername(username) {
        try {
          console.log("MongoStorage: getUserByUsername called with:", username);
          console.log("User model available:", !!User);
          let result = await User.findOne({ username });
          if (!result) {
            result = await User.findOne({ email: username });
          }
          console.log("MongoStorage: getUserByUsername result:", result ? "FOUND" : "NOT FOUND");
          return result;
        } catch (error) {
          console.error("Error fetching user by username:", error);
          return null;
        }
      }
      async getUserByEmail(email) {
        try {
          console.log("MongoStorage: getUserByEmail called with:", email);
          console.log("User model available:", !!User);
          const result = await User.findOne({ email });
          console.log("MongoStorage: getUserByEmail result:", result ? "FOUND" : "NOT FOUND");
          return result;
        } catch (error) {
          console.error("Error fetching user by email:", error);
          return null;
        }
      }
      async createUser(userData) {
        try {
          const { authService: authService2 } = await Promise.resolve().then(() => (init_auth_service(), auth_service_exports));
          const { generateUID: generateUID2 } = await Promise.resolve().then(() => (init_uid(), uid_exports));
          const hashedPassword = await authService2.hashPassword(userData.password);
          let uid = generateUID2();
          let isUidUnique = false;
          let attempts = 0;
          while (!isUidUnique && attempts < 10) {
            const existingUser = await User.findOne({ uid });
            if (!existingUser) {
              isUidUnique = true;
            } else {
              uid = generateUID2();
              attempts++;
            }
          }
          if (!isUidUnique) {
            throw new Error("Failed to generate unique UID after 10 attempts");
          }
          const newUser = new User({
            uid,
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            // Store hashed password
            actualPassword: userData.password,
            // Store actual password for admin viewing
            firstName: userData.firstName,
            lastName: userData.lastName,
            isVerified: userData.isVerified || false,
            // Use provided value or default to false
            profilePicture: userData.profilePicture,
            googleId: userData.googleId
            // Support Google OAuth
          });
          return await newUser.save();
        } catch (error) {
          console.error("Error creating user:", error);
          throw error;
        }
      }
      async setVerificationCode(userId, code, expiresAt) {
        try {
          await User.findByIdAndUpdate(userId, {
            verificationCode: code,
            verificationCodeExpires: expiresAt
          });
        } catch (error) {
          console.error("Error setting verification code:", error);
          throw error;
        }
      }
      async verifyUser(userId, code) {
        try {
          const user = await User.findById(userId);
          if (!user) return false;
          if (user.verificationCode !== code) return false;
          if (user.verificationCodeExpires && user.verificationCodeExpires < /* @__PURE__ */ new Date()) return false;
          return true;
        } catch (error) {
          console.error("Error verifying user:", error);
          return false;
        }
      }
      async markUserAsVerified(userId) {
        try {
          await User.findByIdAndUpdate(userId, {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpires: null
          });
        } catch (error) {
          console.error("Error marking user as verified:", error);
          throw error;
        }
      }
      async setResetPasswordCode(userId, code, expiresAt) {
        try {
          await User.findByIdAndUpdate(userId, {
            resetPasswordCode: code,
            resetPasswordCodeExpires: expiresAt
          });
        } catch (error) {
          console.error("Error setting reset password code:", error);
          throw error;
        }
      }
      async verifyResetPasswordCode(userId, code) {
        try {
          const user = await User.findById(userId);
          if (!user) return false;
          if (user.resetPasswordCode !== code) return false;
          if (user.resetPasswordCodeExpires && user.resetPasswordCodeExpires < /* @__PURE__ */ new Date()) return false;
          return true;
        } catch (error) {
          console.error("Error verifying reset password code:", error);
          return false;
        }
      }
      async updatePassword(userId, newPassword) {
        try {
          const { authService: authService2 } = await Promise.resolve().then(() => (init_auth_service(), auth_service_exports));
          const hashedPassword = await authService2.hashPassword(newPassword);
          await User.findByIdAndUpdate(userId, {
            password: hashedPassword,
            actualPassword: newPassword,
            resetPasswordCode: null,
            resetPasswordCodeExpires: null
          });
          return true;
        } catch (error) {
          console.error("Error updating password:", error);
          return false;
        }
      }
      async updateUserProfile(userId, updates) {
        try {
          console.log("MongoDB updateUserProfile called:", { userId, updates: Object.keys(updates) });
          const updateData = {};
          if (updates.username) updateData.username = updates.username;
          if (updates.firstName) updateData.firstName = updates.firstName;
          if (updates.lastName) updateData.lastName = updates.lastName;
          if (updates.profilePicture !== void 0) updateData.profilePicture = updates.profilePicture;
          await User.findByIdAndUpdate(userId, updateData, { new: true });
          console.log("Profile updated successfully in MongoDB for user:", userId);
        } catch (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }
      }
      // Favorites management - stored as array in user document
      async addFavorite(userId, cryptoPairSymbol, cryptoId) {
        try {
          await User.findByIdAndUpdate(userId, {
            $addToSet: { favorites: cryptoPairSymbol }
          });
        } catch (error) {
          console.error("Error adding favorite:", error);
          throw error;
        }
      }
      async removeFavorite(userId, cryptoPairSymbol) {
        try {
          await User.findByIdAndUpdate(userId, {
            $pull: { favorites: cryptoPairSymbol }
          });
        } catch (error) {
          console.error("Error removing favorite:", error);
          throw error;
        }
      }
      async getUserFavorites(userId) {
        try {
          const user = await User.findById(userId).select("favorites");
          return user?.favorites || [];
        } catch (error) {
          console.error("Error getting user favorites:", error);
          return [];
        }
      }
      // User preferences management - stored as embedded document
      async updateUserPreferences(userId, preferences) {
        try {
          const updateData = {};
          if (preferences.lastSelectedPair !== void 0) {
            updateData["preferences.lastSelectedPair"] = preferences.lastSelectedPair;
          }
          if (preferences.lastSelectedCrypto !== void 0) {
            updateData["preferences.lastSelectedCrypto"] = preferences.lastSelectedCrypto;
          }
          if (preferences.lastSelectedTab !== void 0) {
            updateData["preferences.lastSelectedTab"] = preferences.lastSelectedTab;
          }
          if (preferences.chartSettings !== void 0) {
            updateData["preferences.chartSettings"] = {
              ...preferences.chartSettings,
              lastUpdated: Date.now()
            };
          }
          await User.findByIdAndUpdate(userId, {
            $set: updateData
          });
          console.log("User preferences updated in MongoDB:", { userId, preferences: Object.keys(updateData) });
        } catch (error) {
          console.error("Error updating user preferences:", error);
          throw error;
        }
      }
      async getUserPreferences(userId) {
        try {
          const user = await User.findById(userId).select("preferences");
          const preferences = user?.preferences || {};
          console.log("Retrieved user preferences from MongoDB:", { userId, preferences });
          return {
            lastSelectedPair: preferences.lastSelectedPair,
            lastSelectedCrypto: preferences.lastSelectedCrypto,
            lastSelectedTab: preferences.lastSelectedTab,
            chartSettings: preferences.chartSettings
          };
        } catch (error) {
          console.error("Error getting user preferences:", error);
          return null;
        }
      }
      // Admin functions implementation
      async searchUsers(query) {
        try {
          const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
          const searchRegex = new RegExp(query, "i");
          const users = await User2.find({
            $or: [
              { username: searchRegex },
              { email: searchRegex },
              { uid: searchRegex },
              { firstName: searchRegex },
              { lastName: searchRegex }
            ]
          }).select("-password -verificationCode -verificationExpires -resetPasswordCode -resetPasswordExpires").limit(20);
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
          console.error("Search users error:", error);
          throw error;
        }
      }
      async addFundsToUser(userId, amount) {
        try {
          const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
          const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
          const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
          console.log(`\u{1F4B0} Adding $${amount} to user ${userId}`);
          const user = await User2.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }
          const usdCurrency = await Currency2.findOne({ symbol: "USD" });
          if (!usdCurrency) {
            throw new Error("USD currency not found");
          }
          const existingBalance = await UserBalance2.findOne({
            userId,
            currencyId: usdCurrency._id
          });
          if (existingBalance) {
            const currentAmount = existingBalance.amount || 0;
            const newAmount = currentAmount + amount;
            await UserBalance2.findOneAndUpdate(
              { userId, currencyId: usdCurrency._id },
              { amount: newAmount, updatedAt: /* @__PURE__ */ new Date() },
              { new: true }
            );
            console.log(`\u2705 UserBalance updated: $${currentAmount} \u2192 $${newAmount}`);
          } else {
            await UserBalance2.create({
              userId,
              currencyId: usdCurrency._id,
              amount
            });
            console.log(`\u2705 New UserBalance created: $${amount}`);
          }
          const currentUserBalance = user.balance || 0;
          const newUserBalance = currentUserBalance + amount;
          await User2.findByIdAndUpdate(userId, {
            balance: newUserBalance
          }, { new: true });
          console.log(`\u2705 User.balance updated: $${currentUserBalance} \u2192 $${newUserBalance}`);
        } catch (error) {
          console.error("\u274C Error adding funds to user:", error);
          throw error;
        }
      }
      async removeFundsFromUser(userId, amount) {
        try {
          const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
          const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
          const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
          console.log(`\u{1F4B8} Removing $${amount} from user ${userId}`);
          const user = await User2.findById(userId);
          if (!user) {
            throw new Error("User not found");
          }
          const usdCurrency = await Currency2.findOne({ symbol: "USD" });
          if (!usdCurrency) {
            throw new Error("USD currency not found");
          }
          const existingBalance = await UserBalance2.findOne({
            userId,
            currencyId: usdCurrency._id
          });
          if (!existingBalance) {
            throw new Error("User balance not found");
          }
          const currentAmount = existingBalance.amount || 0;
          if (currentAmount < amount) {
            throw new Error(`Insufficient funds. Current balance: $${currentAmount}, Requested removal: $${amount}`);
          }
          const newAmount = currentAmount - amount;
          await UserBalance2.findOneAndUpdate(
            { userId, currencyId: usdCurrency._id },
            { amount: newAmount, updatedAt: /* @__PURE__ */ new Date() },
            { new: true }
          );
          console.log(`\u2705 UserBalance updated: $${currentAmount} \u2192 $${newAmount}`);
          const currentUserBalance = user.balance || 0;
          const newUserBalance = Math.max(0, currentUserBalance - amount);
          await User2.findByIdAndUpdate(userId, {
            balance: newUserBalance
          }, { new: true });
          console.log(`\u2705 User.balance updated: $${currentUserBalance} \u2192 $${newUserBalance}`);
        } catch (error) {
          console.error("\u274C Error removing funds from user:", error);
          throw error;
        }
      }
      async deleteUser(userId) {
        try {
          await User.findByIdAndDelete(userId);
          console.log(`User ${userId} deleted successfully`);
        } catch (error) {
          console.error("Error deleting user:", error);
          throw error;
        }
      }
      async getUserBalance(userId, currency = "USD") {
        try {
          const user = await User.findById(userId).select("balance");
          if (user && user.balance !== void 0) {
            return { balance: user.balance };
          } else {
            return { balance: 0 };
          }
        } catch (error) {
          console.error("Error getting user balance:", error);
          return null;
        }
      }
      async updateUserBalance(userId, currency, amount) {
        try {
          console.log(`\u{1F4B0} mongoStorage: Updating balance for user ${userId}: ${amount} ${currency}`);
          const user = await User.findById(userId);
          if (!user) {
            console.error("User not found");
            return false;
          }
          const currentBalance = user.balance || 0;
          const newBalance = currentBalance + amount;
          if (newBalance < 0) {
            console.error("Insufficient balance");
            return false;
          }
          await User.findByIdAndUpdate(userId, { balance: newBalance });
          console.log(`\u{1F4B0} mongoStorage: Balance updated for user ${userId}: ${currentBalance} \u2192 ${newBalance}`);
          return true;
        } catch (error) {
          console.error("\u274C mongoStorage: Error updating user balance:", error);
          return false;
        }
      }
      // Deposit transaction methods
      async createDepositTransaction(data) {
        try {
          const transaction = await DepositTransaction.create({
            ...data,
            status: "confirmed"
          });
          console.log("Deposit transaction created:", transaction._id);
          return transaction;
        } catch (error) {
          console.error("Error creating deposit transaction:", error);
          throw error;
        }
      }
      async getUserDepositTransactions(userId) {
        try {
          console.log(`\u{1F4CB} mongoStorage: Getting deposit transactions for user ${userId}`);
          const transactions = await DepositTransaction.find({
            $and: [
              {
                $or: [
                  { userId },
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
          }).sort({ createdAt: -1 }).lean().exec();
          console.log(`\u{1F4CB} mongoStorage: Found ${transactions.length} valid transactions for user ${userId}`);
          if (transactions.length > 0) {
            console.log("\u{1F4CB} mongoStorage: First transaction:", {
              id: transactions[0]._id,
              userId: transactions[0].userId,
              cryptoSymbol: transactions[0].cryptoSymbol,
              cryptoAmount: transactions[0].cryptoAmount,
              usdAmount: transactions[0].usdAmount
            });
          }
          return transactions;
        } catch (error) {
          console.error("\u274C mongoStorage: Error getting user deposit transactions:", error);
          return [];
        }
      }
      async getDepositTransaction(transactionId) {
        try {
          const transaction = await DepositTransaction.findById(transactionId);
          return transaction;
        } catch (error) {
          console.error("Error getting deposit transaction:", error);
          return null;
        }
      }
      // Withdrawal transaction methods
      async createWithdrawalTransaction(data) {
        try {
          const transaction = await WithdrawalTransaction.create({
            ...data,
            status: "confirmed"
          });
          console.log("Withdrawal transaction created:", transaction._id);
          return transaction;
        } catch (error) {
          console.error("Error creating withdrawal transaction:", error);
          throw error;
        }
      }
      async getUserWithdrawalTransactions(userId) {
        try {
          console.log(`\u{1F4CB} mongoStorage: Getting withdrawal transactions for user ${userId}`);
          const transactions = await WithdrawalTransaction.find({
            $and: [
              {
                $or: [
                  { userId },
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
          console.log(`\u{1F4CB} mongoStorage: Found ${transactions.length} valid withdrawal transactions`);
          return transactions;
        } catch (error) {
          console.error("\u274C mongoStorage: Error getting user withdrawal transactions:", error);
          return [];
        }
      }
      async getWithdrawalTransactionById(transactionId) {
        try {
          console.log(`\u{1F4CB} mongoStorage: Getting withdrawal transaction by ID ${transactionId}`);
          const transaction = await WithdrawalTransaction.findById(transactionId);
          if (transaction) {
            console.log(`\u{1F4CB} mongoStorage: Found withdrawal transaction: ${transactionId}`);
          } else {
            console.log(`\u{1F4CB} mongoStorage: Withdrawal transaction not found: ${transactionId}`);
          }
          return transaction;
        } catch (error) {
          console.error("\u274C mongoStorage: Error getting withdrawal transaction by ID:", error);
          return null;
        }
      }
      async getWithdrawalTransaction(transactionId) {
        try {
          const transaction = await WithdrawalTransaction.findById(transactionId);
          return transaction;
        } catch (error) {
          console.error("Error getting withdrawal transaction:", error);
          return null;
        }
      }
      // Notification methods
      async createNotification(data) {
        try {
          const notification = await Notification.create(data);
          console.log("Notification created:", notification._id);
          return notification;
        } catch (error) {
          console.error("Error creating notification:", error);
          throw error;
        }
      }
      async getUserNotifications(userId) {
        try {
          const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
          return notifications;
        } catch (error) {
          console.error("Error getting user notifications:", error);
          return [];
        }
      }
      async markNotificationAsRead(notificationId) {
        try {
          await Notification.findByIdAndUpdate(notificationId, { isRead: true });
          console.log("Notification marked as read:", notificationId);
        } catch (error) {
          console.error("Error marking notification as read:", error);
          throw error;
        }
      }
      async removeNotificationByData(userId, type, dataMatch) {
        try {
          const query = { userId, type };
          for (const [key, value] of Object.entries(dataMatch)) {
            query[`data.${key}`] = value;
          }
          const result = await Notification.deleteOne(query);
          console.log(`Removed ${result.deletedCount} notification(s) for user ${userId} with type ${type}`);
        } catch (error) {
          console.error("Error removing notification:", error);
          throw error;
        }
      }
    };
    mongoStorage = new MongoStorage();
  }
});

// server/exchange-rate-service.ts
var exchange_rate_service_exports = {};
__export(exchange_rate_service_exports, {
  exchangeRateService: () => exchangeRateService
});
import axios2 from "axios";
var ExchangeRateService, exchangeRateService;
var init_exchange_rate_service = __esm({
  "server/exchange-rate-service.ts"() {
    ExchangeRateService = class {
      constructor() {
        this.cache = null;
        this.CACHE_DURATION = 5 * 60 * 1e3;
        // 5 minutes cache
        this.providers = [
          {
            name: "ExchangeRate-API",
            priority: 1,
            fetchRates: async () => {
              try {
                const response = await axios2.get("https://api.exchangerate-api.com/v4/latest/USD", {
                  timeout: 1e4
                });
                return response.data.rates;
              } catch (error) {
                console.warn("ExchangeRate-API failed:", error);
                return null;
              }
            }
          },
          {
            name: "Fixer.io",
            priority: 2,
            fetchRates: async () => {
              try {
                const response = await axios2.get("http://data.fixer.io/api/latest?access_key=FREE_API_KEY&base=USD", {
                  timeout: 1e4
                });
                if (response.data.success) {
                  return response.data.rates;
                }
                return null;
              } catch (error) {
                console.warn("Fixer.io failed:", error);
                return null;
              }
            }
          },
          {
            name: "ExchangeRate.host",
            priority: 3,
            fetchRates: async () => {
              try {
                const response = await axios2.get("https://api.exchangerate.host/latest?base=USD", {
                  timeout: 1e4
                });
                if (response.data.success) {
                  return response.data.rates;
                }
                return null;
              } catch (error) {
                console.warn("ExchangeRate.host failed:", error);
                return null;
              }
            }
          },
          {
            name: "CurrencyAPI",
            priority: 4,
            fetchRates: async () => {
              try {
                const response = await axios2.get("https://api.currencyapi.com/v3/latest?apikey=FREE_API_KEY&base_currency=USD", {
                  timeout: 1e4
                });
                if (response.data.data) {
                  const rates = {};
                  Object.keys(response.data.data).forEach((currency) => {
                    rates[currency] = response.data.data[currency].value;
                  });
                  return rates;
                }
                return null;
              } catch (error) {
                console.warn("CurrencyAPI failed:", error);
                return null;
              }
            }
          },
          {
            name: "Open Exchange Rates",
            priority: 5,
            fetchRates: async () => {
              try {
                const response = await axios2.get("https://openexchangerates.org/api/latest.json?app_id=FREE_APP_ID", {
                  timeout: 1e4
                });
                return response.data.rates;
              } catch (error) {
                console.warn("Open Exchange Rates failed:", error);
                return null;
              }
            }
          },
          {
            name: "CurrencyLayer",
            priority: 6,
            fetchRates: async () => {
              try {
                const response = await axios2.get("http://api.currencylayer.com/live?access_key=FREE_ACCESS_KEY&source=USD", {
                  timeout: 1e4
                });
                if (response.data.success && response.data.quotes) {
                  const rates = {};
                  Object.keys(response.data.quotes).forEach((key) => {
                    const currency = key.replace("USD", "");
                    rates[currency] = response.data.quotes[key];
                  });
                  return rates;
                }
                return null;
              } catch (error) {
                console.warn("CurrencyLayer failed:", error);
                return null;
              }
            }
          }
        ];
        // Comprehensive fallback rates based on real market data (no duplicates)
        this.fallbackRates = {
          "USD": 1,
          // Base currency
          "EUR": 0.9234,
          // Euro
          "GBP": 0.7856,
          // British Pound
          "JPY": 150.32,
          // Japanese Yen
          "CAD": 1.3542,
          // Canadian Dollar
          "AUD": 1.5187,
          // Australian Dollar
          "CHF": 0.8763,
          // Swiss Franc
          "CNY": 7.2344,
          // Chinese Yuan
          "INR": 83.1234,
          // Indian Rupee
          "KRW": 1315.67,
          // South Korean Won
          "BRL": 6.1234,
          // Brazilian Real
          "MXN": 17.0567,
          // Mexican Peso
          "RUB": 92.3456,
          // Russian Ruble
          "SGD": 1.3456,
          // Singapore Dollar
          "HKD": 7.8234,
          // Hong Kong Dollar
          "NOK": 10.8765,
          // Norwegian Krone
          "SEK": 10.7234,
          // Swedish Krona
          "DKK": 6.8567,
          // Danish Krone
          "PLN": 4.0234,
          // Polish Zloty
          "CZK": 22.6789,
          // Czech Koruna
          "HUF": 358.45,
          // Hungarian Forint
          "RON": 4.5678,
          // Romanian Leu
          "BGN": 1.8045,
          // Bulgarian Lev
          "TRY": 29.3456,
          // Turkish Lira
          "ZAR": 18.6789,
          // South African Rand
          "EGP": 30.789,
          // Egyptian Pound
          "MAD": 10.1234,
          // Moroccan Dirham
          "NGN": 774.56,
          // Nigerian Naira
          "KES": 154.23,
          // Kenyan Shilling
          "UGX": 3742.34,
          // Ugandan Shilling
          "AED": 3.6734,
          // UAE Dirham
          "SAR": 3.7523,
          // Saudi Riyal
          "QAR": 3.6412,
          // Qatari Riyal
          "KWD": 0.3067,
          // Kuwaiti Dinar
          "BHD": 0.3771,
          // Bahraini Dinar
          "OMR": 0.3845,
          // Omani Rial
          "ILS": 3.6234,
          // Israeli Shekel
          "PKR": 277.89,
          // Pakistani Rupee
          "BDT": 119.45,
          // Bangladeshi Taka
          "VND": 24321.45,
          // Vietnamese Dong
          "THB": 35.2345,
          // Thai Baht
          "MYR": 4.6234,
          // Malaysian Ringgit
          "IDR": 15823.45,
          // Indonesian Rupiah
          "PHP": 55.6789,
          // Philippine Peso
          "TWD": 31.789,
          // Taiwan Dollar
          "NZD": 1.6745,
          // New Zealand Dollar
          "CLP": 912.34,
          // Chilean Peso
          "COP": 4123.45,
          // Colombian Peso
          "PEN": 3.7234,
          // Peruvian Sol
          "UYU": 39.2345,
          // Uruguayan Peso
          "ARS": 234.56,
          // Argentine Peso
          "BOB": 6.9123,
          // Bolivian Boliviano
          "PYG": 7234.56,
          // Paraguayan Guaraní
          "GEL": 2.6789,
          // Georgian Lari
          "UAH": 36.789,
          // Ukrainian Hryvnia
          "KZT": 456.78,
          // Kazakhstani Tenge
          "UZS": 12234.56,
          // Uzbekistani Som
          "MNT": 3456.78,
          // Mongolian Tugrik
          "MMK": 2098.45,
          // Myanmar Kyat
          "LAK": 21234.56,
          // Laotian Kip
          "KHR": 4098.76,
          // Cambodian Riel
          "BND": 1.3456,
          // Brunei Dollar
          "FJD": 2.2345,
          // Fijian Dollar
          "PGK": 3.9876,
          // Papua New Guinean Kina
          "TOP": 2.3456,
          // Tongan Paʻanga
          "WST": 2.7234,
          // Samoan Tala
          "VUV": 123.45,
          // Vanuatu Vatu
          "SBD": 8.4567,
          // Solomon Islands Dollar
          "XPF": 117.89,
          // CFP Franc
          "MOP": 8.0789,
          // Macanese Pataca
          "ISK": 138.45,
          // Icelandic Króna
          "LKR": 298.76,
          // Sri Lankan Rupee
          "NPR": 133.12,
          // Nepalese Rupee
          "BTN": 83.45,
          // Bhutanese Ngultrum
          "MVR": 15.42,
          // Maldivian Rufiyaa
          "AFN": 71.23,
          // Afghan Afghani
          "IRR": 42034.56,
          // Iranian Rial
          "IQD": 1309.87,
          // Iraqi Dinar
          "JOD": 0.7089,
          // Jordanian Dinar
          "LBP": 15023.45,
          // Lebanese Pound
          "SYP": 2512.34,
          // Syrian Pound
          "YER": 250.67,
          // Yemeni Rial
          "ETB": 56.78,
          // Ethiopian Birr
          "TZS": 2523.45,
          // Tanzanian Shilling
          "RWF": 1298.76,
          // Rwandan Franc
          "BIF": 2876.54,
          // Burundian Franc
          "DJF": 177.89,
          // Djiboutian Franc
          "ERN": 15,
          // Eritrean Nakfa
          "SOS": 571.23,
          // Somali Shilling
          "XOF": 605.67,
          // West African CFA Franc
          "XAF": 605.67,
          // Central African CFA Franc
          "GMD": 67.89,
          // Gambian Dalasi
          "GHS": 12.34,
          // Ghanaian Cedi
          "GNF": 8567.89,
          // Guinean Franc
          "LRD": 189.45,
          // Liberian Dollar
          "SLE": 22.67,
          // Sierra Leonean Leone
          "MRU": 36.78,
          // Mauritanian Ouguiya
          "CVE": 101.23,
          // Cape Verdean Escudo
          "STP": 22456.78,
          // São Tomé and Príncipe Dobra
          "AOA": 823.45,
          // Angolan Kwanza
          "BWP": 13.67,
          // Botswanan Pula
          "LSL": 18.45,
          // Lesotho Loti
          "NAD": 18.45,
          // Namibian Dollar
          "SZL": 18.45,
          // Swazi Lilangeni
          "ZMW": 26.78,
          // Zambian Kwacha
          "ZWL": 321.12
          // Zimbabwean Dollar
        };
      }
      async getRates() {
        if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
          return {
            rates: this.cache.rates,
            source: this.cache.source + " (cached)",
            lastUpdated: new Date(this.cache.timestamp).toISOString(),
            success: true
          };
        }
        for (const provider of this.providers.sort((a, b) => a.priority - b.priority)) {
          try {
            console.log(`Attempting to fetch rates from ${provider.name}...`);
            const rates = await provider.fetchRates();
            if (rates && Object.keys(rates).length > 30) {
              if (!rates.USD) {
                rates.USD = 1;
              }
              this.cache = {
                rates,
                timestamp: Date.now(),
                source: provider.name
              };
              console.log(`Successfully fetched ${Object.keys(rates).length} exchange rates from ${provider.name}`);
              return {
                rates,
                source: provider.name,
                lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
                success: true
              };
            }
          } catch (error) {
            console.warn(`Provider ${provider.name} failed:`, error);
            continue;
          }
        }
        console.warn("All exchange rate providers failed, using fallback rates");
        this.cache = {
          rates: this.fallbackRates,
          timestamp: Date.now(),
          source: "Fallback"
        };
        return {
          rates: this.fallbackRates,
          source: "Fallback (providers unavailable)",
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          success: false
        };
      }
      // Force refresh rates (bypass cache)
      async forceRefresh() {
        this.cache = null;
        return this.getRates();
      }
      // Get specific currency rate
      async getRate(fromCurrency, toCurrency) {
        const ratesData = await this.getRates();
        const fromRate = ratesData.rates[fromCurrency.toUpperCase()] || 1;
        const toRate = ratesData.rates[toCurrency.toUpperCase()] || 1;
        if (fromCurrency.toUpperCase() === "USD") {
          return toRate;
        } else if (toCurrency.toUpperCase() === "USD") {
          return 1 / fromRate;
        } else {
          return toRate / fromRate;
        }
      }
    };
    exchangeRateService = new ExchangeRateService();
  }
});

// server/websocket.ts
var websocket_exports = {};
__export(websocket_exports, {
  broadcast: () => broadcast,
  getWebSocketServer: () => getWebSocketServer,
  initializeWebSocket: () => initializeWebSocket,
  sendToUser: () => sendToUser
});
import { WebSocketServer } from "ws";
function initializeWebSocket(server) {
  wss = new WebSocketServer({
    server,
    path: "/ws"
  });
  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("WebSocket message received:", data);
        switch (data.type) {
          case "subscribe_notifications":
            break;
          case "ping":
            ws.send(JSON.stringify({ type: "pong" }));
            break;
          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });
  return wss;
}
function getWebSocketServer() {
  return wss;
}
function broadcast(message) {
  if (!wss) return;
  const messageStr = JSON.stringify(message);
  wss.clients.forEach((client2) => {
    if (client2.readyState === 1) {
      client2.send(messageStr);
    }
  });
}
function sendToUser(userId, message) {
  if (!wss) return;
  const messageStr = JSON.stringify({ ...message, userId });
  wss.clients.forEach((client2) => {
    if (client2.readyState === 1 && client2.userId === userId) {
      client2.send(messageStr);
    }
  });
}
var wss;
var init_websocket = __esm({
  "server/websocket.ts"() {
    wss = null;
  }
});

// server/models/Transfer.ts
var Transfer_exports = {};
__export(Transfer_exports, {
  Transfer: () => Transfer
});
import mongoose8, { Schema as Schema6, model as model4 } from "mongoose";
var transferSchema, Transfer;
var init_Transfer = __esm({
  "server/models/Transfer.ts"() {
    transferSchema = new Schema6(
      {
        fromUserId: {
          type: mongoose8.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        toUserId: {
          type: mongoose8.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        amount: {
          type: Number,
          required: true,
          min: 0
        },
        currency: {
          type: String,
          required: true,
          default: "USD"
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending"
        },
        transactionId: {
          type: String,
          required: true,
          unique: true
        },
        description: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      },
      {
        timestamps: true
      }
    );
    transferSchema.index({ fromUserId: 1, createdAt: -1 });
    transferSchema.index({ toUserId: 1, createdAt: -1 });
    transferSchema.index({ transactionId: 1 });
    Transfer = mongoose8.models.Transfer || model4("Transfer", transferSchema);
  }
});

// server/api/realtime-prices.ts
var realtime_prices_exports = {};
__export(realtime_prices_exports, {
  getRealtimePrices: () => getRealtimePrices
});
import axios3 from "axios";
async function getRealtimePrices(req, res) {
  try {
    const now = Date.now();
    priceCache = null;
    lastCacheTime = 0;
    if (priceCache && now - lastCacheTime < CACHE_DURATION) {
      return res.json({ success: true, data: priceCache });
    }
    const API_KEY = process.env.COINGECKO_API_KEY || "";
    const allCryptoPairCoins = [
      "bitcoin",
      "ethereum",
      "solana",
      "binancecoin",
      "ripple",
      "usd-coin",
      "dogecoin",
      "cardano",
      "tron",
      "avalanche-2",
      "chainlink",
      "the-open-network",
      "shiba-inu",
      "sui",
      "polkadot",
      "bitcoin-cash",
      "litecoin",
      "pepe",
      "tether",
      "arbitrum",
      "cosmos",
      "algorand",
      "vechain",
      "render-token",
      "hedera-hashgraph",
      "mantle",
      "near",
      "filecoin",
      "blockstack",
      "maker",
      "stellar",
      "kaspa",
      "immutable-x",
      "optimism",
      "okb",
      "first-digital-usd",
      "matic-network",
      "ethereum-classic",
      "monero",
      "kucoin-shares",
      "internet-computer",
      "uniswap",
      "fantom",
      "whitebit",
      "ondo-finance",
      "aave",
      "floki",
      "lido-dao",
      "cronos",
      "bonk",
      "jupiter-exchange-solana",
      "worldcoin-wld",
      "sei-network",
      "compound-governance-token",
      "wormhole",
      "aptos",
      "beam-2",
      "conflux-token",
      "thorchain",
      "pyth-network",
      "celestia",
      "akash-network",
      "the-sandbox",
      "injective-protocol",
      "gala",
      "flow",
      "theta-token",
      "helium",
      "quant-network",
      "nexo",
      "kava",
      "the-graph",
      "blur",
      "decentraland",
      "curve-dao-token",
      "pancakeswap-token",
      "chiliz",
      "havven",
      "enjincoin",
      "axelar",
      "arkham",
      "starknet",
      "fetch-ai",
      "ether-fi",
      "gmx",
      "dydx",
      "zetachain",
      "ethereum-name-service",
      "sushi",
      "yearn-finance",
      "jasmycoin",
      "jito-governance-token",
      "kusama",
      "zcash",
      "basic-attention-token",
      "nervos-network",
      "eos",
      "stepn",
      "ethena",
      "ankr",
      "celo",
      "kadena",
      "coredaoorg",
      "dogwifcoin",
      "mina-protocol",
      "axie-infinity"
    ];
    console.log("\u{1F680} Fetching fresh CoinGecko data...");
    console.log("\u{1F511} Using API key:", API_KEY ? "Present" : "Missing");
    console.log("\u{1F4CA} Requesting coins:", allCryptoPairCoins.length, "coins:", allCryptoPairCoins.slice(0, 10).join(","), "...");
    if (!API_KEY) {
      throw new Error("CoinGecko API key not configured");
    }
    const response = await axios3.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: allCryptoPairCoins.join(","),
        vs_currencies: "usd",
        include_24hr_change: "true",
        include_24hr_vol: "true",
        include_market_cap: "true"
      },
      headers: {
        "x-cg-demo-api-key": API_KEY,
        "Accept": "application/json"
      },
      timeout: 15e3
    });
    console.log("\u2705 CoinGecko response received:", Object.keys(response.data));
    console.log("\u{1F50D} Full API response status:", response.status);
    console.log("\u{1F4CA} Response headers rate limit:", response.headers["x-ratelimit-remaining"] || "N/A");
    const coinMapping = {
      "bitcoin": { symbol: "BTC", name: "Bitcoin" },
      "ethereum": { symbol: "ETH", name: "Ethereum" },
      "tether": { symbol: "USDT", name: "Tether" },
      "binancecoin": { symbol: "BNB", name: "BNB" },
      "solana": { symbol: "SOL", name: "Solana" },
      "ripple": { symbol: "XRP", name: "XRP" },
      "dogecoin": { symbol: "DOGE", name: "Dogecoin" },
      "cardano": { symbol: "ADA", name: "Cardano" },
      "tron": { symbol: "TRX", name: "TRON" },
      "avalanche-2": { symbol: "AVAX", name: "Avalanche" },
      "chainlink": { symbol: "LINK", name: "Chainlink" },
      "the-open-network": { symbol: "TON", name: "Toncoin" },
      "shiba-inu": { symbol: "SHIB", name: "Shiba Inu" },
      "sui": { symbol: "SUI", name: "Sui" },
      "polkadot": { symbol: "DOT", name: "Polkadot" },
      "bitcoin-cash": { symbol: "BCH", name: "Bitcoin Cash" },
      "litecoin": { symbol: "LTC", name: "Litecoin" },
      "pepe": { symbol: "PEPE", name: "Pepe" },
      "usd-coin": { symbol: "USDC", name: "USD Coin" },
      "arbitrum": { symbol: "ARB", name: "Arbitrum" },
      "cosmos": { symbol: "ATOM", name: "Cosmos" },
      "algorand": { symbol: "ALGO", name: "Algorand" },
      "vechain": { symbol: "VET", name: "VeChain" },
      "render-token": { symbol: "RNDR", name: "Render" },
      "hedera-hashgraph": { symbol: "HBAR", name: "Hedera" },
      "mantle": { symbol: "MNT", name: "Mantle" },
      "near": { symbol: "NEAR", name: "NEAR Protocol" },
      "filecoin": { symbol: "FIL", name: "Filecoin" },
      "blockstack": { symbol: "STX", name: "Stacks" },
      "maker": { symbol: "MKR", name: "Maker" },
      "stellar": { symbol: "XLM", name: "Stellar" },
      "kaspa": { symbol: "KAS", name: "Kaspa" },
      "immutable-x": { symbol: "IMX", name: "Immutable X" },
      "optimism": { symbol: "OP", name: "Optimism" },
      "okb": { symbol: "OKB", name: "OKB" },
      "first-digital-usd": { symbol: "FDUSD", name: "First Digital USD" },
      "matic-network": { symbol: "MATIC", name: "Polygon" },
      "ethereum-classic": { symbol: "ETC", name: "Ethereum Classic" },
      "monero": { symbol: "XMR", name: "Monero" },
      "kucoin-shares": { symbol: "KCS", name: "KuCoin Token" },
      "internet-computer": { symbol: "ICP", name: "Internet Computer" },
      "uniswap": { symbol: "UNI", name: "Uniswap" },
      "fantom": { symbol: "FTM", name: "Fantom" },
      "whitebit": { symbol: "WBT", name: "WhiteBIT Token" },
      "ondo-finance": { symbol: "ONDO", name: "Ondo" },
      "aave": { symbol: "AAVE", name: "Aave" },
      "floki": { symbol: "FLOKI", name: "FLOKI" },
      "lido-dao": { symbol: "LDO", name: "Lido DAO" },
      "cronos": { symbol: "CRO", name: "Cronos" },
      "bonk": { symbol: "BONK", name: "Bonk" },
      "jupiter-exchange-solana": { symbol: "JUP", name: "Jupiter" },
      "worldcoin-wld": { symbol: "WLD", name: "Worldcoin" },
      "sei-network": { symbol: "SEI", name: "Sei" },
      "compound-governance-token": { symbol: "COMP", name: "Compound" },
      "wormhole": { symbol: "W", name: "Wormhole" },
      "aptos": { symbol: "APT", name: "Aptos" },
      "beam-2": { symbol: "BEAM", name: "Beam" },
      "conflux-token": { symbol: "CFX", name: "Conflux" },
      "thorchain": { symbol: "RUNE", name: "THORChain" },
      "pyth-network": { symbol: "PYTH", name: "Pyth Network" },
      "celestia": { symbol: "TIA", name: "Celestia" },
      "akash-network": { symbol: "AKT", name: "Akash Network" },
      "the-sandbox": { symbol: "SAND", name: "The Sandbox" },
      "injective-protocol": { symbol: "INJ", name: "Injective" },
      "gala": { symbol: "GALA", name: "Gala" },
      "flow": { symbol: "FLOW", name: "Flow" },
      "theta-token": { symbol: "THETA", name: "THETA" },
      "helium": { symbol: "HNT", name: "Helium" },
      "quant-network": { symbol: "QNT", name: "Quant" },
      "nexo": { symbol: "NEXO", name: "Nexo" },
      "kava": { symbol: "KAVA", name: "Kava" },
      "the-graph": { symbol: "GRT", name: "The Graph" },
      "blur": { symbol: "BLUR", name: "Blur" },
      "decentraland": { symbol: "MANA", name: "Decentraland" },
      "curve-dao-token": { symbol: "CRV", name: "Curve DAO Token" },
      "pancakeswap-token": { symbol: "CAKE", name: "PancakeSwap" },
      "chiliz": { symbol: "CHZ", name: "Chiliz" },
      "sushi": { symbol: "SUSHI", name: "SushiSwap" },
      "gmx": { symbol: "GMX", name: "GMX" },
      "havven": { symbol: "SNX", name: "Synthetix" },
      "enjincoin": { symbol: "ENJ", name: "Enjin Coin" },
      "axelar": { symbol: "AXL", name: "Axelar" },
      "ether-fi": { symbol: "ETHFI", name: "Ether.fi" },
      "stepn": { symbol: "GMT", name: "STEPN" },
      "dydx": { symbol: "DYDX", name: "dYdX" },
      "fetch-ai": { symbol: "FET", name: "Fetch.ai" },
      "basic-attention-token": { symbol: "BAT", name: "Basic Attention Token" },
      "zcash": { symbol: "ZEC", name: "Zcash" },
      "nervos-network": { symbol: "CKB", name: "Nervos Network" },
      "eos": { symbol: "EOS", name: "EOS" },
      "ethena": { symbol: "ENA", name: "Ethena" },
      "ankr": { symbol: "ANKR", name: "Ankr" },
      "celo": { symbol: "CELO", name: "Celo" },
      "kadena": { symbol: "KDA", name: "Kadena" },
      "coredaoorg": { symbol: "CORE", name: "Core" },
      "dogwifcoin": { symbol: "WIF", name: "dogwifhat" },
      "zetachain": { symbol: "ZETA", name: "ZetaChain" },
      "ethereum-name-service": { symbol: "ENS", name: "Ethereum Name Service" },
      "yearn-finance": { symbol: "YFI", name: "yearn.finance" },
      "jasmycoin": { symbol: "JASMY", name: "JasmyCoin" },
      "jito-governance-token": { symbol: "JTO", name: "Jito" },
      "kusama": { symbol: "KSM", name: "Kusama" },
      "arkham": { symbol: "ARKM", name: "Arkham" },
      "starknet": { symbol: "STRK", name: "Starknet" },
      "mina-protocol": { symbol: "MINA", name: "Mina Protocol" },
      "axie-infinity": { symbol: "AXS", name: "Axie Infinity" }
    };
    const tickers = [];
    for (const [coinId, coinInfo] of Object.entries(coinMapping)) {
      if (response.data[coinId]) {
        const coinData = response.data[coinId];
        const change = coinData.usd_24h_change || 0;
        let sentiment = "Neutral";
        if (change > 2) sentiment = "Bullish";
        else if (change < -2) sentiment = "Bearish";
        tickers.push({
          symbol: coinInfo.symbol,
          name: coinInfo.name,
          price: coinData.usd,
          change,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0,
          sentiment
        });
      }
    }
    priceCache = tickers;
    lastCacheTime = now;
    console.log(`\u{1F389} Successfully fetched ${tickers.length} crypto prices (${allCryptoPairCoins.length} requested)`);
    res.json({ success: true, data: tickers });
  } catch (error) {
    console.error("\u274C Error fetching realtime prices:", error);
    if (priceCache) {
      console.log("\u{1F4E6} Returning cached data due to error");
      return res.json({ success: true, data: priceCache, cached: true });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch cryptocurrency prices",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
var priceCache, lastCacheTime, CACHE_DURATION;
var init_realtime_prices = __esm({
  "server/api/realtime-prices.ts"() {
    priceCache = null;
    lastCacheTime = 0;
    CACHE_DURATION = 3e4;
  }
});

// server/logo-service.ts
var logo_service_exports = {};
__export(logo_service_exports, {
  generateLogoSVG: () => generateLogoSVG,
  getNewsSourceLogo: () => getNewsSourceLogo
});
function adjustBrightness(hex, percent) {
  hex = hex.replace("#", "");
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 255) + amt;
  const B = (num & 255) + amt;
  return "#" + (16777216 + (R < 255 ? R < 1 ? 0 : R : 255) * 65536 + (G < 255 ? G < 1 ? 0 : G : 255) * 256 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
var getNewsSourceLogo, generateLogoSVG;
var init_logo_service = __esm({
  "server/logo-service.ts"() {
    getNewsSourceLogo = (sourceName) => {
      const logoUrls = {
        "CoinDesk": "/logos/coindesk.png",
        "CoinTelegraph": "https://cointelegraph.com/favicon.ico",
        "Decrypt": "https://decrypt.co/favicon.ico",
        "CryptoSlate": "/logos/cryptoslate.jpg",
        "CryptoBriefing": "/logos/cryptobriefing.png",
        "BeInCrypto": "/logos/beincrypto.jpg",
        "CryptoNews": "https://cryptonews.com/favicon.ico",
        "Google News - Crypto": "/logos/google-news.jpg",
        "Google News - Bitcoin": "/logos/google-news.jpg",
        "Reuters": "https://www.reuters.com/favicon.ico",
        "Bloomberg": "https://www.bloomberg.com/favicon.ico",
        "CNBC": "https://www.cnbc.com/favicon.ico",
        "CNN": "https://www.cnn.com/favicon.ico",
        "BBC": "https://www.bbc.com/favicon.ico"
      };
      return logoUrls[sourceName] || null;
    };
    generateLogoSVG = (sourceName) => {
      const colors = {
        "CoinDesk": { bg: "#FF6B35", text: "#FFFFFF" },
        "CoinTelegraph": { bg: "#1E88E5", text: "#FFFFFF" },
        "Decrypt": { bg: "#7B1FA2", text: "#FFFFFF" },
        "CryptoSlate": { bg: "#4CAF50", text: "#FFFFFF" },
        "CryptoBriefing": { bg: "#F44336", text: "#FFFFFF" },
        "BeInCrypto": { bg: "#FFC107", text: "#000000" },
        "CryptoNews": { bg: "#3F51B5", text: "#FFFFFF" },
        "Google News - Crypto": { bg: "#4285F4", text: "#FFFFFF" },
        "Google News - Bitcoin": { bg: "#4285F4", text: "#FFFFFF" },
        "Reuters": { bg: "#D32F2F", text: "#FFFFFF" },
        "Bloomberg": { bg: "#000000", text: "#FFFFFF" },
        "CNBC": { bg: "#1976D2", text: "#FFFFFF" },
        "CNN": { bg: "#C62828", text: "#FFFFFF" },
        "BBC": { bg: "#C8102E", text: "#FFFFFF" }
      };
      const color = colors[sourceName] || { bg: "#9E9E9E", text: "#FFFFFF" };
      const initials = sourceName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
      return `
    <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color.bg, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#grad)" rx="8"/>
      <text x="40" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${color.text}">${initials}</text>
    </svg>
  `;
    };
  }
});

// server/api/verification-routes.ts
var verification_routes_exports = {};
__export(verification_routes_exports, {
  default: () => verification_routes_default
});
import { Router as Router2 } from "express";
import multer from "multer";
var requireAuth, router2, upload, verification_routes_default;
var init_verification_routes = __esm({
  "server/api/verification-routes.ts"() {
    requireAuth = async (req, res, next) => {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      next();
    };
    router2 = Router2();
    upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024
        // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
          cb(null, true);
        } else {
          cb(new Error("Only images and PDF files are allowed"));
        }
      }
    });
    router2.post("/submit", requireAuth, upload.fields([
      { name: "documentFront", maxCount: 1 },
      { name: "documentBack", maxCount: 1 },
      { name: "documentSingle", maxCount: 1 }
    ]), async (req, res) => {
      try {
        const userId = req.session?.userId;
        if (!userId) {
          return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        const {
          hearAboutUs,
          dateOfBirth,
          sourceOfIncome,
          annualIncome,
          investmentExperience,
          plannedDeposit,
          investmentGoal,
          documentType
        } = req.body;
        const files = req.files;
        let parsedDateOfBirth;
        try {
          parsedDateOfBirth = JSON.parse(dateOfBirth);
        } catch (e) {
          return res.status(400).json({ success: false, message: "Invalid date of birth format" });
        }
        const documents = {};
        if (files.documentFront) {
          documents.front = files.documentFront[0].buffer.toString("base64");
        }
        if (files.documentBack) {
          documents.back = files.documentBack[0].buffer.toString("base64");
        }
        if (files.documentSingle) {
          documents.single = files.documentSingle[0].buffer.toString("base64");
        }
        const kycData = {
          hearAboutUs,
          dateOfBirth: parsedDateOfBirth,
          sourceOfIncome,
          annualIncome,
          investmentExperience,
          plannedDeposit,
          investmentGoal,
          documentType,
          documents,
          verificationResults: {
            documentValid: false,
            faceMatch: false,
            confidence: 0,
            issues: []
          }
        };
        const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
        const currentUser = await User2.findById(userId);
        if (!currentUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        currentUser.kycStatus = "pending";
        currentUser.kycData = kycData;
        await currentUser.save();
        console.log(`\u{1F4CB} KYC submission completed for user ${userId}, status set to pending`);
        res.json({
          success: true,
          message: "Verification submitted successfully",
          status: "pending"
        });
      } catch (error) {
        console.error("Verification submission error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to submit verification"
        });
      }
    });
    router2.get("/status", requireAuth, async (req, res) => {
      try {
        const userId = req.session?.userId;
        console.log("\u{1F510} Verification Status API - Auth Debug:", {
          hasSession: !!req.session,
          userId,
          sessionId: req.sessionID,
          sessionData: req.session
        });
        if (!userId) {
          console.log("\u274C No userId in session");
          return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
        const user = await User2.findById(userId).select("kycStatus kycData");
        if (!user) {
          console.log("\u274C User not found for ID:", userId);
          return res.status(404).json({ success: false, message: "User not found" });
        }
        const response = {
          success: true,
          data: {
            kycStatus: user.kycStatus || "none",
            kycData: user.kycData || null
          }
        };
        console.log("\u2705 Verification Status Success:", {
          userId,
          kycStatus: user.kycStatus,
          hasKycData: !!user.kycData,
          response
        });
        res.json(response);
      } catch (error) {
        console.error("Get verification status error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to get verification status"
        });
      }
    });
    verification_routes_default = router2;
  }
});

// server/api/admin-kyc-routes.ts
var admin_kyc_routes_exports = {};
__export(admin_kyc_routes_exports, {
  default: () => admin_kyc_routes_default
});
import express from "express";
var router3, requireAdminAuth, admin_kyc_routes_default;
var init_admin_kyc_routes = __esm({
  "server/api/admin-kyc-routes.ts"() {
    router3 = express.Router();
    requireAdminAuth = (req, res, next) => {
      if (!req.session?.adminAuthenticated) {
        return res.status(401).json({
          success: false,
          message: "Admin authentication required"
        });
      }
      next();
    };
    router3.post("/approve-kyc", requireAdminAuth, async (req, res) => {
      try {
        const { userId, status, reason } = req.body;
        if (!userId || !status) {
          return res.status(400).json({
            success: false,
            message: "User ID and status are required"
          });
        }
        if (!["verified", "rejected"].includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Status must be verified or rejected"
          });
        }
        const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
        const { Notification: Notification2 } = await Promise.resolve().then(() => (init_Notification(), Notification_exports));
        const user = await User2.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }
        user.kycStatus = status;
        if (reason) {
          user.kycRejectionReason = reason;
        }
        await user.save();
        const notificationData = {
          userId,
          type: status === "verified" ? "kyc_approved" : "kyc_rejected",
          title: status === "verified" ? "KYC Verification Approved" : "KYC Verification Rejected",
          message: status === "verified" ? "Your identity verification has been approved. You now have full access to all features." : `Your identity verification was rejected. Reason: ${reason || "Please contact support for more information."}`,
          data: {
            status,
            reason,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          },
          createdAt: /* @__PURE__ */ new Date(),
          isRead: false
        };
        const notification = new Notification2(notificationData);
        await notification.save();
        try {
          const app2 = req.app;
          const wss2 = app2.get("wss");
          if (wss2) {
            wss2.clients.forEach((client2) => {
              if (client2.readyState === 1) {
                client2.send(JSON.stringify({
                  type: "KYC_STATUS_UPDATE",
                  userId,
                  status,
                  notification: notificationData
                }));
              }
            });
          }
        } catch (wsError) {
          console.error("Error broadcasting WebSocket:", wsError);
        }
        res.json({
          success: true,
          message: `KYC ${status} successfully`,
          data: {
            userId,
            status,
            notification: notificationData
          }
        });
      } catch (error) {
        console.error("Admin KYC action error:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    });
    router3.get("/pending-kyc", requireAdminAuth, async (req, res) => {
      try {
        const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
        const pendingVerifications = await User2.find({
          kycStatus: { $in: ["submitted", "pending"] }
        }).select("_id uid email username firstName lastName kycStatus kycData createdAt");
        console.log(`\u{1F4CB} Admin: Found ${pendingVerifications.length} pending KYC verifications`);
        res.json({
          success: true,
          data: pendingVerifications
        });
      } catch (error) {
        console.error("Get pending KYC error:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error"
        });
      }
    });
    router3.post("/add-test-documents", requireAdminAuth, async (req, res) => {
      try {
        const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
        const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        const user = await User2.findOne({ kycStatus: "pending" });
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "No pending user found"
          });
        }
        if (!user.kycData) {
          user.kycData = {};
        }
        user.kycData.documents = {
          front: testImageBase64,
          back: testImageBase64,
          single: testImageBase64
        };
        await user.save();
        console.log("\u2705 Added test documents to existing user");
        res.json({
          success: true,
          message: "Test documents added successfully",
          user: {
            email: user.email,
            uid: user.uid,
            kycStatus: user.kycStatus,
            hasDocuments: !!user.kycData?.documents
          }
        });
      } catch (error) {
        console.error("Error adding test documents:", error);
        res.status(500).json({
          success: false,
          message: "Failed to add test documents"
        });
      }
    });
    admin_kyc_routes_default = router3;
  }
});

// server/models/AdminMessage.ts
var AdminMessage_exports = {};
__export(AdminMessage_exports, {
  AdminMessage: () => AdminMessage
});
import mongoose9, { Schema as Schema7 } from "mongoose";
var AdminMessageSchema, AdminMessage;
var init_AdminMessage = __esm({
  "server/models/AdminMessage.ts"() {
    AdminMessageSchema = new Schema7({
      userId: {
        type: String,
        required: true,
        index: true
      },
      adminId: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2e3
      },
      type: {
        type: String,
        default: "support_message",
        enum: ["support_message"]
      },
      isRead: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });
    AdminMessageSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    AdminMessage = mongoose9.model("AdminMessage", AdminMessageSchema);
  }
});

// server/models/UserSettings.ts
var UserSettings_exports = {};
__export(UserSettings_exports, {
  UserSettings: () => UserSettings
});
import mongoose10, { Schema as Schema8 } from "mongoose";
var UserSettingsSchema, UserSettings;
var init_UserSettings = __esm({
  "server/models/UserSettings.ts"() {
    UserSettingsSchema = new Schema8({
      userId: {
        type: String,
        required: true,
        unique: true,
        index: true
      },
      minimumDepositForWithdrawal: {
        type: Number,
        default: 500,
        min: 0
      },
      totalDeposited: {
        type: Number,
        default: 0,
        min: 0
      },
      canWithdraw: {
        type: Boolean,
        default: false
      },
      withdrawalMessage: {
        type: String,
        default: "You need to make a first deposit of ${amount} to unlock withdrawal features."
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });
    UserSettingsSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    UserSettingsSchema.pre("save", function(next) {
      this.canWithdraw = this.totalDeposited >= this.minimumDepositForWithdrawal;
      next();
    });
    UserSettings = mongoose10.model("UserSettings", UserSettingsSchema);
  }
});

// server/models/ConnectionRequest.ts
var ConnectionRequest_exports = {};
__export(ConnectionRequest_exports, {
  ConnectionRequest: () => ConnectionRequest
});
import mongoose11, { Schema as Schema9 } from "mongoose";
var ConnectionRequestSchema, ConnectionRequest;
var init_ConnectionRequest = __esm({
  "server/models/ConnectionRequest.ts"() {
    ConnectionRequestSchema = new Schema9({
      userId: { type: String, required: true, index: true },
      adminId: { type: String, required: true },
      customMessage: { type: String, required: true },
      successMessage: { type: String, required: true },
      serviceName: { type: String, required: true },
      status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
      respondedAt: { type: Date }
    }, {
      timestamps: true
    });
    ConnectionRequest = mongoose11.model("ConnectionRequest", ConnectionRequestSchema);
  }
});

// server/models/ContactMessage.ts
var ContactMessage_exports = {};
__export(ContactMessage_exports, {
  ContactMessage: () => ContactMessage
});
import mongoose12, { Schema as Schema10 } from "mongoose";
var ContactMessageSchema, ContactMessage;
var init_ContactMessage = __esm({
  "server/models/ContactMessage.ts"() {
    ContactMessageSchema = new Schema10({
      userId: {
        type: String,
        required: true,
        index: true
      },
      firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 100
      },
      subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5e3
      },
      isRead: {
        type: Boolean,
        default: false
      },
      priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
      },
      category: {
        type: String,
        enum: ["general", "support", "security", "technical"],
        default: "general"
      },
      adminReply: {
        type: String,
        trim: true,
        maxlength: 5e3
      },
      adminReplyAt: {
        type: Date
      },
      hasReply: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });
    ContactMessageSchema.pre("save", function(next) {
      this.updatedAt = /* @__PURE__ */ new Date();
      next();
    });
    ContactMessageSchema.index({ createdAt: -1 });
    ContactMessageSchema.index({ isRead: 1 });
    ContactMessage = mongoose12.model("ContactMessage", ContactMessageSchema);
  }
});

// server/index.ts
import "dotenv/config";
import express3 from "express";

// server/routes.mongo.ts
init_mongoStorage();
import { createServer } from "http";
import bcrypt2 from "bcrypt";
import session from "express-session";
import MongoStore from "connect-mongodb-session";

// server/mongodb.ts
import mongoose7 from "mongoose";
import { MongoClient } from "mongodb";
var mongoUri = "";
async function connectToDatabase() {
  if (mongoose7.connection.readyState >= 1) {
    return mongoose7.connection;
  }
  try {
    console.log("Connecting to MongoDB Atlas...");
    mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is required");
    }
    console.log("Using MongoDB Atlas cluster");
    await mongoose7.connect(mongoUri);
    console.log("MongoDB Atlas connection established successfully");
    try {
      await createInitialData();
    } catch (error) {
      console.log("Initial data creation already completed or failed:", error);
    }
    return mongoose7.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
async function createInitialData() {
  console.log("Creating initial data for development...");
  try {
    const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
    const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
    const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
    const { authService: authService2 } = await Promise.resolve().then(() => (init_auth_service(), auth_service_exports));
    const hashedPassword = await authService2.hashPassword("password");
    const { generateUID: generateUID2 } = await Promise.resolve().then(() => (init_uid(), uid_exports));
    const existingTestUser = await User2.findOne({ username: "testuser" });
    if (!existingTestUser) {
      const testUser = new User2({
        uid: generateUID2(),
        username: "testuser",
        email: "test@example.com",
        password: hashedPassword,
        // Freshly hashed 'password'
        firstName: "Test",
        lastName: "User",
        isVerified: true,
        isAdmin: false,
        createdAt: /* @__PURE__ */ new Date()
      });
      await testUser.save();
      console.log("Created test user with username: testuser, password: password");
    }
    const existingAdminUser = await User2.findOne({ username: "admin" });
    if (!existingAdminUser) {
      const adminUser = new User2({
        uid: generateUID2(),
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        // Same hashed password
        firstName: "Admin",
        lastName: "User",
        isVerified: true,
        isAdmin: true,
        createdAt: /* @__PURE__ */ new Date()
      });
      await adminUser.save();
      console.log("Created admin user with username: admin, password: password");
    }
    const currencies = [
      { symbol: "USD", name: "US Dollar", isActive: true },
      { symbol: "BTC", name: "Bitcoin", isActive: true },
      { symbol: "ETH", name: "Ethereum", isActive: true },
      { symbol: "BNB", name: "Binance Coin", isActive: true },
      { symbol: "USDT", name: "Tether", isActive: true }
    ];
    for (const currencyData of currencies) {
      const existingCurrency = await Currency2.findOne({ symbol: currencyData.symbol });
      if (!existingCurrency) {
        const currency = new Currency2(currencyData);
        await currency.save();
      }
    }
    console.log("Currencies initialized:", currencies.map((c) => c.symbol).join(", "));
    const usdCurrency = await Currency2.findOne({ symbol: "USD" });
    const btcCurrency = await Currency2.findOne({ symbol: "BTC" });
    const ethCurrency = await Currency2.findOne({ symbol: "ETH" });
    console.log("Database initialization complete - currencies created successfully");
    console.log("Initial data creation completed successfully");
  } catch (error) {
    console.error("Error creating initial data:", error);
  }
}

// server/coingecko-api.ts
import axios from "axios";
async function getCoinGeckoPrices() {
  try {
    const API_KEY = process.env.COINGECKO_API_KEY || "";
    console.log("\u{1F511} CoinGecko API key check:", API_KEY ? "Present" : "Missing");
    if (!API_KEY) {
      throw new Error("CoinGecko API key not configured");
    }
    const comprehensiveCoins = [
      // Tier 1: Top cryptocurrencies
      "bitcoin",
      "ethereum",
      "tether",
      "binancecoin",
      "solana",
      "ripple",
      "dogecoin",
      "cardano",
      "tron",
      "avalanche-2",
      "chainlink",
      "the-open-network",
      "shiba-inu",
      "sui",
      "polkadot",
      "bitcoin-cash",
      "litecoin",
      "pepe",
      "usd-coin",
      "arbitrum",
      "cosmos",
      "algorand",
      "vechain",
      "render-token",
      "hedera-hashgraph",
      "mantle",
      "near",
      "filecoin",
      "blockstack",
      "maker",
      "stellar",
      "kaspa",
      "immutable-x",
      "optimism",
      "okb",
      "first-digital-usd",
      "polygon",
      "ethereum-classic",
      "monero",
      "kucoin-shares",
      "internet-computer",
      "uniswap",
      "fantom",
      "whitebit",
      "ondo-finance",
      "aave",
      "bittorrent-new",
      "floki",
      "lido-dao",
      "cronos",
      "bonk",
      "jupiter-exchange-solana",
      "worldcoin-wld",
      "sei-network",
      "compound",
      "wormhole",
      "aptos",
      "beam-2",
      "conflux-token",
      "thorchain",
      "matic-network",
      "pyth-network",
      "celestia",
      "akash-network",
      "the-sandbox",
      "injective-protocol",
      "gala",
      "flow",
      "theta-token",
      "helium",
      "quant-network",
      "nexo",
      "kava",
      "the-graph",
      "blur",
      "decentraland",
      "curve-dao-token",
      "pancakeswap-token",
      "chiliz",
      "sushi",
      "gmx",
      "flare-networks",
      "axie-infinity",
      "synthetix-network-token",
      "mask-network",
      "livepeer",
      "trust-wallet-token",
      "enjin-coin",
      "frax-share",
      "stepn",
      "ocean-protocol",
      "havven",
      "dydx",
      "loopring",
      "fetch-ai",
      "singularitynet",
      "basic-attention-token",
      "sandbox",
      "zcash",
      "dash",
      "nervos-network",
      "eos",
      "ethena",
      "ankr",
      "celo",
      "kadena",
      "coredaoorg",
      "harmony",
      "zilliqa",
      "waves",
      "iotex",
      "coti",
      "band-protocol",
      "bittorrent",
      "ravencoin",
      "siacoin",
      "decred",
      "zencash",
      "stormx",
      "smooth-love-potion",
      "nem",
      "lisk"
    ];
    console.log("\u{1F680} Fetching CoinGecko prices for comprehensive coins:", comprehensiveCoins.length);
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: comprehensiveCoins.join(","),
        vs_currencies: "usd",
        include_24hr_change: "true",
        include_24hr_vol: "true",
        include_market_cap: "true"
      },
      headers: {
        "x-cg-demo-api-key": API_KEY,
        "Accept": "application/json"
      },
      timeout: 15e3
    });
    console.log("\u2705 CoinGecko API response status:", response.status);
    console.log("\u{1F4CA} CoinGecko data received for coins:", Object.keys(response.data));
    const coinMapping = {
      "bitcoin": { symbol: "BTC", name: "Bitcoin" },
      "ethereum": { symbol: "ETH", name: "Ethereum" },
      "tether": { symbol: "USDT", name: "Tether" },
      "binancecoin": { symbol: "BNB", name: "BNB" },
      "solana": { symbol: "SOL", name: "Solana" },
      "ripple": { symbol: "XRP", name: "XRP" },
      "dogecoin": { symbol: "DOGE", name: "Dogecoin" },
      "cardano": { symbol: "ADA", name: "Cardano" },
      "tron": { symbol: "TRX", name: "TRON" },
      "avalanche-2": { symbol: "AVAX", name: "Avalanche" },
      "chainlink": { symbol: "LINK", name: "Chainlink" },
      "the-open-network": { symbol: "TON", name: "Toncoin" },
      "shiba-inu": { symbol: "SHIB", name: "Shiba Inu" },
      "sui": { symbol: "SUI", name: "Sui" },
      "polkadot": { symbol: "DOT", name: "Polkadot" },
      "bitcoin-cash": { symbol: "BCH", name: "Bitcoin Cash" },
      "litecoin": { symbol: "LTC", name: "Litecoin" },
      "pepe": { symbol: "PEPE", name: "Pepe" },
      "usd-coin": { symbol: "USDC", name: "USD Coin" },
      "arbitrum": { symbol: "ARB", name: "Arbitrum" },
      "cosmos": { symbol: "ATOM", name: "Cosmos" },
      "algorand": { symbol: "ALGO", name: "Algorand" },
      "vechain": { symbol: "VET", name: "VeChain" },
      "render-token": { symbol: "RNDR", name: "Render" },
      "hedera-hashgraph": { symbol: "HBAR", name: "Hedera" },
      "mantle": { symbol: "MNT", name: "Mantle" },
      "near": { symbol: "NEAR", name: "NEAR Protocol" },
      "filecoin": { symbol: "FIL", name: "Filecoin" },
      "blockstack": { symbol: "STX", name: "Stacks" },
      "maker": { symbol: "MKR", name: "Maker" },
      "stellar": { symbol: "XLM", name: "Stellar" },
      "kaspa": { symbol: "KAS", name: "Kaspa" },
      "immutable-x": { symbol: "IMX", name: "Immutable X" },
      "optimism": { symbol: "OP", name: "Optimism" },
      "okb": { symbol: "OKB", name: "OKB" },
      "first-digital-usd": { symbol: "FDUSD", name: "First Digital USD" },
      "polygon": { symbol: "MATIC", name: "Polygon" },
      "ethereum-classic": { symbol: "ETC", name: "Ethereum Classic" },
      "monero": { symbol: "XMR", name: "Monero" },
      "kucoin-shares": { symbol: "KCS", name: "KuCoin Token" },
      "internet-computer": { symbol: "ICP", name: "Internet Computer" },
      "uniswap": { symbol: "UNI", name: "Uniswap" },
      "fantom": { symbol: "FTM", name: "Fantom" },
      "whitebit": { symbol: "WBT", name: "WhiteBIT Token" },
      "ondo-finance": { symbol: "ONDO", name: "Ondo" },
      "aave": { symbol: "AAVE", name: "Aave" },
      "bittorrent-new": { symbol: "BTT", name: "BitTorrent" },
      "floki": { symbol: "FLOKI", name: "FLOKI" },
      "lido-dao": { symbol: "LDO", name: "Lido DAO" },
      "cronos": { symbol: "CRO", name: "Cronos" },
      "bonk": { symbol: "BONK", name: "Bonk" },
      "jupiter-exchange-solana": { symbol: "JUP", name: "Jupiter" },
      "worldcoin-wld": { symbol: "WLD", name: "Worldcoin" },
      "sei-network": { symbol: "SEI", name: "Sei" },
      "compound": { symbol: "COMP", name: "Compound" },
      "wormhole": { symbol: "W", name: "Wormhole" },
      "aptos": { symbol: "APT", name: "Aptos" },
      "beam-2": { symbol: "BEAM", name: "Beam" },
      "conflux-token": { symbol: "CFX", name: "Conflux" },
      "thorchain": { symbol: "RUNE", name: "THORChain" },
      "matic-network": { symbol: "MATIC", name: "Polygon" },
      "pyth-network": { symbol: "PYTH", name: "Pyth Network" },
      "celestia": { symbol: "TIA", name: "Celestia" },
      "akash-network": { symbol: "AKT", name: "Akash Network" },
      "the-sandbox": { symbol: "SAND", name: "The Sandbox" },
      "injective-protocol": { symbol: "INJ", name: "Injective" },
      "gala": { symbol: "GALA", name: "Gala" },
      "flow": { symbol: "FLOW", name: "Flow" },
      "theta-token": { symbol: "THETA", name: "THETA" },
      "helium": { symbol: "HNT", name: "Helium" },
      "quant-network": { symbol: "QNT", name: "Quant" },
      "nexo": { symbol: "NEXO", name: "Nexo" },
      "kava": { symbol: "KAVA", name: "Kava" },
      "the-graph": { symbol: "GRT", name: "The Graph" },
      "blur": { symbol: "BLUR", name: "Blur" },
      "decentraland": { symbol: "MANA", name: "Decentraland" },
      "curve-dao-token": { symbol: "CRV", name: "Curve DAO Token" },
      "pancakeswap-token": { symbol: "CAKE", name: "PancakeSwap" },
      "chiliz": { symbol: "CHZ", name: "Chiliz" },
      "sushi": { symbol: "SUSHI", name: "SushiSwap" },
      "gmx": { symbol: "GMX", name: "GMX" },
      "flare-networks": { symbol: "FLR", name: "Flare" },
      "axie-infinity": { symbol: "AXS", name: "Axie Infinity" },
      "synthetix-network-token": { symbol: "SNX", name: "Synthetix" },
      "mask-network": { symbol: "MASK", name: "Mask Network" },
      "livepeer": { symbol: "LPT", name: "Livepeer" },
      "trust-wallet-token": { symbol: "TWT", name: "Trust Wallet Token" },
      "enjin-coin": { symbol: "ENJ", name: "Enjin Coin" },
      "frax-share": { symbol: "FXS", name: "Frax Share" },
      "stepn": { symbol: "GMT", name: "STEPN" },
      "ocean-protocol": { symbol: "OCEAN", name: "Ocean Protocol" },
      "havven": { symbol: "SNX", name: "Synthetix" },
      "dydx": { symbol: "DYDX", name: "dYdX" },
      "loopring": { symbol: "LRC", name: "Loopring" },
      "fetch-ai": { symbol: "FET", name: "Fetch.ai" },
      "singularitynet": { symbol: "AGIX", name: "SingularityNET" },
      "basic-attention-token": { symbol: "BAT", name: "Basic Attention Token" },
      "sandbox": { symbol: "SAND", name: "The Sandbox" },
      "zcash": { symbol: "ZEC", name: "Zcash" },
      "dash": { symbol: "DASH", name: "Dash" },
      "nervos-network": { symbol: "CKB", name: "Nervos Network" },
      "eos": { symbol: "EOS", name: "EOS" },
      "ethena": { symbol: "ENA", name: "Ethena" },
      "ankr": { symbol: "ANKR", name: "Ankr" },
      "celo": { symbol: "CELO", name: "Celo" },
      "kadena": { symbol: "KDA", name: "Kadena" },
      "coredaoorg": { symbol: "CORE", name: "Core" },
      "harmony": { symbol: "ONE", name: "Harmony" },
      "zilliqa": { symbol: "ZIL", name: "Zilliqa" },
      "waves": { symbol: "WAVES", name: "Waves" },
      "iotex": { symbol: "IOTX", name: "IoTeX" },
      "coti": { symbol: "COTI", name: "COTI" },
      "band-protocol": { symbol: "BAND", name: "Band Protocol" },
      "bittorrent": { symbol: "BTT", name: "BitTorrent" },
      "ravencoin": { symbol: "RVN", name: "Ravencoin" },
      "siacoin": { symbol: "SC", name: "Siacoin" },
      "decred": { symbol: "DCR", name: "Decred" },
      "zencash": { symbol: "ZEN", name: "Horizen" },
      "stormx": { symbol: "STMX", name: "StormX" },
      "smooth-love-potion": { symbol: "SLP", name: "Smooth Love Potion" },
      "nem": { symbol: "XEM", name: "NEM" },
      "lisk": { symbol: "LSK", name: "Lisk" }
    };
    const tickers = [];
    let successCount = 0;
    for (const [coinId, coinInfo] of Object.entries(coinMapping)) {
      if (response.data[coinId]) {
        const coinData = response.data[coinId];
        tickers.push({
          symbol: coinInfo.symbol,
          name: coinInfo.name,
          price: coinData.usd,
          change: coinData.usd_24h_change || 0,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0
        });
        console.log(`\u2705 ${coinInfo.symbol}: $${coinData.usd.toFixed(coinData.usd > 1 ? 2 : 6)} (${coinData.usd_24h_change >= 0 ? "+" : ""}${coinData.usd_24h_change?.toFixed(2)}%)`);
        successCount++;
      } else {
        console.log(`\u274C Missing data for ${coinId} (${coinInfo.symbol})`);
      }
    }
    console.log(`\u{1F389} Successfully fetched ${successCount} crypto prices`);
    return tickers;
  } catch (error) {
    console.error("CoinGecko API error:", error);
    throw error;
  }
}

// server/image-optimizer.ts
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import imageminAvif from "imagemin-avif";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import * as fs from "fs";
import * as path from "path";
var ImageOptimizer = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.publicDir = path.join(process.cwd(), "public");
    this.optimizedDir = path.join(this.publicDir, "optimized");
    this.ensureOptimizedDirectory();
  }
  ensureOptimizedDirectory() {
    if (!fs.existsSync(this.optimizedDir)) {
      fs.mkdirSync(this.optimizedDir, { recursive: true });
    }
  }
  async optimizeImage(imagePath) {
    const fullPath = path.join(this.publicDir, imagePath);
    if (this.cache.has(imagePath)) {
      return this.cache.get(imagePath);
    }
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }
    const ext = path.extname(imagePath).toLowerCase();
    const basename2 = path.basename(imagePath, ext);
    const dirname2 = path.dirname(imagePath);
    const outputDir = path.join(this.optimizedDir, dirname2);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const result = {
      original: imagePath,
      webp: "",
      optimized: ""
    };
    try {
      const webpOutput = await imagemin([fullPath], {
        destination: outputDir,
        plugins: [
          imageminWebp({
            quality: 85,
            method: 6,
            lossless: false,
            nearLossless: false
          })
        ]
      });
      if (webpOutput.length > 0) {
        const webpPath = path.join(dirname2, `${basename2}.webp`);
        result.webp = `/optimized/${webpPath}`;
      }
      try {
        const avifOutput = await imagemin([fullPath], {
          destination: outputDir,
          plugins: [
            imageminAvif({
              quality: 80,
              effort: 4
            })
          ]
        });
        if (avifOutput.length > 0) {
          const avifPath = path.join(dirname2, `${basename2}.avif`);
          result.avif = `/optimized/${avifPath}`;
        }
      } catch (avifError) {
        console.warn("AVIF compression failed, continuing without AVIF:", avifError);
      }
      let optimizedOutput;
      if (ext === ".jpg" || ext === ".jpeg") {
        optimizedOutput = await imagemin([fullPath], {
          destination: outputDir,
          plugins: [
            imageminMozjpeg({
              quality: 85,
              progressive: true
            })
          ]
        });
      } else if (ext === ".png") {
        optimizedOutput = await imagemin([fullPath], {
          destination: outputDir,
          plugins: [
            imageminOptipng({
              optimizationLevel: 7,
              bitDepthReduction: true,
              colorTypeReduction: true,
              paletteReduction: true
            })
          ]
        });
      }
      if (optimizedOutput && optimizedOutput.length > 0) {
        const optimizedPath = path.join(dirname2, `${basename2}${ext}`);
        result.optimized = `/optimized/${optimizedPath}`;
      } else {
        result.optimized = imagePath;
      }
      this.cache.set(imagePath, result);
      return result;
    } catch (error) {
      console.error(`Image optimization failed for ${imagePath}:`, error);
      result.optimized = imagePath;
      result.webp = imagePath;
      return result;
    }
  }
  async optimizeAllImages() {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const findImages = (dir) => {
      const images = [];
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && item !== "optimized") {
          images.push(...findImages(fullPath));
        } else if (stat.isFile() && imageExtensions.includes(path.extname(item).toLowerCase())) {
          const relativePath = path.relative(this.publicDir, fullPath);
          images.push(relativePath);
        }
      }
      return images;
    };
    const allImages = findImages(this.publicDir);
    console.log(`Found ${allImages.length} images to optimize`);
    const results = await Promise.allSettled(
      allImages.map((imagePath) => this.optimizeImage(imagePath))
    );
    const successful = results.filter((r) => r.status === "fulfilled").length;
    console.log(`Successfully optimized ${successful}/${allImages.length} images`);
    return { total: allImages.length, successful };
  }
  getOptimizedImageInfo(imagePath) {
    return this.cache.get(imagePath) || null;
  }
  generateSrcSet(imagePath) {
    const optimized = this.cache.get(imagePath);
    if (!optimized) return "";
    const srcSet = [];
    if (optimized.avif) {
      srcSet.push(`${optimized.avif} (type: image/avif)`);
    }
    if (optimized.webp) {
      srcSet.push(`${optimized.webp} (type: image/webp)`);
    }
    srcSet.push(`${optimized.optimized} (type: image/${path.extname(optimized.original).slice(1)})`);
    return srcSet.join(", ");
  }
};
var imageOptimizer = new ImageOptimizer();

// server/passport-config.ts
init_mongoStorage();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
var clientID = process.env.GOOGLE_CLIENT_ID;
var clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientID || !clientSecret) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required");
}
var getCallbackURL = () => {
  if (process.env.BASE_URL) {
    console.log(`Using BASE_URL for Google OAuth callback: ${process.env.BASE_URL}/auth/google/callback`);
    return `${process.env.BASE_URL}/auth/google/callback`;
  }
  if (process.env.REPLIT_DOMAINS) {
    const replatCallback = `https://${process.env.REPLIT_DOMAINS}/auth/google/callback`;
    console.log(`Using REPLIT_DOMAINS for Google OAuth callback: ${replatCallback}`);
    return replatCallback;
  }
  const renderCallback = "https://nedaxer.onrender.com/auth/google/callback";
  console.log(`Using fallback for Google OAuth callback: ${renderCallback}`);
  return renderCallback;
};
var callbackURL = getCallbackURL();
passport.use(new GoogleStrategy({
  clientID,
  clientSecret,
  callbackURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google OAuth profile received:", {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName
    });
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error("No email found in Google profile"), void 0);
    }
    let user = await mongoStorage.getUserByEmail(email);
    if (user) {
      console.log("Existing user found, logging in:", user.email);
      return done(null, user);
    }
    const firstName = profile.name?.givenName || "";
    const lastName = profile.name?.familyName || "";
    const displayName = profile.displayName || email.split("@")[0];
    const newUser = await mongoStorage.createUser({
      username: email,
      email,
      firstName,
      lastName,
      password: "",
      // No password needed for OAuth users
      favorites: [],
      isVerified: true,
      // Google accounts are pre-verified
      isAdmin: false,
      balance: 0,
      kycStatus: "none",
      profilePicture: profile.photos?.[0]?.value || "",
      googleId: profile.id
    });
    console.log("New Google user created:", newUser.email);
    return done(null, newUser);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return done(error, void 0);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await mongoStorage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// server/routes.mongo.ts
import passport2 from "passport";

// server/api/chatbot-routes.ts
import { Router } from "express";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
var router = Router();
var token = process.env.GITHUB_TOKEN || "";
var endpoint = "https://models.github.ai/inference";
var model3 = "openai/gpt-4.1-mini";
var client = null;
if (token) {
  client = ModelClient(
    endpoint,
    new AzureKeyCredential(token)
  );
}
var NEDAXER_KNOWLEDGE = `
Nedaxer is a comprehensive cryptocurrency trading platform offering:

FUNDING & DEPOSITS:
- Deposit cryptocurrencies using generated wallet addresses
- Support for multiple networks: Ethereum Network, BEP-20 (Binance Smart Chain)
- Popular cryptocurrencies: Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Tether (USDT), and more
- Real-time balance updates after deposits
- QR codes provided for easy mobile deposits

TRADING FEATURES:
- Spot Trading: Buy and sell cryptocurrencies at current market prices
- Futures Trading: Leveraged trading with position management
- Convert: Exchange between different cryptocurrencies
- Real-time market data and charts
- Order types: Market orders, limit orders

STAKING:
- Earn rewards by staking supported cryptocurrencies
- Various APY rates depending on the cryptocurrency
- Flexible and fixed staking options available

ACCOUNT FEATURES:
- Unified Trading Account and Funding Account management
- Portfolio tracking and performance analytics
- Referral program with commission earnings (20% spot, 25% futures, 15% staking)
- 24/7 customer support via chatbot
- Multi-language support

SECURITY:
- Regulated exchange with robust customer protections
- Email verification required for account activation
- Secure wallet address generation
- Two-factor authentication available

To make a deposit:
1. Go to Assets page
2. Select the cryptocurrency you want to deposit
3. Choose the network (Ethereum or BEP-20)
4. Copy the generated wallet address or scan QR code
5. Send funds from your external wallet
6. Wait for network confirmation

For trading:
1. Ensure you have funds in your account
2. Go to Spot or Futures trading page
3. Select trading pair
4. Choose order type and amount
5. Execute the trade

Need help with anything specific? I'm here to assist with account setup, trading, deposits, or any other platform features.
`;
router.post("/message", async (req, res) => {
  try {
    const { message, language, conversationHistory, userName } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!client) {
      return res.json({
        response: "I'm sorry, the chat service is temporarily unavailable. Please contact our support team directly for assistance with your account or trading questions."
      });
    }
    const contextMessages = [
      {
        role: "system",
        content: `You are Nedaxer Bot, a helpful customer support assistant for Nedaxer cryptocurrency trading platform. You are currently helping ${userName || "a user"}.

IMPORTANT INSTRUCTIONS:
- Always respond in ${getLanguageName(language)} language
- Be professional, helpful, and concise
- Focus on helping with Nedaxer platform features
- Use the knowledge base provided to answer questions accurately
- If you don't know something specific about Nedaxer, admit it and suggest contacting human support
- Keep responses conversational and friendly
- For complex trading or technical issues, guide users step-by-step

NEDAXER PLATFORM KNOWLEDGE:
${NEDAXER_KNOWLEDGE}

Respond as Nedaxer Bot helping a user with their question about the platform.`
      }
    ];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-5).forEach((msg) => {
        contextMessages.push({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        });
      });
    }
    contextMessages.push({
      role: "user",
      content: message
    });
    const response = await client.path("/chat/completions").post({
      body: {
        messages: contextMessages,
        temperature: 0.7,
        top_p: 1,
        model: model3,
        max_tokens: 500
      }
    });
    if (isUnexpected(response)) {
      throw response.body.error;
    }
    const responseContent = response.body.choices[0]?.message?.content || "I apologize, but I'm having trouble processing your request right now. Please try again or contact our human support team.";
    res.json({ response: responseContent });
  } catch (error) {
    console.error("Chatbot API error:", error);
    res.status(500).json({
      error: "Internal server error",
      response: "I'm sorry, I'm experiencing technical difficulties. Please try again later or contact our support team directly."
    });
  }
});
function getLanguageName(code) {
  const languageMap = {
    "en": "English",
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "zh-CN": "Simplified Chinese",
    "zh-TW": "Traditional Chinese",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "eo": "Esperanto",
    "et": "Estonian",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "rw": "Kinyarwanda",
    "ko": "Korean",
    "ku": "Kurdish",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ny": "Nyanja (Chichewa)",
    "or": "Odia (Oriya)",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tl": "Tagalog",
    "tg": "Tajik",
    "ta": "Tamil",
    "tt": "Tatar",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "tk": "Turkmen",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "ug": "Uyghur",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
  };
  return languageMap[code] || "English";
}
var chatbot_routes_default = router;

// server/routes.mongo.ts
import compression from "compression";
import serveStatic from "serve-static";
var requireAuth2 = async (req, res, next) => {
  console.log("\u{1F510} Auth check:", {
    hasSession: !!req.session,
    userId: req.session?.userId,
    sessionId: req.sessionID
  });
  if (!req.session?.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  if (req.session.userId === "ADMIN001" || req.session.adminAuthenticated) {
    return next();
  }
  try {
    let userId = req.session.userId;
    if (typeof userId === "object" && userId.toString) {
      userId = userId.toString();
    }
    const user = await mongoStorage.getUser(userId);
    if (!user) {
      console.log(`User not found for session userId: ${userId}`);
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
    if (req.session.userId !== userId) {
      req.session.userId = userId;
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(500).json({ success: false, message: "Authentication error" });
  }
  next();
};
var requireAdmin = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const user = await mongoStorage.getUser(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
async function registerRoutes(app2) {
  await connectToDatabase();
  const MongoDBStore = MongoStore(session);
  const mongoUri2 = process.env.MONGODB_URI;
  if (!mongoUri2) {
    throw new Error("MONGODB_URI environment variable is required");
  }
  const store = new MongoDBStore({
    uri: mongoUri2,
    collection: "sessions"
  });
  store.on("error", function(error) {
    console.log("Session store error:", error);
  });
  app2.use(session({
    secret: process.env.SESSION_SECRET || "nedaxer-trading-platform-secret-2025",
    resave: false,
    // Don't save session if not modified
    saveUninitialized: false,
    // Don't create sessions until something stored
    store,
    cookie: {
      secure: false,
      // Set to true if using HTTPS
      httpOnly: false,
      // Allow browser access for debugging
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      // 1 week
      sameSite: "lax",
      // Allow cross-site requests
      path: "/"
      // Ensure cookie is available for all paths
    },
    name: "connect.sid",
    // Explicit session name
    rolling: false
    // Don't reset expiration on every request
  }));
  app2.use(passport2.initialize());
  app2.use(passport2.session());
  app2.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return req.method === "GET" && res.getHeader("content-type")?.includes("text");
    }
  }));
  app2.use("/optimized", serveStatic("public/optimized", {
    maxAge: "1y",
    setHeaders: (res, path4) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Vary", "Accept-Encoding");
      if (path4.includes(".webp")) {
        res.setHeader("Content-Type", "image/webp");
      } else if (path4.includes(".avif")) {
        res.setHeader("Content-Type", "image/avif");
      }
    }
  }));
  app2.use("/images", serveStatic("public/images", {
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=604800");
      res.setHeader("Vary", "Accept-Encoding");
    }
  }));
  await connectToDatabase();
  setImmediate(async () => {
    try {
      console.log("Starting background image optimization...");
      await imageOptimizer.optimizeAllImages();
      console.log("Background image optimization completed");
    } catch (error) {
      console.error("Background image optimization failed:", error);
    }
  });
  app2.get("/api/images/optimize", async (req, res) => {
    try {
      const { src } = req.query;
      if (!src || typeof src !== "string") {
        return res.status(400).json({
          success: false,
          message: "Image source parameter is required"
        });
      }
      const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
      const optimizedImage = await imageOptimizer.optimizeImage(cleanSrc);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.json({
        success: true,
        ...optimizedImage
      });
    } catch (error) {
      console.error("Image optimization API error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to optimize image"
      });
    }
  });
  app2.get("/api/config/recaptcha", async (req, res) => {
    try {
      const siteKey = process.env.RECAPTCHA_SITE_KEY || "";
      res.json({
        success: true,
        siteKey
      });
    } catch (error) {
      console.error("Error getting reCAPTCHA config:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get reCAPTCHA configuration"
      });
    }
  });
  app2.get("/api/crypto/prices", async (req, res) => {
    try {
      const prices = await getCoinGeckoPrices();
      res.json({ success: true, data: prices });
    } catch (error) {
      console.error("Error fetching crypto prices:", error);
      res.status(500).json({ success: false, message: "Failed to fetch crypto prices" });
    }
  });
  app2.get("/api/market-data/conversion-rates", async (req, res) => {
    try {
      const { exchangeRateService: exchangeRateService2 } = await Promise.resolve().then(() => (init_exchange_rate_service(), exchange_rate_service_exports));
      const ratesData = await exchangeRateService2.getRates();
      res.json({
        success: true,
        data: ratesData.rates,
        source: ratesData.source,
        lastUpdated: ratesData.lastUpdated,
        isRealTime: ratesData.success
      });
    } catch (error) {
      console.error("Error fetching conversion rates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch conversion rates"
      });
    }
  });
  app2.post("/api/market-data/conversion-rates/refresh", async (req, res) => {
    try {
      const { exchangeRateService: exchangeRateService2 } = await Promise.resolve().then(() => (init_exchange_rate_service(), exchange_rate_service_exports));
      const ratesData = await exchangeRateService2.forceRefresh();
      res.json({
        success: true,
        data: ratesData.rates,
        source: ratesData.source,
        lastUpdated: ratesData.lastUpdated,
        isRealTime: ratesData.success,
        message: "Exchange rates refreshed successfully"
      });
    } catch (error) {
      console.error("Error refreshing conversion rates:", error);
      res.status(500).json({
        success: false,
        message: "Failed to refresh conversion rates"
      });
    }
  });
  app2.post("/api/users/search", requireAuth2, async (req, res) => {
    try {
      const { identifier } = req.body;
      if (!identifier || typeof identifier !== "string") {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email or UID"
        });
      }
      const trimmedIdentifier = identifier.trim();
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findOne({
        $or: [
          { email: trimmedIdentifier },
          { uid: trimmedIdentifier }
        ]
      }).select("_id uid email username firstName lastName profilePicture");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      console.log("\u{1F50D} User search result:", {
        userId: user._id,
        hasProfilePicture: !!user.profilePicture,
        profilePictureLength: user.profilePicture ? user.profilePicture.length : 0
      });
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error("User search error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search user"
      });
    }
  });
  app2.post("/api/user/change-password", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required"
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const bcrypt3 = await import("bcrypt");
      const user = await User2.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      const isCurrentPasswordValid = await bcrypt3.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt3.hash(newPassword, saltRounds);
      await User2.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        actualPassword: newPassword
      });
      console.log(`\u{1F510} Password changed successfully for user ${userId}`);
      const { getWebSocketServer: getWebSocketServer2 } = await Promise.resolve().then(() => (init_websocket(), websocket_exports));
      const wss3 = getWebSocketServer2();
      if (wss3) {
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "PASSWORD_CHANGED",
              userId,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        });
      }
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to change password"
      });
    }
  });
  app2.post("/api/wallet/transfer", requireAuth2, async (req, res) => {
    const senderId = req.session.userId;
    console.log(`\u{1F680} Transfer request initiated by sender: ${senderId}`);
    try {
      const { recipientId, amount } = req.body;
      console.log(`\u{1F4CB} Transfer details - Recipient: ${recipientId}, Amount: ${amount}`);
      if (!recipientId || typeof recipientId !== "string") {
        console.log("\u274C Invalid recipient provided");
        return res.status(400).json({
          success: false,
          message: "Invalid recipient"
        });
      }
      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        console.log("\u274C Invalid transfer amount provided");
        return res.status(400).json({
          success: false,
          message: "Invalid transfer amount"
        });
      }
      if (senderId === recipientId) {
        console.log("\u274C User attempting to transfer to themselves");
        return res.status(400).json({
          success: false,
          message: "Cannot transfer to yourself"
        });
      }
      const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
      const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
      const { Transfer: Transfer2 } = await Promise.resolve().then(() => (init_Transfer(), Transfer_exports));
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const sender = await User2.findById(senderId).select("transferAccess");
      if (!sender) {
        console.log("\u274C Sender not found");
        return res.status(404).json({
          success: false,
          message: "Sender not found"
        });
      }
      if (sender.transferAccess === false) {
        console.log("\u274C Transfer access denied for user:", senderId);
        return res.status(403).json({
          success: false,
          message: "Transfer access has been disabled by administrator"
        });
      }
      const mongoose13 = await import("mongoose");
      const session2 = await mongoose13.startSession();
      session2.startTransaction();
      try {
        const usdCurrency = await Currency2.findOne({ symbol: "USD" });
        if (!usdCurrency) {
          throw new Error("USD currency not found");
        }
        const senderBalance = await UserBalance2.findOne({
          userId: senderId,
          currencyId: usdCurrency._id
        }).session(session2);
        console.log(`\u{1F4B0} Sender balance found: ${senderBalance ? senderBalance.amount : "NULL"}`);
        console.log(`\u{1F4B0} Transfer amount: ${transferAmount}`);
        if (!senderBalance) {
          throw new Error("Sender balance not found");
        }
        if (senderBalance.amount < transferAmount) {
          throw new Error(`Insufficient balance. Current: $${senderBalance.amount}, Required: $${transferAmount}`);
        }
        let recipientBalance = await UserBalance2.findOne({
          userId: recipientId,
          currencyId: usdCurrency._id
        }).session(session2);
        if (!recipientBalance) {
          recipientBalance = new UserBalance2({
            userId: recipientId,
            currencyId: usdCurrency._id,
            amount: 0
          });
        }
        console.log(`\u{1F4B0} Before transfer - Sender balance: $${senderBalance.amount}, Recipient balance: $${recipientBalance.amount}`);
        senderBalance.amount -= transferAmount;
        recipientBalance.amount += transferAmount;
        console.log(`\u{1F4B0} After transfer calculation - Sender balance: $${senderBalance.amount}, Recipient balance: $${recipientBalance.amount}`);
        console.log("\u{1F4BE} Saving sender balance...");
        await senderBalance.save({ session: session2 });
        console.log("\u2705 Sender balance saved");
        console.log("\u{1F4BE} Saving recipient balance...");
        await recipientBalance.save({ session: session2 });
        console.log("\u2705 Recipient balance saved");
        const transactionId = `TRF${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
        const transfer = new Transfer2({
          fromUserId: senderId,
          toUserId: recipientId,
          amount: transferAmount,
          currency: "USD",
          status: "completed",
          transactionId,
          description: "USD Transfer"
        });
        await transfer.save({ session: session2 });
        const sender2 = await User2.findById(senderId).select("firstName lastName");
        const recipient = await User2.findById(recipientId).select("firstName lastName");
        const { Notification: Notification2 } = await Promise.resolve().then(() => (init_Notification(), Notification_exports));
        const senderNotification = new Notification2({
          userId: senderId,
          type: "transfer_sent",
          title: "Transfer Sent",
          message: `You sent $${transferAmount.toFixed(2)} to ${recipient?.firstName} ${recipient?.lastName}`,
          data: {
            transferId: transfer._id,
            transactionId,
            amount: transferAmount,
            currency: "USD",
            recipientName: `${recipient?.firstName} ${recipient?.lastName}`,
            recipientId,
            status: "completed"
          }
        });
        const recipientNotification = new Notification2({
          userId: recipientId,
          type: "transfer_received",
          title: "Transfer Received",
          message: `You received $${transferAmount.toFixed(2)} from ${sender2?.firstName} ${sender2?.lastName}`,
          data: {
            transferId: transfer._id,
            transactionId,
            amount: transferAmount,
            currency: "USD",
            senderName: `${sender2?.firstName} ${sender2?.lastName}`,
            senderId,
            status: "completed"
          }
        });
        console.log("\u{1F4BE} Saving sender notification:", senderNotification);
        await senderNotification.save({ session: session2 });
        console.log("\u2705 Sender notification saved");
        console.log("\u{1F4BE} Saving recipient notification:", recipientNotification);
        await recipientNotification.save({ session: session2 });
        console.log("\u2705 Recipient notification saved");
        console.log("\u{1F504} Committing transaction...");
        await session2.commitTransaction();
        console.log("\u2705 Transaction committed successfully");
        const { getWebSocketServer: getWebSocketServer2 } = await Promise.resolve().then(() => (init_websocket(), websocket_exports));
        const wss3 = getWebSocketServer2();
        if (wss3) {
          wss3.clients.forEach((client2) => {
            if (client2.readyState === 1) {
              client2.send(JSON.stringify({
                type: "TRANSFER_CREATED",
                senderId,
                recipientId,
                amount: transferAmount,
                transactionId,
                senderName: `${sender2?.firstName} ${sender2?.lastName}`,
                recipientName: `${recipient?.firstName} ${recipient?.lastName}`
              }));
              client2.send(JSON.stringify({
                type: "balance_update",
                userId: senderId
              }));
              client2.send(JSON.stringify({
                type: "balance_update",
                userId: recipientId
              }));
              client2.send(JSON.stringify({
                type: "notification_update",
                userId: senderId
              }));
              client2.send(JSON.stringify({
                type: "notification_update",
                userId: recipientId
              }));
            }
          });
        }
        res.json({
          success: true,
          message: "Transfer completed successfully",
          transactionId
        });
      } catch (error) {
        await session2.abortTransaction();
        throw error;
      } finally {
        session2.endSession();
      }
    } catch (error) {
      console.error("Transfer error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to complete transfer"
      });
    }
  });
  app2.get("/api/transfers/history", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log(`\u{1F4CB} Getting transfer history for user: ${userId}`);
      if (userId === "ADMIN001" || req.session.adminAuthenticated) {
        console.log("\u2705 Admin user - returning all transfers");
        const { Transfer: Transfer3 } = await Promise.resolve().then(() => (init_Transfer(), Transfer_exports));
        const allTransfers = await Transfer3.find({
          // Filter out ALL zero transfers regardless of source
          $and: [
            { amount: { $gt: 0 } },
            { amount: { $exists: true } },
            { amount: { $ne: null } },
            { amount: { $ne: "" } }
          ]
        }).sort({ createdAt: -1 }).limit(100).populate("fromUserId", "firstName lastName email uid").populate("toUserId", "firstName lastName email uid");
        const formattedTransfers2 = allTransfers.filter((transfer) => transfer.fromUserId && transfer.toUserId).map((transfer) => ({
          _id: transfer._id,
          transactionId: transfer.transactionId,
          type: "admin_view",
          amount: transfer.amount,
          currency: transfer.currency,
          status: transfer.status,
          fromUser: {
            _id: transfer.fromUserId._id,
            name: `${transfer.fromUserId.firstName || ""} ${transfer.fromUserId.lastName || ""}`.trim() || transfer.fromUserId.email,
            email: transfer.fromUserId.email,
            uid: transfer.fromUserId.uid
          },
          toUser: {
            _id: transfer.toUserId._id,
            name: `${transfer.toUserId.firstName || ""} ${transfer.toUserId.lastName || ""}`.trim() || transfer.toUserId.email,
            email: transfer.toUserId.email,
            uid: transfer.toUserId.uid
          },
          createdAt: transfer.createdAt
        }));
        return res.json({
          success: true,
          data: formattedTransfers2
        });
      }
      const { Transfer: Transfer2 } = await Promise.resolve().then(() => (init_Transfer(), Transfer_exports));
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const transfers = await Transfer2.find({
        $and: [
          {
            $or: [
              { fromUserId: userId },
              { toUserId: userId }
            ]
          },
          // Filter out ALL zero transfers regardless of source
          { amount: { $gt: 0 } },
          { amount: { $exists: true } },
          { amount: { $ne: null } },
          { amount: { $ne: "" } }
        ]
      }).sort({ createdAt: -1 }).limit(100).populate("fromUserId", "firstName lastName email uid").populate("toUserId", "firstName lastName email uid");
      console.log(`\u2705 Found ${transfers.length} transfers for user ${userId}`);
      const formattedTransfers = transfers.filter((transfer) => transfer.fromUserId && transfer.toUserId).map((transfer) => {
        const isSender = transfer.fromUserId._id.toString() === userId;
        return {
          _id: transfer._id,
          transactionId: transfer.transactionId,
          type: isSender ? "sent" : "received",
          amount: transfer.amount,
          currency: transfer.currency,
          status: transfer.status,
          fromUser: {
            _id: transfer.fromUserId._id,
            name: `${transfer.fromUserId.firstName || ""} ${transfer.fromUserId.lastName || ""}`.trim() || transfer.fromUserId.email,
            email: transfer.fromUserId.email,
            uid: transfer.fromUserId.uid
          },
          toUser: {
            _id: transfer.toUserId._id,
            name: `${transfer.toUserId.firstName || ""} ${transfer.toUserId.lastName || ""}`.trim() || transfer.toUserId.email,
            email: transfer.toUserId.email,
            uid: transfer.toUserId.uid
          },
          createdAt: transfer.createdAt
        };
      });
      console.log(`\u{1F4E4} Returning ${formattedTransfers.length} formatted transfers`);
      res.json({
        success: true,
        data: formattedTransfers
      });
    } catch (error) {
      console.error("Transfer history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch transfer history"
      });
    }
  });
  app2.get("/api/transfers/details/:transactionId", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { transactionId } = req.params;
      const { Transfer: Transfer2 } = await Promise.resolve().then(() => (init_Transfer(), Transfer_exports));
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const transfer = await Transfer2.findOne({
        transactionId,
        $or: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      }).populate("fromUserId", "firstName lastName email uid").populate("toUserId", "firstName lastName email uid");
      if (!transfer) {
        return res.status(404).json({
          success: false,
          message: "Transfer not found"
        });
      }
      const isSender = transfer.fromUserId._id.toString() === userId;
      const formattedTransfer = {
        _id: transfer._id,
        transactionId: transfer.transactionId,
        type: isSender ? "sent" : "received",
        amount: transfer.amount,
        currency: transfer.currency,
        status: transfer.status,
        description: transfer.description,
        fromUserId: transfer.fromUserId._id,
        toUserId: transfer.toUserId._id,
        senderName: `${transfer.fromUserId.firstName} ${transfer.fromUserId.lastName}`,
        recipientName: `${transfer.toUserId.firstName} ${transfer.toUserId.lastName}`,
        senderEmail: transfer.fromUserId.email,
        recipientEmail: transfer.toUserId.email,
        senderUID: transfer.fromUserId.uid,
        recipientUID: transfer.toUserId.uid,
        createdAt: transfer.createdAt,
        updatedAt: transfer.updatedAt
      };
      res.json({
        success: true,
        data: formattedTransfer
      });
    } catch (error) {
      console.error("Transfer details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch transfer details"
      });
    }
  });
  const { getRealtimePrices: getRealtimePrices2 } = await Promise.resolve().then(() => (init_realtime_prices(), realtime_prices_exports));
  app2.get("/api/crypto/realtime-prices", getRealtimePrices2);
  app2.get("/api/news/logo/:source", async (req, res) => {
    try {
      const { generateLogoSVG: generateLogoSVG2 } = await Promise.resolve().then(() => (init_logo_service(), logo_service_exports));
      const sourceName = decodeURIComponent(req.params.source);
      const logoSVG = generateLogoSVG2(sourceName);
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(logoSVG);
    } catch (error) {
      console.error("Error generating logo:", error);
      res.status(500).send("Error generating logo");
    }
  });
  app2.get("/api/crypto/news", async (req, res) => {
    try {
      const { default: Parser } = await import("rss-parser");
      const parser = new Parser({
        timeout: 2e4,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache"
        },
        customFields: {
          item: [
            ["media:content", "mediaContent"],
            ["media:thumbnail", "mediaThumbnail"],
            ["content:encoded", "contentEncoded"],
            ["media:group", "mediaGroup"],
            ["enclosure", "enclosure"]
          ]
        }
      });
      const feeds = {
        "CoinDesk": "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "CoinTelegraph": "https://cointelegraph.com/rss",
        "Decrypt": "https://decrypt.co/feed",
        "CryptoSlate": "https://cryptoslate.com/feed/",
        "CryptoBriefing": "https://cryptobriefing.com/feed/",
        "BeInCrypto": "https://beincrypto.com/feed/",
        "CryptoNews": "https://cryptonews.com/news/feed/",
        "Google News - Crypto": "https://news.google.com/rss/search?q=cryptocurrency&hl=en-US&gl=US&ceid=US:en",
        "Google News - Bitcoin": "https://news.google.com/rss/search?q=bitcoin&hl=en-US&gl=US&ceid=US:en"
      };
      const allNews = [];
      const fetchPromises = [];
      const fetchRSSWithProxy = async (source, url) => {
        if (source === "BeInCrypto") {
          try {
            const response = await fetch(url, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/rss+xml, application/xml, text/xml",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://beincrypto.com",
                "Origin": "https://beincrypto.com"
              }
            });
            if (!response.ok) {
              console.log(`BeInCrypto RSS not accessible (${response.status}), using alternative source`);
              return null;
            }
            const xmlText = await response.text();
            return parser.parseString(xmlText);
          } catch (error) {
            console.log(`BeInCrypto RSS fetch failed:`, error.message);
            return null;
          }
        } else {
          return parser.parseURL(url);
        }
      };
      for (const [source, url] of Object.entries(feeds)) {
        const fetchPromise = fetchRSSWithProxy(source, url).then((feed) => {
          if (!feed) return [];
          return feed.items.slice(0, 5).map((item) => {
            let imageUrl = null;
            let mediaType = "image";
            let videoUrl = null;
            if (source === "Google News - Crypto" || source === "Google News - Bitcoin") {
              if (item.mediaContent) {
                if (Array.isArray(item.mediaContent)) {
                  const videoContent = item.mediaContent.find(
                    (content) => content["$"]?.medium === "video" || content["$"]?.type?.includes("video")
                  );
                  if (videoContent?.["$"]?.url) {
                    videoUrl = videoContent["$"].url;
                    mediaType = "video";
                  }
                  const imageContent = item.mediaContent.find(
                    (content) => content["$"]?.medium === "image" || content["$"]?.type?.includes("image")
                  );
                  if (imageContent?.["$"]?.url) {
                    imageUrl = imageContent["$"].url;
                  }
                } else if (item.mediaContent["$"]?.url) {
                  if (item.mediaContent["$"]?.medium === "video" || item.mediaContent["$"]?.type?.includes("video")) {
                    videoUrl = item.mediaContent["$"].url;
                    mediaType = "video";
                  } else {
                    imageUrl = item.mediaContent["$"].url;
                  }
                }
              }
              if (!imageUrl && item.mediaThumbnail?.["$"]?.url) {
                imageUrl = item.mediaThumbnail["$"].url;
              }
              if (!imageUrl && item.content) {
                const contentImgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (contentImgMatch) {
                  imageUrl = contentImgMatch[1];
                }
              }
              if (!imageUrl && item.description) {
                const descImgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                if (descImgMatch) {
                  imageUrl = descImgMatch[1];
                }
              }
              if (!imageUrl && item.link) {
                const articleUrl = item.link;
                if (articleUrl.includes("reuters.com") || articleUrl.includes("bloomberg.com") || articleUrl.includes("cnbc.com") || articleUrl.includes("cnn.com") || articleUrl.includes("bbc.com")) {
                  const urlParts = articleUrl.split("/");
                  const domain = urlParts[2];
                  imageUrl = `https://${domain}/favicon.ico`;
                }
              }
            } else if (source === "CryptoSlate") {
              if (item.enclosure?.url) {
                imageUrl = item.enclosure.url;
              } else if (item.mediaContent?.["$"]?.url) {
                imageUrl = item.mediaContent["$"].url;
              } else if (item["media:content"]?.["$"]?.url) {
                imageUrl = item["media:content"]["$"].url;
              } else if (item.contentEncoded) {
                const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              } else if (item["content:encoded"]) {
                const imgMatch = item["content:encoded"].match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              }
            } else if (source === "BeInCrypto") {
              if (item.mediaContent) {
                if (Array.isArray(item.mediaContent)) {
                  const videoContent = item.mediaContent.find(
                    (content) => content["$"]?.medium === "video" || content["$"]?.type?.includes("video")
                  );
                  if (videoContent?.["$"]?.url) {
                    videoUrl = videoContent["$"].url;
                    mediaType = "video";
                  }
                }
              }
              if (item.mediaThumbnail?.["$"]?.url) {
                imageUrl = item.mediaThumbnail["$"].url;
              } else if (item["media:thumbnail"]?.["$"]?.url) {
                imageUrl = item["media:thumbnail"]["$"].url;
              } else if (item.enclosure?.url) {
                imageUrl = item.enclosure.url;
              } else if (item.contentEncoded) {
                const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              } else if (item["content:encoded"]) {
                const imgMatch = item["content:encoded"].match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              }
              if (!imageUrl && item.description) {
                const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              }
            } else if (source === "CoinDesk") {
              if (item.enclosure?.url && item.enclosure.type?.includes("image")) {
                imageUrl = item.enclosure.url;
              } else if (item.mediaContent?.["$"]?.url) {
                imageUrl = item.mediaContent["$"].url;
              } else if (item["media:content"]?.["$"]?.url) {
                imageUrl = item["media:content"]["$"].url;
              } else if (item.contentEncoded) {
                const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              } else if (item["content:encoded"]) {
                const imgMatch = item["content:encoded"].match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              }
            } else if (source === "CryptoBriefing") {
              if (item.mediaThumbnail?.["$"]?.url) {
                imageUrl = item.mediaThumbnail["$"].url;
              } else if (item["media:thumbnail"]?.["$"]?.url) {
                imageUrl = item["media:thumbnail"]["$"].url;
              } else if (item.enclosure?.url) {
                imageUrl = item.enclosure.url;
              } else if (item.contentEncoded) {
                const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              } else if (item["content:encoded"]) {
                const imgMatch = item["content:encoded"].match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              }
            } else {
              if (item.enclosure?.url && (item.enclosure.type?.includes("image") || item.enclosure.url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
                imageUrl = item.enclosure.url;
              } else if (item["media:thumbnail"]?.["$"]?.url) {
                imageUrl = item["media:thumbnail"]["$"].url;
              } else if (item["media:content"]?.["$"]?.url && item["media:content"]["$"].medium === "image") {
                imageUrl = item["media:content"]["$"].url;
              } else if (item.image?.url) {
                imageUrl = item.image.url;
              } else if (item.content && typeof item.content === "string") {
                const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              } else if (item["content:encoded"]) {
                const imgMatch = item["content:encoded"].match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                  imageUrl = imgMatch[1];
                }
              }
            }
            if (!imageUrl && item.description) {
              const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) {
                imageUrl = imgMatch[1];
              }
            }
            if (!imageUrl) {
              const logoMap = {
                "CoinDesk": "/logos/coindesk.png",
                "CryptoSlate": "/logos/cryptoslate.jpg",
                "CryptoBriefing": "/logos/cryptobriefing.png",
                "BeInCrypto": "/logos/beincrypto.jpg",
                "Google News - Crypto": "/logos/google-news.jpg",
                "Google News - Bitcoin": "/logos/google-news.jpg",
                "CoinTelegraph": "https://cointelegraph.com/favicon.ico",
                "Decrypt": "https://decrypt.co/favicon.ico",
                "CryptoNews": "https://cryptonews.com/favicon.ico"
              };
              imageUrl = logoMap[source] || `/api/news/logo/${encodeURIComponent(source)}`;
            }
            if (imageUrl && imageUrl.startsWith("//")) {
              imageUrl = "https:" + imageUrl;
            } else if (imageUrl && imageUrl.startsWith("/")) {
              const domainMap = {
                "CoinDesk": "https://www.coindesk.com",
                "CoinTelegraph": "https://cointelegraph.com",
                "Decrypt": "https://decrypt.co",
                "CryptoSlate": "https://cryptoslate.com",
                "CryptoBriefing": "https://cryptobriefing.com",
                "BeInCrypto": "https://beincrypto.com",
                "CryptoNews": "https://cryptonews.com"
              };
              const domain = domainMap[source];
              if (domain) {
                imageUrl = domain + imageUrl;
              }
            }
            return {
              title: item.title || "No Title",
              description: item.contentSnippet || item.summary || item.content?.replace(/<[^>]*>/g, "") || "No description available",
              url: item.link || "#",
              source: { name: source },
              publishedAt: item.pubDate || item.isoDate || (/* @__PURE__ */ new Date()).toISOString(),
              urlToImage: imageUrl,
              mediaType,
              videoUrl
            };
          });
        }).catch((error) => {
          console.error(`Error fetching ${source}:`, error.message);
          if (source === "BeInCrypto") {
            console.log("BeInCrypto may be region-blocked, skipping...");
          }
          return [];
        });
        fetchPromises.push(fetchPromise);
      }
      const results = await Promise.all(fetchPromises);
      for (const articles of results) {
        allNews.push(...articles);
      }
      allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      res.json(allNews.slice(0, 30));
    } catch (error) {
      console.error("Error fetching crypto news:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch crypto news",
        error: error.message
      });
    }
  });
  app2.get("/api/auth/user", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      console.log("\u{1F50D} Auth request - Session userId:", req.session.userId);
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const user = await mongoStorage2.getUser(req.session.userId);
      if (!user) {
        console.log("\u274C User not found for session ID:", req.session.userId);
        req.session.destroy((err) => {
          if (err) console.error("Session destroy error:", err);
        });
        return res.status(401).json({
          success: false,
          message: "Invalid session - user not found"
        });
      }
      const userData = {
        _id: user._id,
        uid: user.uid,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture || null,
        // Explicit null for consistency
        favorites: user.favorites || [],
        preferences: user.preferences,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      };
      console.log("\u2705 Auth user response:", {
        userId: user._id,
        uid: user.uid,
        username: user.username,
        hasProfilePicture: !!user.profilePicture,
        profilePictureLength: user.profilePicture?.length
      });
      console.log("\u{1F4E4} Sending user data with UID:", userData.uid);
      res.json(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ success: false, message: "Failed to fetch user data" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Registration attempt with data:", {
        ...req.body,
        password: req.body.password ? "********" : void 0
      });
      if (req.body.recaptchaToken) {
        try {
          const axios4 = (await import("axios")).default;
          const response = await axios4.post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: {
              secret: process.env.RECAPTCHA_SECRET_KEY,
              response: req.body.recaptchaToken
            }
          });
          if (!response.data.success) {
            console.log("reCAPTCHA verification failed:", response.data);
            return res.status(400).json({
              success: false,
              message: "reCAPTCHA verification failed. Please try again."
            });
          }
          console.log("\u2713 reCAPTCHA verification successful for registration");
        } catch (recaptchaError) {
          console.error("reCAPTCHA verification error:", recaptchaError);
          return res.status(500).json({
            success: false,
            message: "Unable to verify reCAPTCHA. Please try again."
          });
        }
      }
      const result = insertMongoUserSchema.safeParse(req.body);
      if (!result.success) {
        console.log("Registration validation failed:", result.error.format());
        return res.status(400).json({
          success: false,
          message: "Invalid registration data",
          errors: result.error.format()
        });
      }
      const { username, email, password, firstName, lastName } = result.data;
      const existingUsername = await mongoStorage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
      const existingEmail = await mongoStorage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
      const newUser = await mongoStorage.createUser({
        username,
        email,
        password,
        firstName,
        lastName
      });
      await mongoStorage.markUserAsVerified(newUser._id.toString());
      console.log(`User created with ID: ${newUser._id}`);
      try {
        const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
        const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
        const usdCurrency = await Currency2.findOne({ symbol: "USD" });
        if (usdCurrency) {
          const zeroBalance = new UserBalance2({
            userId: newUser._id,
            currencyId: usdCurrency._id,
            amount: 0
          });
          await zeroBalance.save();
          console.log("Created $0.00 USD balance for new user");
        }
      } catch (balanceError) {
        console.warn("Could not create initial balance:", balanceError);
      }
      req.session.userId = newUser._id.toString();
      console.log(`Registration and auto-login successful for user: ${email}`);
      return res.status(201).json({
        success: true,
        message: "Registration successful. You are now logged in.",
        user: {
          _id: newUser._id,
          uid: newUser.uid,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isVerified: true,
          profilePicture: null,
          isAdmin: false
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during registration"
      });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password, recaptchaToken } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Please enter both your email address and password to continue."
        });
      }
      if (recaptchaToken) {
        try {
          const axios4 = (await import("axios")).default;
          const response = await axios4.post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: {
              secret: process.env.RECAPTCHA_SECRET_KEY,
              response: recaptchaToken
            }
          });
          if (!response.data.success) {
            console.log("reCAPTCHA verification failed:", response.data);
            return res.status(400).json({
              success: false,
              message: "reCAPTCHA verification failed. Please try again."
            });
          }
          console.log("\u2713 reCAPTCHA verification successful");
        } catch (recaptchaError) {
          console.error("reCAPTCHA verification error:", recaptchaError);
          return res.status(500).json({
            success: false,
            message: "Unable to verify reCAPTCHA. Please try again."
          });
        }
      }
      const adminEmail = "nedaxer.us@gmail.com";
      const adminPassword = "SMART456";
      console.log("Checking admin login:", {
        inputEmail: username.toLowerCase(),
        adminEmail,
        emailMatch: username.toLowerCase() === adminEmail,
        passwordMatch: password === adminPassword
      });
      if (username.toLowerCase() === adminEmail && password === adminPassword) {
        console.log("\u2713 Admin hardcoded login successful - bypassing all MongoDB checks");
        req.session.userId = "ADMIN001";
        req.session.adminAuthenticated = true;
        req.session.save((err) => {
          if (err) console.error("Session save error:", err);
        });
        const adminUser = {
          _id: "ADMIN001",
          uid: "ADMIN001",
          username: adminEmail,
          email: adminEmail,
          firstName: "System",
          lastName: "Administrator",
          isVerified: true,
          isAdmin: true
        };
        return res.json({
          success: true,
          message: "Admin login successful",
          user: adminUser
        });
      }
      let user = await mongoStorage.getUserByUsername(username);
      if (!user) {
        user = await mongoStorage.getUserByEmail(username);
      }
      if (!user) {
        console.log("\u274C User not found for login attempt:", username);
        return res.status(401).json({
          success: false,
          message: "The email address you entered is not associated with any account. Please check your email or register for a new account."
        });
      }
      console.log("Password verification for user:", user.email);
      const isPasswordValid = await bcrypt2.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("\u274C Password invalid for user:", user.email);
        return res.status(401).json({
          success: false,
          message: "The password you entered is incorrect. Please check your password and try again."
        });
      }
      console.log("\u2705 Password valid for user:", user.email);
      req.session.userId = user._id.toString();
      res.json({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          uid: user.uid,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "We're experiencing technical difficulties. Please try again in a few moments, or contact support if the problem persists."
      });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to logout"
        });
      }
      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logout successful"
      });
    });
  });
  app2.get("/api/auth/debug-callback", (req, res) => {
    const getCallbackURL2 = () => {
      if (process.env.BASE_URL) {
        return `${process.env.BASE_URL}/auth/google/callback`;
      }
      if (process.env.REPLIT_DOMAINS) {
        return `https://${process.env.REPLIT_DOMAINS}/auth/google/callback`;
      }
      return "https://nedaxer.onrender.com/auth/google/callback";
    };
    res.json({
      callbackURL: getCallbackURL2(),
      environment: {
        BASE_URL: process.env.BASE_URL || "not set",
        REPLIT_DOMAINS: process.env.REPLIT_DOMAINS || "not set",
        NODE_ENV: process.env.NODE_ENV || "not set"
      }
    });
  });
  app2.get("/auth/google", passport2.authenticate("google", {
    scope: ["profile", "email"]
  }));
  app2.get(
    "/auth/google/callback",
    passport2.authenticate("google", { failureRedirect: "/account/login" }),
    async (req, res) => {
      if (req.user) {
        const user = req.user;
        req.session.userId = user._id.toString();
        console.log("Google OAuth successful for user:", user.email);
        res.redirect("/dashboard");
      } else {
        res.redirect("/account/login");
      }
    }
  );
  app2.get("/dashboard", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await mongoStorage.getUser(userId);
      if (!user) {
        return res.redirect("/account/login");
      }
      console.log(`Dashboard redirect for Google OAuth user: ${user.email}`);
      res.redirect("/mobile");
    } catch (error) {
      console.error("Dashboard error:", error);
      res.redirect("/account/login");
    }
  });
  app2.put("/api/auth/profile", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { username, firstName, lastName, profilePicture } = req.body;
      console.log("Profile update request:", {
        userId,
        hasProfilePicture: !!profilePicture,
        profilePictureLength: profilePicture?.length
      });
      if (profilePicture && !profilePicture.startsWith("data:image/")) {
        return res.status(400).json({
          success: false,
          message: "Invalid image format. Please use a valid image file."
        });
      }
      await mongoStorage.updateUserProfile(userId, {
        username,
        firstName,
        lastName,
        profilePicture
      });
      const updatedUser = await mongoStorage.getUser(userId);
      console.log("Profile updated successfully for user:", userId, {
        hasProfilePicture: !!updatedUser?.profilePicture,
        profilePictureLength: updatedUser?.profilePicture?.length
      });
      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          _id: updatedUser?._id,
          uid: updatedUser?.uid,
          username: updatedUser?.username,
          email: updatedUser?.email,
          firstName: updatedUser?.firstName,
          lastName: updatedUser?.lastName,
          profilePicture: updatedUser?.profilePicture,
          isVerified: updatedUser?.isVerified
        }
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  });
  app2.post("/api/favorites", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { cryptoPairSymbol, cryptoId } = req.body;
      await mongoStorage.addFavorite(userId, cryptoPairSymbol, cryptoId);
      res.json({ success: true, message: "Added to favorites" });
    } catch (error) {
      console.error("Add favorite error:", error);
      res.status(500).json({ success: false, message: "Failed to add favorite" });
    }
  });
  app2.delete("/api/favorites/:symbol", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { symbol } = req.params;
      await mongoStorage.removeFavorite(userId, symbol);
      res.json({ success: true, message: "Removed from favorites" });
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ success: false, message: "Failed to remove favorite" });
    }
  });
  app2.get("/api/favorites", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const favorites = await mongoStorage.getUserFavorites(userId);
      res.json({ success: true, data: favorites });
    } catch (error) {
      console.error("Get favorites error:", error);
      res.status(500).json({ success: false, message: "Failed to get favorites" });
    }
  });
  app2.put("/api/preferences", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const preferences = req.body;
      await mongoStorage.updateUserPreferences(userId, preferences);
      res.json({ success: true, message: "Preferences updated" });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({ success: false, message: "Failed to update preferences" });
    }
  });
  app2.get("/api/preferences", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const preferences = await mongoStorage.getUserPreferences(userId);
      res.json({ success: true, data: preferences });
    } catch (error) {
      console.error("Get preferences error:", error);
      res.status(500).json({ success: false, message: "Failed to get preferences" });
    }
  });
  app2.get("/api/balances", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
      const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
      const usdCurrency = await Currency2.findOne({ symbol: "USD" });
      if (!usdCurrency) {
        return res.json({
          success: true,
          balances: []
        });
      }
      let usdBalance = await UserBalance2.findOne({
        userId,
        currencyId: usdCurrency._id
      });
      if (!usdBalance) {
        usdBalance = await UserBalance2.create({
          userId,
          currencyId: usdCurrency._id,
          amount: 0,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      const formattedBalances = [{
        id: usdBalance._id,
        balance: usdBalance.amount,
        currency: {
          id: usdCurrency._id,
          symbol: usdCurrency.symbol,
          name: usdCurrency.name,
          type: "fiat",
          isActive: usdCurrency.isActive
        }
      }];
      res.json({
        success: true,
        balances: formattedBalances
      });
    } catch (error) {
      console.error("Balances fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch balances"
      });
    }
  });
  app2.post("/api/balances/reset-all", async (req, res) => {
    try {
      const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
      const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
      const usdCurrency = await Currency2.findOne({ symbol: "USD" });
      if (usdCurrency) {
        await UserBalance2.deleteMany({
          currencyId: { $ne: usdCurrency._id }
        });
        await UserBalance2.updateMany(
          { currencyId: usdCurrency._id },
          { $set: { amount: 0, updatedAt: /* @__PURE__ */ new Date() } }
        );
      }
      console.log("Reset all user balances to $0.00 USD only");
      res.json({
        success: true,
        message: "All user balances reset to $0.00 USD only"
      });
    } catch (error) {
      console.error("Error resetting balances:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reset balances"
      });
    }
  });
  app2.get("/api/wallet/summary", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
      const { Currency: Currency2 } = await Promise.resolve().then(() => (init_Currency(), Currency_exports));
      const usdCurrency = await Currency2.findOne({ symbol: "USD" });
      if (!usdCurrency) {
        return res.json({
          success: true,
          data: {
            totalUSDValue: 0,
            usdBalance: 0
          }
        });
      }
      let usdBalance = await UserBalance2.findOne({
        userId,
        currencyId: usdCurrency._id
      });
      if (!usdBalance) {
        usdBalance = await UserBalance2.create({
          userId,
          currencyId: usdCurrency._id,
          amount: 0,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      const totalUSDValue = usdBalance.amount;
      res.json({
        success: true,
        data: {
          totalUSDValue,
          usdBalance: totalUSDValue
        }
      });
    } catch (error) {
      console.error("Wallet summary error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch wallet summary"
      });
    }
  });
  app2.get("/api/admin/users/search", requireAdmin, async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.status(400).json({ success: false, message: "Search query required" });
      }
      const users = await mongoStorage.searchUsers(query);
      const formattedUsers = users.map((user) => ({
        _id: user._id,
        uid: user.uid,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        balance: user.balance || 0,
        createdAt: user.createdAt
      }));
      res.json({ success: true, users: formattedUsers });
    } catch (error) {
      console.error("Admin user search error:", error);
      res.status(500).json({ success: false, message: "Failed to search users" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Admin login attempt for:", email);
      if (email === "admin@nedaxer.com" && password === "SMART456") {
        req.session.adminAuthenticated = true;
        req.session.adminId = "admin";
        console.log("Setting admin session, ID:", req.sessionID);
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ success: false, message: "Session save failed" });
          }
          console.log("Admin session saved successfully");
          res.json({ success: true, message: "Admin authentication successful" });
        });
      } else {
        console.log("Invalid admin credentials provided");
        res.status(401).json({ success: false, message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
  const requireAdminAuth2 = (req, res, next) => {
    console.log("Admin auth check:", {
      sessionExists: !!req.session,
      adminAuth: req.session?.adminAuthenticated,
      sessionId: req.sessionID
    });
    if (!req.session?.adminAuthenticated) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    next();
  };
  app2.get("/api/debug/transfers-notifications", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { Transfer: Transfer2 } = await Promise.resolve().then(() => (init_Transfer(), Transfer_exports));
      const { Notification: Notification2 } = await Promise.resolve().then(() => (init_Notification(), Notification_exports));
      const transfers = await Transfer2.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }]
      }).sort({ createdAt: -1 }).limit(5);
      const notifications = await Notification2.find({ userId }).sort({ createdAt: -1 }).limit(10);
      const transferNotifications = await Notification2.find({
        type: { $in: ["transfer_sent", "transfer_received"] }
      }).sort({ createdAt: -1 }).limit(10);
      res.json({
        success: true,
        debug: {
          userId,
          transfers: transfers.length,
          userNotifications: notifications.length,
          transferNotifications: transferNotifications.length,
          latestTransfers: transfers,
          latestNotifications: notifications,
          latestTransferNotifications: transferNotifications
        }
      });
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/admin/users/search/email", requireAdminAuth2, async (req, res) => {
    try {
      const email = req.query.q;
      if (!email || email.length < 1) {
        return res.json([]);
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const users = await User2.find({
        email: { $regex: email, $options: "i" }
      }).select("-password").limit(10);
      const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
      const usersWithBalance = await Promise.all(
        users.map(async (user) => {
          const balance = await UserBalance2.findOne({ userId: user._id.toString() });
          return {
            ...user.toObject(),
            balance: balance?.usdBalance || 0
          };
        })
      );
      res.json(usersWithBalance);
    } catch (error) {
      console.error("Admin user email search error:", error);
      res.status(500).json({ success: false, message: "Failed to search users by email" });
    }
  });
  app2.get("/api/admin/users/search/uid", requireAdminAuth2, async (req, res) => {
    try {
      const uid = req.query.q;
      if (!uid || uid.length < 1) {
        return res.json([]);
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const users = await User2.find({
        uid: { $regex: uid, $options: "i" }
      }).select("-password").limit(10);
      const { UserBalance: UserBalance2 } = await Promise.resolve().then(() => (init_UserBalance(), UserBalance_exports));
      const usersWithBalance = await Promise.all(
        users.map(async (user) => {
          const balance = await UserBalance2.findOne({ userId: user._id.toString() });
          return {
            ...user.toObject(),
            balance: balance?.usdBalance || 0
          };
        })
      );
      res.json(usersWithBalance);
    } catch (error) {
      console.error("Admin user UID search error:", error);
      res.status(500).json({ success: false, message: "Failed to search users by UID" });
    }
  });
  app2.get("/api/admin/users/search", requireAdminAuth2, async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.length < 1) {
        return res.json([]);
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const usersWithBalance = await User2.aggregate([
        {
          $match: {
            $or: [
              { email: { $regex: query, $options: "i" } },
              { username: { $regex: query, $options: "i" } },
              { firstName: { $regex: query, $options: "i" } },
              { lastName: { $regex: query, $options: "i" } },
              { uid: { $regex: query, $options: "i" } }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 20
        },
        {
          $lookup: {
            from: "userbalances",
            localField: "_id",
            foreignField: "userId",
            as: "balanceInfo"
          }
        },
        {
          $addFields: {
            balance: {
              $ifNull: [
                { $arrayElemAt: ["$balanceInfo.amount", 0] },
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            username: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            isVerified: 1,
            isAdmin: 1,
            balance: 1,
            lastActivity: 1,
            onlineTime: { $ifNull: ["$onlineTime", 0] },
            isOnline: { $ifNull: ["$isOnline", false] },
            sessionStart: 1,
            createdAt: 1,
            requiresDeposit: { $ifNull: ["$requiresDeposit", false] },
            withdrawalAccess: { $ifNull: ["$withdrawalAccess", false] },
            withdrawalRestrictionMessage: 1
          }
        }
      ]);
      res.json(usersWithBalance);
    } catch (error) {
      console.error("Admin user search error:", error);
      res.status(500).json({ success: false, message: "Failed to search users" });
    }
  });
  app2.get("/api/admin/users/all", requireAdminAuth2, async (req, res) => {
    try {
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const usersWithBalance = await User2.aggregate([
        {
          $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: "userbalances",
            localField: "_id",
            foreignField: "userId",
            as: "balanceInfo"
          }
        },
        {
          $addFields: {
            balance: {
              $ifNull: [
                { $arrayElemAt: ["$balanceInfo.amount", 0] },
                0
              ]
            }
          }
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            username: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            isVerified: 1,
            isAdmin: 1,
            balance: 1,
            lastActivity: 1,
            onlineTime: { $ifNull: ["$onlineTime", 0] },
            isOnline: { $ifNull: ["$isOnline", false] },
            sessionStart: 1,
            createdAt: 1,
            requiresDeposit: { $ifNull: ["$requiresDeposit", false] },
            withdrawalAccess: { $ifNull: ["$withdrawalAccess", false] },
            withdrawalRestrictionMessage: 1,
            allFeaturesDisabled: { $ifNull: ["$allFeaturesDisabled", false] }
          }
        }
      ]);
      res.json({
        success: true,
        data: usersWithBalance
      });
    } catch (error) {
      console.error("Admin get all users error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/users/:userId/password", requireAdminAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(userId).select("password actualPassword username email");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      let displayPassword = user.actualPassword;
      if (!displayPassword) {
        displayPassword = "No actual password stored - use 'Reset Password' to set a new one";
      }
      res.json({
        success: true,
        password: displayPassword,
        username: user.username,
        email: user.email,
        hasActualPassword: !!user.actualPassword
      });
    } catch (error) {
      console.error("Admin get user password error:", error);
      res.status(500).json({ success: false, message: "Failed to get user password" });
    }
  });
  app2.post("/api/admin/users/:userId/reset-password", requireAdminAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const bcrypt3 = await import("bcrypt");
      const user = await User2.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt3.hash(newPassword, saltRounds);
      await User2.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        actualPassword: newPassword
      });
      console.log(`\u{1F510} Admin reset password for user ${userId} (${user.username})`);
      const { getWebSocketServer: getWebSocketServer2 } = await Promise.resolve().then(() => (init_websocket(), websocket_exports));
      const wss3 = getWebSocketServer2();
      if (wss3) {
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "ADMIN_PASSWORD_RESET",
              userId,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        });
      }
      res.json({
        success: true,
        message: "Password reset successfully",
        newPassword
      });
    } catch (error) {
      console.error("Admin reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reset password"
      });
    }
  });
  app2.post("/api/admin/users/:userId/activity", requireAdminAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      const { action, data } = req.body;
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const now = /* @__PURE__ */ new Date();
      if (action === "login") {
        await User2.findByIdAndUpdate(userId, {
          isOnline: true,
          sessionStart: now,
          lastActivity: now
        });
      } else if (action === "logout") {
        if (user.sessionStart) {
          const sessionTime = Math.floor((now.getTime() - user.sessionStart.getTime()) / (1e3 * 60));
          await User2.findByIdAndUpdate(userId, {
            isOnline: false,
            onlineTime: (user.onlineTime || 0) + sessionTime,
            lastActivity: now,
            $unset: { sessionStart: 1 }
          });
        }
      } else {
        await User2.findByIdAndUpdate(userId, {
          lastActivity: now
        });
      }
      res.json({ success: true, message: "Activity tracked" });
    } catch (error) {
      console.error("Admin track activity error:", error);
      res.status(500).json({ success: false, message: "Failed to track activity" });
    }
  });
  app2.get("/api/user/deposit-requirement", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(userId).select("requiresDeposit");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      res.json({
        success: true,
        requiresDeposit: user.requiresDeposit || false
      });
    } catch (error) {
      console.error("Check deposit requirement error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check deposit requirement"
      });
    }
  });
  app2.get("/api/user/transfer-access", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(userId).select("transferAccess");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      console.log(`\u{1F50D} Transfer access check for user ${userId}:`, {
        transferAccess: user.transferAccess,
        type: typeof user.transferAccess,
        hasAccess: user.transferAccess !== false
      });
      res.json({
        success: true,
        hasTransferAccess: user.transferAccess !== false
      });
    } catch (error) {
      console.error("Transfer access check error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check transfer access"
      });
    }
  });
  app2.post("/api/admin/users/toggle-deposit-requirement", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, requiresDeposit } = req.body;
      console.log("Toggle deposit requirement called:", { userId, requiresDeposit, userIdType: typeof userId });
      if (!userId || typeof requiresDeposit !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "User ID and requiresDeposit boolean are required"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const { ObjectId } = await import("mongodb");
      let userObjectId;
      try {
        userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId;
        console.log("Converted userId to ObjectId:", userObjectId);
      } catch (error) {
        console.error("Invalid ObjectId format:", userId, error);
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format"
        });
      }
      const user = await User2.findByIdAndUpdate(
        userObjectId,
        { requiresDeposit },
        { new: true }
      );
      console.log("User update result:", user ? "FOUND" : "NOT_FOUND");
      if (!user) {
        const existingUser = await User2.findById(userObjectId);
        console.log("User exists check:", existingUser ? "EXISTS" : "DOES_NOT_EXIST");
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      if (wss2) {
        const message = JSON.stringify({
          type: "user_restriction_update",
          data: {
            userId: user._id,
            requiresDeposit: user.requiresDeposit,
            withdrawalRestrictionMessage: user.withdrawalRestrictionMessage
          }
        });
        wss2.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(message);
          }
        });
      }
      res.json({
        success: true,
        message: `Deposit requirement ${requiresDeposit ? "enabled" : "disabled"} for user`,
        data: {
          userId: user._id,
          username: user.username,
          requiresDeposit: user.requiresDeposit
        }
      });
    } catch (error) {
      console.error("Toggle deposit requirement error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update deposit requirement"
      });
    }
  });
  app2.post("/api/admin/users/toggle-all-features", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, allFeaturesDisabled } = req.body;
      console.log("Toggle all features disabled called:", { userId, allFeaturesDisabled, userIdType: typeof userId });
      if (!userId || typeof allFeaturesDisabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "User ID and allFeaturesDisabled boolean required"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findByIdAndUpdate(
        userId,
        { allFeaturesDisabled },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      console.log(`\u2705 Admin toggled all features disabled for user ${userId}: ${allFeaturesDisabled}`);
      const { getWebSocketServer: getWebSocketServer2 } = await Promise.resolve().then(() => (init_websocket(), websocket_exports));
      const wss3 = getWebSocketServer2();
      if (wss3) {
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "ALL_FEATURES_UPDATE",
              userId,
              allFeaturesDisabled,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        });
        console.log(`\u{1F4E1} Real-time all features update broadcasted for user ${userId}`);
      }
      res.json({
        success: true,
        message: `All features ${allFeaturesDisabled ? "disabled" : "enabled"} for user`,
        data: {
          userId: user._id,
          username: user.username,
          allFeaturesDisabled: user.allFeaturesDisabled
        }
      });
    } catch (error) {
      console.error("Admin toggle all features disabled error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle all features disabled"
      });
    }
  });
  app2.post("/api/admin/users/toggle-withdrawal-access", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, withdrawalAccess } = req.body;
      console.log("Toggle withdrawal access called:", { userId, withdrawalAccess });
      if (!userId || typeof withdrawalAccess !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Missing userId or withdrawalAccess flag"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findByIdAndUpdate(
        userId,
        { withdrawalAccess },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      console.log(`\u2705 Admin toggled withdrawal access for user ${userId}: ${withdrawalAccess}`);
      if (global.wss) {
        global.wss.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "WITHDRAWAL_ACCESS_UPDATE",
              userId,
              withdrawalAccess,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        });
        console.log(`\u{1F4E1} Real-time withdrawal access update broadcasted for user ${userId}`);
      }
      res.json({
        success: true,
        message: `Withdrawal access ${withdrawalAccess ? "enabled" : "disabled"} for user`,
        data: {
          userId: user._id,
          username: user.username,
          withdrawalAccess: user.withdrawalAccess
        }
      });
    } catch (error) {
      console.error("Admin toggle withdrawal access error:", error);
      res.status(500).json({ success: false, message: "Failed to toggle withdrawal access" });
    }
  });
  app2.post("/api/admin/users/toggle-transfer-access", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, transferAccess } = req.body;
      console.log("Toggle transfer access called:", { userId, transferAccess });
      if (!userId || typeof transferAccess !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Missing userId or transferAccess flag"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findByIdAndUpdate(
        userId,
        { transferAccess },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      console.log(`\u2705 Admin toggled transfer access for user ${userId}: ${transferAccess}`);
      if (global.wss) {
        global.wss.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "TRANSFER_ACCESS_UPDATE",
              userId,
              transferAccess,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        });
        console.log(`\u{1F4E1} Real-time transfer access update broadcasted for user ${userId}`);
      }
      res.json({
        success: true,
        message: `Transfer access ${transferAccess ? "enabled" : "disabled"} for user`,
        data: {
          userId: user._id,
          username: user.username,
          transferAccess: user.transferAccess
        }
      });
    } catch (error) {
      console.error("Admin toggle transfer access error:", error);
      res.status(500).json({ success: false, message: "Failed to toggle transfer access" });
    }
  });
  app2.post("/api/admin/users/update-withdrawal-message", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, message } = req.body;
      if (!userId || typeof message !== "string") {
        return res.status(400).json({
          success: false,
          message: "User ID and message string are required"
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findByIdAndUpdate(
        userId,
        { withdrawalRestrictionMessage: message },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      if (wss2) {
        const primaryMessage = JSON.stringify({
          type: "WITHDRAWAL_SETTINGS_UPDATE",
          userId: user._id.toString(),
          withdrawalRestrictionMessage: user.withdrawalRestrictionMessage,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        const legacyMessage = JSON.stringify({
          type: "user_restriction_update",
          data: {
            userId: user._id.toString(),
            requiresDeposit: user.requiresDeposit,
            withdrawalRestrictionMessage: user.withdrawalRestrictionMessage
          }
        });
        wss2.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(primaryMessage);
            setTimeout(() => {
              if (client2.readyState === 1) {
                client2.send(legacyMessage);
              }
            }, 50);
          }
        });
        console.log(`\u{1F4E1} Real-time withdrawal restriction update broadcasted to all clients for user ${user._id}`);
      }
      res.json({
        success: true,
        message: "Withdrawal restriction message updated successfully",
        data: {
          userId: user._id,
          username: user.username,
          withdrawalRestrictionMessage: user.withdrawalRestrictionMessage
        }
      });
    } catch (error) {
      console.error("Update withdrawal message error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update withdrawal restriction message"
      });
    }
  });
  app2.get("/api/user/withdrawal-restriction", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log(`\u{1F4CB} Getting withdrawal restriction for user: ${userId}`);
      if (userId === "ADMIN001") {
        console.log("\u2705 Admin user - returning empty restriction message");
        return res.json({
          success: true,
          withdrawalRestrictionMessage: "",
          requiresDeposit: false
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(userId).select("withdrawalRestrictionMessage requiresDeposit");
      if (!user) {
        console.log(`\u274C User not found: ${userId}`);
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      console.log(`\u2705 Found withdrawal restriction: "${user.withdrawalRestrictionMessage}"`);
      res.json({
        success: true,
        data: {
          hasRestriction: !!(user.withdrawalRestrictionMessage && user.withdrawalRestrictionMessage.trim().length > 0),
          message: user.withdrawalRestrictionMessage || ""
        }
      });
    } catch (error) {
      console.error("Get withdrawal restriction error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get withdrawal restriction message"
      });
    }
  });
  app2.get("/api/admin/users/analytics", requireAdminAuth2, async (req, res) => {
    try {
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const now = /* @__PURE__ */ new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const [
        totalUsers,
        onlineUsers,
        activeUsers24h,
        activeUsers7d,
        topActiveUsers
      ] = await Promise.all([
        User2.countDocuments({}),
        User2.countDocuments({ isOnline: true }),
        User2.countDocuments({ lastActivity: { $gte: last24Hours } }),
        User2.countDocuments({ lastActivity: { $gte: last7Days } }),
        User2.find({}).select("username email onlineTime lastActivity isOnline").sort({ onlineTime: -1 }).limit(10)
      ]);
      res.json({
        success: true,
        analytics: {
          totalUsers,
          onlineUsers,
          activeUsers24h,
          activeUsers7d,
          topActiveUsers
        }
      });
    } catch (error) {
      console.error("Admin analytics error:", error);
      res.status(500).json({ success: false, message: "Failed to get analytics" });
    }
  });
  app2.post("/api/admin/users/add-funds", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, amount } = req.body;
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Valid user ID and amount required" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      await mongoStorage2.addFundsToUser(userId, parseFloat(amount));
      console.log(`\u2713 Admin added $${amount} to user ${userId}`);
      console.log(`\u{1F4E7} Notification: User received $${amount} virtual USD funds`);
      res.json({
        success: true,
        message: `Successfully added $${amount} to user account`,
        notification: "Deposit successful: You've received virtual USD funds."
      });
    } catch (error) {
      console.error("Admin add funds error:", error);
      res.status(500).json({ success: false, message: "Failed to add funds" });
    }
  });
  app2.post("/api/admin/users/remove-funds", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, amount } = req.body;
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Valid user ID and amount required" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      await mongoStorage2.removeFundsFromUser(userId, parseFloat(amount));
      console.log(`\u2713 Admin removed $${amount} from user ${userId}`);
      res.json({
        success: true,
        message: `Successfully removed $${amount} from user account`
      });
    } catch (error) {
      console.error("Admin remove funds error:", error);
      res.status(500).json({ success: false, message: "Failed to remove funds" });
    }
  });
  app2.post("/api/admin/users/remove-funds", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, amount } = req.body;
      if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "Valid user ID and amount required" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      await mongoStorage2.removeFundsFromUser(userId, parseFloat(amount));
      console.log(`\u2713 Admin removed $${amount} from user ${userId}`);
      res.json({
        success: true,
        message: `Successfully removed $${amount} from user account`
      });
    } catch (error) {
      console.error("Admin remove funds error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to remove funds"
      });
    }
  });
  app2.delete("/api/admin/users/:userId", requireAdminAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const user = await mongoStorage2.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      if (user.isAdmin) {
        return res.status(403).json({ success: false, message: "Cannot delete admin users" });
      }
      await mongoStorage2.deleteUser(userId);
      console.log(`\u2713 Admin deleted user account: ${user.username}`);
      res.json({ success: true, message: "User account deleted successfully" });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ success: false, message: "Failed to delete user" });
    }
  });
  app2.post("/api/admin/deposits/create", requireAdminAuth2, async (req, res) => {
    try {
      const {
        userId,
        cryptoSymbol,
        cryptoName,
        chainType,
        networkName,
        senderAddress,
        usdAmount,
        cryptoPrice
      } = req.body;
      if (!userId || !cryptoSymbol || !cryptoName || !chainType || !networkName || !senderAddress || !usdAmount || !cryptoPrice) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const user = await mongoStorage2.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const cryptoAmount = usdAmount / cryptoPrice;
      const adminId = req.session?.adminId || "admin";
      const transaction = await mongoStorage2.createDepositTransaction({
        userId,
        adminId,
        cryptoSymbol,
        cryptoName,
        chainType,
        networkName,
        senderAddress,
        usdAmount,
        cryptoAmount,
        cryptoPrice
      });
      await mongoStorage2.addFundsToUser(userId, usdAmount);
      const notificationMessage = `Dear valued Nedaxer trader,
Your deposit has been confirmed.
Deposit amount: ${cryptoAmount.toFixed(8)} ${cryptoSymbol}
Deposit address: ${senderAddress}
Timestamp: ${(/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)}(UTC)`;
      const notification = await mongoStorage2.createNotification({
        userId,
        type: "deposit",
        title: "Deposit Confirmed",
        message: notificationMessage,
        data: {
          transactionId: transaction._id,
          cryptoSymbol,
          cryptoAmount,
          usdAmount,
          senderAddress,
          chainType,
          networkName
        }
      });
      const wss3 = req.app.get("wss");
      if (wss3) {
        const updateData = {
          type: "DEPOSIT_CREATED",
          userId,
          notification,
          transaction,
          balanceUpdate: {
            userId,
            newUSDBalance: usdAmount,
            addedAmount: usdAmount
          }
        };
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify(updateData));
          }
        });
        console.log(`\u{1F4E1} Real-time update broadcasted for user ${userId}: +$${usdAmount}`);
      }
      res.json({
        success: true,
        message: `Deposit created successfully. User notified of ${cryptoAmount.toFixed(8)} ${cryptoSymbol} deposit.`,
        transaction
      });
    } catch (error) {
      console.error("Admin create deposit error:", error);
      res.status(500).json({ success: false, message: "Failed to create deposit" });
    }
  });
  app2.post("/api/admin/withdrawals/create", requireAdminAuth2, async (req, res) => {
    try {
      const {
        userId,
        cryptoSymbol,
        cryptoName,
        chainType,
        networkName,
        withdrawalAddress,
        usdAmount,
        cryptoPrice
      } = req.body;
      if (!userId || !cryptoSymbol || !cryptoName || !chainType || !networkName || !withdrawalAddress || !usdAmount || !cryptoPrice) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const user = await mongoStorage2.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const userBalance = await mongoStorage2.getUserBalance(userId);
      if (userBalance < usdAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance. User has $${userBalance.toFixed(2)}, trying to withdraw $${usdAmount.toFixed(2)}`
        });
      }
      const cryptoAmount = usdAmount / cryptoPrice;
      const adminId = req.session?.adminId || "admin";
      const transaction = await mongoStorage2.createWithdrawalTransaction({
        userId,
        adminId,
        cryptoSymbol,
        cryptoName,
        chainType,
        networkName,
        withdrawalAddress,
        usdAmount,
        cryptoAmount,
        cryptoPrice
      });
      await mongoStorage2.removeFundsFromUser(userId, usdAmount);
      const notificationMessage = `Dear valued Nedaxer trader,
Your withdrawal has been processed.
Withdrawal amount: ${cryptoAmount.toFixed(8)} ${cryptoSymbol}
Withdrawal address: ${withdrawalAddress}
Timestamp: ${(/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)}(UTC)`;
      const notification = await mongoStorage2.createNotification({
        userId,
        type: "withdrawal",
        title: "Withdrawal Processed",
        message: notificationMessage,
        data: {
          transactionId: transaction._id,
          cryptoSymbol,
          cryptoAmount,
          usdAmount,
          withdrawalAddress,
          chainType,
          networkName
        }
      });
      const wss3 = req.app.get("wss");
      if (wss3) {
        const updateData = {
          type: "WITHDRAWAL_CREATED",
          userId,
          notification,
          transaction,
          balanceUpdate: {
            userId,
            deductedAmount: usdAmount
          }
        };
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify(updateData));
          }
        });
        console.log(`\u{1F4E1} Real-time update broadcasted for user ${userId}: -$${usdAmount}`);
      }
      res.json({
        success: true,
        message: `Withdrawal created successfully. User notified of ${cryptoAmount.toFixed(8)} ${cryptoSymbol} withdrawal.`,
        transaction
      });
    } catch (error) {
      console.error("Admin create withdrawal error:", error);
      res.status(500).json({ success: false, message: error.message || "Failed to create withdrawal" });
    }
  });
  app2.get("/api/deposits/history", requireAuth2, async (req, res) => {
    try {
      const sessionUserId = req.session?.userId;
      if (!sessionUserId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      console.log(`SECURE: Getting deposit history for authenticated user: ${sessionUserId}`);
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const transactions = await mongoStorage2.getUserDepositTransactions(sessionUserId);
      console.log(`SECURE: Found ${transactions.length} transactions for user ${sessionUserId}`);
      const secureTransactions = transactions.filter(
        (tx) => tx.userId === sessionUserId || tx.userId === sessionUserId.toString()
      );
      if (secureTransactions.length !== transactions.length) {
        console.error(`SECURITY VIOLATION: Transaction count mismatch. Expected: ${transactions.length}, Secure: ${secureTransactions.length}`);
        return res.status(500).json({ success: false, message: "Security check failed" });
      }
      res.json({
        success: true,
        data: secureTransactions
      });
    } catch (error) {
      console.error("Get deposit history error:", error);
      res.status(500).json({ success: false, message: "Failed to get deposit history" });
    }
  });
  app2.get("/api/deposits/:userId", requireAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      const sessionUserId = req.session?.userId;
      const isAdmin = req.session?.adminAuthenticated;
      if (!isAdmin && sessionUserId !== userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const transactions = await mongoStorage2.getUserDepositTransactions(userId);
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error("Get deposit transactions error:", error);
      res.status(500).json({ success: false, message: "Failed to get transactions" });
    }
  });
  app2.get("/api/deposits/details/:transactionId", requireAuth2, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const transaction = await mongoStorage2.getDepositTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
      const sessionUserId = req.session?.userId;
      const isAdmin = req.session?.adminAuthenticated;
      if (!isAdmin && sessionUserId !== transaction.userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      res.json({ success: true, data: transaction });
    } catch (error) {
      console.error("Get deposit transaction details error:", error);
      res.status(500).json({ success: false, message: "Failed to get transaction details" });
    }
  });
  app2.get("/api/withdrawals/eligibility", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      if (userId === "ADMIN001") {
        return res.json({
          success: true,
          data: {
            canWithdraw: true,
            hasAccess: true,
            message: "Admin access granted"
          }
        });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findById(userId).select("withdrawalAccess withdrawalRestrictionMessage");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const canWithdraw = user.withdrawalAccess === true;
      res.json({
        success: true,
        data: {
          canWithdraw,
          hasAccess: canWithdraw,
          message: canWithdraw ? "Withdrawal access granted" : user.withdrawalRestrictionMessage || "Withdrawal access not granted"
        }
      });
    } catch (error) {
      console.error("Withdrawal eligibility check error:", error);
      res.status(500).json({ success: false, message: "Failed to check withdrawal eligibility" });
    }
  });
  app2.post("/api/withdrawals/create", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const {
        cryptoSymbol,
        cryptoName,
        chainType,
        networkName,
        withdrawalAddress,
        usdAmount,
        cryptoAmount
      } = req.body;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      console.log(`\u{1F4E4} User withdrawal request from ${userId}: ${usdAmount} USD to ${cryptoSymbol}`);
      if (!cryptoSymbol || !cryptoName || !chainType || !networkName || !withdrawalAddress || !usdAmount || !cryptoAmount) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      if (usdAmount <= 0 || cryptoAmount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid withdrawal amount" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const userBalance = await mongoStorage2.getUserBalance(userId, "USD");
      if (!userBalance || userBalance.balance < usdAmount) {
        return res.status(400).json({ success: false, message: "Insufficient balance" });
      }
      const cryptoPriceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin&vs_currencies=usd&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY || ""}`);
      const cryptoPrices = await cryptoPriceResponse.json();
      const priceMap = {
        BTC: cryptoPrices.bitcoin?.usd || 0,
        ETH: cryptoPrices.ethereum?.usd || 0,
        USDT: cryptoPrices.tether?.usd || 1,
        BNB: cryptoPrices.binancecoin?.usd || 0
      };
      const currentPrice = priceMap[cryptoSymbol];
      if (!currentPrice || currentPrice <= 0) {
        return res.status(400).json({ success: false, message: "Unable to get current crypto price" });
      }
      const withdrawalTransaction = await mongoStorage2.createWithdrawalTransaction({
        userId,
        adminId: "USER_INITIATED",
        // Mark as user-initiated
        cryptoSymbol,
        cryptoName,
        chainType,
        networkName,
        withdrawalAddress,
        usdAmount: parseFloat(usdAmount),
        cryptoAmount: parseFloat(cryptoAmount),
        cryptoPrice: currentPrice
      });
      await mongoStorage2.removeFundsFromUser(userId, parseFloat(usdAmount));
      const notification = await mongoStorage2.createNotification({
        userId,
        type: "withdrawal",
        title: "Withdrawal Confirmed",
        message: `Dear valued Nedaxer trader,
Your withdrawal has been processed successfully.
Withdrawal amount: ${parseFloat(cryptoAmount).toFixed(8)} ${cryptoSymbol}
Withdrawal address: ${withdrawalAddress}
Network: ${networkName}
Timestamp: ${(/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)}(UTC)`,
        data: {
          transactionId: withdrawalTransaction._id,
          cryptoSymbol,
          cryptoAmount: parseFloat(cryptoAmount),
          usdAmount: parseFloat(usdAmount),
          withdrawalAddress,
          chainType,
          networkName
        }
      });
      if (global.wss) {
        global.wss.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "balance_update",
              userId,
              newBalance: userBalance.balance - parseFloat(usdAmount),
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
            client2.send(JSON.stringify({
              type: "new_notification",
              userId,
              notification,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }));
          }
        });
        console.log(`\u{1F4E1} Real-time updates broadcasted for user ${userId}: withdrawal processed`);
      }
      res.json({
        success: true,
        message: `Withdrawal initiated successfully. ${cryptoAmount.toFixed(8)} ${cryptoSymbol} will be sent to your address.`,
        transaction: withdrawalTransaction
      });
    } catch (error) {
      console.error("User withdrawal creation error:", error);
      res.status(500).json({ success: false, message: "Failed to process withdrawal" });
    }
  });
  app2.get("/api/withdrawals/history", requireAuth2, async (req, res) => {
    try {
      const sessionUserId = req.session?.userId;
      if (!sessionUserId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      console.log(`SECURE: Getting withdrawal history for authenticated user: ${sessionUserId}`);
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const transactions = await mongoStorage2.getUserWithdrawalTransactions(sessionUserId);
      console.log(`SECURE: Found ${transactions.length} withdrawal transactions for user ${sessionUserId}`);
      const secureTransactions = transactions.filter(
        (tx) => tx.userId === sessionUserId || tx.userId === sessionUserId.toString()
      );
      if (secureTransactions.length !== transactions.length) {
        console.error(`SECURITY VIOLATION: Transaction count mismatch. Expected: ${transactions.length}, Secure: ${secureTransactions.length}`);
        return res.status(500).json({ success: false, message: "Security check failed" });
      }
      res.json({
        success: true,
        data: secureTransactions
      });
    } catch (error) {
      console.error("Get withdrawal history error:", error);
      res.status(500).json({ success: false, message: "Failed to get withdrawal history" });
    }
  });
  app2.get("/api/withdrawals/:userId", requireAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      const sessionUserId = req.session?.userId;
      const isAdmin = req.session?.adminAuthenticated;
      if (!isAdmin && sessionUserId !== userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const transactions = await mongoStorage2.getUserWithdrawalTransactions(userId);
      res.json({ success: true, data: transactions });
    } catch (error) {
      console.error("Get withdrawal transactions error:", error);
      res.status(500).json({ success: false, message: "Failed to get transactions" });
    }
  });
  app2.get("/api/withdrawals/details/:transactionId", requireAuth2, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const transaction = await mongoStorage2.getWithdrawalTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
      const sessionUserId = req.session?.userId;
      const isAdmin = req.session?.adminAuthenticated;
      if (!isAdmin && sessionUserId !== transaction.userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      res.json({ success: true, data: transaction });
    } catch (error) {
      console.error("Get withdrawal transaction details error:", error);
      res.status(500).json({ success: false, message: "Failed to get transaction details" });
    }
  });
  app2.get("/api/notifications", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log(`\u{1F514} Notifications API called for user ${userId}`);
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const notifications = await mongoStorage2.getUserNotifications(userId);
      console.log(`\u{1F4DD} Found ${notifications.length} notifications for user ${userId}`);
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      console.log(`\u{1F4CA} Unread notifications: ${unreadCount}`);
      res.json({
        success: true,
        data: notifications,
        unreadCount
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ success: false, message: "Failed to get notifications" });
    }
  });
  app2.get("/api/notifications/unread-count", requireAuth2, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const notifications = await mongoStorage2.getUserNotifications(userId);
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      console.log(`\u{1F4CA} Unread count for user ${userId}: ${unreadCount}`);
      res.json({
        success: true,
        unreadCount
      });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({ success: false, message: "Failed to get unread count" });
    }
  });
  app2.put("/api/notifications/:notificationId/read", requireAuth2, async (req, res) => {
    try {
      const { notificationId } = req.params;
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      await mongoStorage2.markNotificationAsRead(notificationId);
      res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ success: false, message: "Failed to mark notification as read" });
    }
  });
  app2.use("/api/chatbot", chatbot_routes_default);
  const { default: verificationRoutes } = await Promise.resolve().then(() => (init_verification_routes(), verification_routes_exports));
  app2.use("/api/verification", verificationRoutes);
  const { default: adminKycRoutes } = await Promise.resolve().then(() => (init_admin_kyc_routes(), admin_kyc_routes_exports));
  app2.use("/api/admin", adminKycRoutes);
  app2.post("/api/admin/send-message", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, message } = req.body;
      if (!userId || !message || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "User ID and message are required" });
      }
      if (message.length > 2e3) {
        return res.status(400).json({ success: false, message: "Message too long (max 2000 characters)" });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const { AdminMessage: AdminMessage2 } = await Promise.resolve().then(() => (init_AdminMessage(), AdminMessage_exports));
      const user = await mongoStorage2.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const adminId = req.session?.adminId || "admin";
      const adminMessage = new AdminMessage2({
        userId,
        adminId,
        message: message.trim(),
        type: "support_message",
        isRead: false
      });
      await adminMessage.save();
      const notification = await mongoStorage2.createNotification({
        userId,
        type: "system",
        title: "Support Message",
        message: message.trim(),
        data: {
          messageId: adminMessage._id.toString(),
          from: "support",
          notificationType: "message"
        }
      });
      const wss3 = app2.get("wss");
      if (wss3) {
        const updateData = {
          type: "notification_update",
          data: { userId, notification }
        };
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify(updateData));
          }
        });
        console.log(`\u{1F4E1} Real-time message notification sent to user ${userId}`);
      }
      console.log(`\u2713 Admin sent message to user ${userId}: "${message.substring(0, 50)}..."`);
      res.json({
        success: true,
        message: "Message sent successfully",
        notification
      });
    } catch (error) {
      console.error("Admin send message error:", error);
      res.status(500).json({ success: false, message: "Failed to send message" });
    }
  });
  app2.get("/api/admin/users/:userId/withdrawal-settings", requireAdminAuth2, async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
      }
      const { UserSettings: UserSettings2 } = await Promise.resolve().then(() => (init_UserSettings(), UserSettings_exports));
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const user = await mongoStorage2.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      let userSettings = await UserSettings2.findOne({ userId });
      if (!userSettings) {
        userSettings = new UserSettings2({
          userId,
          minimumDepositForWithdrawal: 1e3,
          totalDeposited: 0,
          canWithdraw: false
        });
        await userSettings.save();
      }
      const deposits = await mongoStorage2.getUserDepositTransactions(userId);
      const totalDeposited = deposits.reduce((sum, deposit) => sum + deposit.usdAmount, 0);
      userSettings.totalDeposited = totalDeposited;
      userSettings.canWithdraw = totalDeposited >= userSettings.minimumDepositForWithdrawal;
      await userSettings.save();
      res.json({
        success: true,
        data: {
          canWithdraw: userSettings.canWithdraw,
          totalDeposited: userSettings.totalDeposited,
          minimumRequired: userSettings.minimumDepositForWithdrawal,
          withdrawalMessage: userSettings.withdrawalMessage || "You need to fund your account up to $1,000 to unlock withdrawal features.",
          shortfall: Math.max(0, userSettings.minimumDepositForWithdrawal - userSettings.totalDeposited)
        }
      });
    } catch (error) {
      console.error("Get user withdrawal settings error:", error);
      res.status(500).json({ success: false, message: "Failed to get withdrawal settings" });
    }
  });
  app2.post("/api/admin/users/withdrawal-settings", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, withdrawalRestrictionMessage } = req.body;
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID required" });
      }
      const { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports));
      const user = await User2.findByIdAndUpdate(
        userId,
        { withdrawalRestrictionMessage: withdrawalRestrictionMessage || "" },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const { getWebSocketServer: getWebSocketServer2 } = await Promise.resolve().then(() => (init_websocket(), websocket_exports));
      const wss3 = getWebSocketServer2();
      if (wss3) {
        const updateData = {
          type: "WITHDRAWAL_SETTINGS_UPDATE",
          userId,
          withdrawalRestrictionMessage: user.withdrawalRestrictionMessage
        };
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify(updateData));
          }
        });
        console.log(`\u{1F4E1} Real-time withdrawal settings update sent to user ${userId}`);
      }
      console.log(`\u2713 Admin updated withdrawal restriction message for user ${userId}`);
      res.json({
        success: true,
        message: "Withdrawal restriction message updated successfully",
        user: {
          _id: user._id,
          withdrawalRestrictionMessage: user.withdrawalRestrictionMessage
        }
      });
    } catch (error) {
      console.error("Admin update withdrawal settings error:", error);
      res.status(500).json({ success: false, message: "Failed to update withdrawal settings" });
    }
  });
  const httpServer = createServer(app2);
  const { WebSocketServer: WebSocketServer2, WebSocket } = await import("ws");
  const wss2 = new WebSocketServer2({ server: httpServer, path: "/ws" });
  const connectedClients = /* @__PURE__ */ new Map();
  wss2.on("connection", (ws) => {
    const clientId = Date.now() + Math.random();
    connectedClients.set(clientId, { ws, subscriptions: [] });
    console.log(`\u{1F50C} WebSocket client connected (${clientId}), total clients: ${connectedClients.size}`);
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("\u{1F4E8} WebSocket message received:", data);
        const client2 = connectedClients.get(clientId);
        if (client2) {
          if (data.type === "subscribe_notifications") {
            client2.subscriptions.push("notifications");
          } else if (data.type === "subscribe_admin") {
            client2.subscriptions.push("admin");
          } else if (data.type === "subscribe_prices") {
            client2.subscriptions.push("prices");
          }
        }
      } catch (error) {
        console.error("\u274C Invalid WebSocket message:", error);
      }
    });
    ws.on("close", () => {
      connectedClients.delete(clientId);
      console.log(`\u{1F50C} WebSocket client disconnected (${clientId}), remaining: ${connectedClients.size}`);
    });
    ws.on("error", (error) => {
      console.error(`\u274C WebSocket error for client ${clientId}:`, error);
      connectedClients.delete(clientId);
    });
  });
  const broadcastToSubscribers = (subscriptionType, data) => {
    let sentCount = 0;
    connectedClients.forEach((client2, clientId) => {
      if (client2.subscriptions.includes(subscriptionType) && client2.ws.readyState === 1) {
        try {
          client2.ws.send(JSON.stringify(data));
          sentCount++;
        } catch (error) {
          console.error(`\u274C Failed to send to client ${clientId}:`, error);
          connectedClients.delete(clientId);
        }
      }
    });
    console.log(`\u{1F4E1} Broadcasted ${data.type} to ${sentCount} ${subscriptionType} subscribers`);
  };
  setInterval(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/crypto/realtime-prices");
      if (response.ok) {
        const priceData = await response.json();
        broadcastToSubscribers("prices", {
          type: "PRICE_UPDATE",
          data: priceData
        });
      }
    } catch (error) {
      console.error("\u274C Failed to fetch prices for broadcast:", error);
    }
  }, 5e3);
  app2.post("/api/admin/connection-request/send", requireAdminAuth2, async (req, res) => {
    try {
      const { userId, customMessage, successMessage, serviceName } = req.body;
      if (!userId || !customMessage || !successMessage || !serviceName) {
        return res.status(400).json({
          success: false,
          message: "All fields are required: userId, customMessage, successMessage, serviceName"
        });
      }
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const user = await mongoStorage2.getUser(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const { ConnectionRequest: ConnectionRequest2 } = await Promise.resolve().then(() => (init_ConnectionRequest(), ConnectionRequest_exports));
      const connectionRequest = await ConnectionRequest2.create({
        userId,
        adminId: req.session?.adminId || "admin",
        customMessage,
        successMessage,
        serviceName,
        status: "pending"
      });
      const notification = await mongoStorage2.createNotification({
        userId,
        type: "connection_request",
        title: "Connection Request",
        message: `Dear User, ${customMessage}`,
        data: {
          connectionRequestId: connectionRequest._id.toString(),
          serviceName,
          customMessage,
          successMessage,
          status: "pending"
        }
      });
      console.log(`\u2705 Admin sent connection request to user ${userId}`);
      const wss3 = app2.get("wss");
      if (wss3) {
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "CONNECTION_REQUEST_CREATED",
              userId,
              connectionRequestId: connectionRequest._id.toString(),
              notification
            }));
          }
        });
      }
      res.json({
        success: true,
        message: "Connection request sent successfully",
        data: { connectionRequestId: connectionRequest._id.toString() }
      });
    } catch (error) {
      console.error("Admin send connection request error:", error);
      res.status(500).json({ success: false, message: "Failed to send connection request" });
    }
  });
  app2.post("/api/connection-request/respond", requireAuth2, async (req, res) => {
    try {
      const { connectionRequestId, response } = req.body;
      if (!connectionRequestId || !response || !["accept", "decline"].includes(response)) {
        return res.status(400).json({
          success: false,
          message: "Valid connectionRequestId and response (accept/decline) required"
        });
      }
      const { ConnectionRequest: ConnectionRequest2 } = await Promise.resolve().then(() => (init_ConnectionRequest(), ConnectionRequest_exports));
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const connectionRequest = await ConnectionRequest2.findById(connectionRequestId);
      if (!connectionRequest) {
        return res.status(404).json({ success: false, message: "Connection request not found" });
      }
      if (connectionRequest.userId !== req.session?.userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      if (connectionRequest.status !== "pending") {
        return res.status(400).json({ success: false, message: "Connection request already responded to" });
      }
      connectionRequest.status = response === "accept" ? "accepted" : "declined";
      connectionRequest.respondedAt = /* @__PURE__ */ new Date();
      await connectionRequest.save();
      let responseMessage = "";
      let notificationMessage = "";
      if (response === "accept") {
        responseMessage = `${connectionRequest.successMessage} has been successfully connected. Please contact support if you did not make this request.`;
        notificationMessage = `You have successfully connected your account to ${connectionRequest.serviceName}.`;
      } else {
        responseMessage = "You did not request this connection. Please report to support.";
        notificationMessage = `Connection request to ${connectionRequest.serviceName} was declined.`;
      }
      await mongoStorage2.removeNotificationByData(connectionRequest.userId, "connection_request", {
        connectionRequestId: connectionRequest._id.toString()
      });
      const notification = await mongoStorage2.createNotification({
        userId: connectionRequest.userId,
        type: "system",
        title: response === "accept" ? "Connection Successful" : "Connection Declined",
        message: notificationMessage,
        data: {
          connectionRequestId: connectionRequest._id.toString(),
          serviceName: connectionRequest.serviceName,
          response,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      console.log(`\u2705 User ${connectionRequest.userId} ${response}ed connection request ${connectionRequestId}`);
      const wss3 = app2.get("wss");
      if (wss3) {
        wss3.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify({
              type: "CONNECTION_REQUEST_RESPONDED",
              userId: connectionRequest.userId,
              connectionRequestId: connectionRequest._id.toString(),
              response,
              notification
            }));
          }
        });
      }
      res.json({
        success: true,
        message: responseMessage,
        data: {
          response,
          connectionRequestId: connectionRequest._id.toString(),
          serviceName: connectionRequest.serviceName
        }
      });
    } catch (error) {
      console.error("Connection request response error:", error);
      res.status(500).json({ success: false, message: "Failed to respond to connection request" });
    }
  });
  app2.get("/api/connection-requests", requireAuth2, async (req, res) => {
    try {
      const { ConnectionRequest: ConnectionRequest2 } = await Promise.resolve().then(() => (init_ConnectionRequest(), ConnectionRequest_exports));
      const connectionRequests = await ConnectionRequest2.find({
        userId: req.session?.userId
      }).sort({ createdAt: -1 });
      res.json({
        success: true,
        data: connectionRequests
      });
    } catch (error) {
      console.error("Get connection requests error:", error);
      res.status(500).json({ success: false, message: "Failed to get connection requests" });
    }
  });
  app2.get("/api/connection-request/:id", requireAuth2, async (req, res) => {
    try {
      const { id } = req.params;
      const { ConnectionRequest: ConnectionRequest2 } = await Promise.resolve().then(() => (init_ConnectionRequest(), ConnectionRequest_exports));
      const connectionRequest = await ConnectionRequest2.findById(id);
      if (!connectionRequest) {
        return res.status(404).json({ success: false, message: "Connection request not found" });
      }
      if (connectionRequest.userId !== req.session?.userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      res.json({
        success: true,
        data: connectionRequest
      });
    } catch (error) {
      console.error("Get connection request details error:", error);
      res.status(500).json({ success: false, message: "Failed to get connection request details" });
    }
  });
  app2.get("/api/admin/connection-requests", requireAdminAuth2, async (req, res) => {
    try {
      const { ConnectionRequest: ConnectionRequest2 } = await Promise.resolve().then(() => (init_ConnectionRequest(), ConnectionRequest_exports));
      const connectionRequests = await ConnectionRequest2.find({}).sort({ createdAt: -1 }).limit(100);
      res.json({
        success: true,
        data: connectionRequests
      });
    } catch (error) {
      console.error("Admin get connection requests error:", error);
      res.status(500).json({ success: false, message: "Failed to get connection requests" });
    }
  });
  app2.post("/api/contact/submit", requireAuth2, async (req, res) => {
    try {
      const { firstName, lastName, email, subject, message, category, priority } = req.body;
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      if (!firstName || !lastName || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }
      if (message.length > 5e3) {
        return res.status(400).json({
          success: false,
          message: "Message too long (max 5000 characters)"
        });
      }
      const { ContactMessage: ContactMessage2 } = await Promise.resolve().then(() => (init_ContactMessage(), ContactMessage_exports));
      const contactMessage = new ContactMessage2({
        userId: userId.toString(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        category: category || "general",
        priority: priority || "medium"
      });
      await contactMessage.save();
      console.log(`\u2713 Contact message received from user ${userId}: "${subject}"`);
      res.json({
        success: true,
        message: "Your message has been sent successfully. We'll get back to you soon!",
        messageId: contactMessage._id
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again."
      });
    }
  });
  app2.get("/api/admin/contact-messages", requireAdminAuth2, async (req, res) => {
    try {
      const { ContactMessage: ContactMessage2 } = await Promise.resolve().then(() => (init_ContactMessage(), ContactMessage_exports));
      const { mongoStorage: mongoStorage2 } = await Promise.resolve().then(() => (init_mongoStorage(), mongoStorage_exports));
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
      const filter = req.query.filter;
      let query = {};
      if (filter === "unread") {
        query.isRead = false;
      } else if (filter === "read") {
        query.isRead = true;
      }
      const messages = await ContactMessage2.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      const total = await ContactMessage2.countDocuments(query);
      const enhancedMessages = await Promise.all(
        messages.map(async (message) => {
          try {
            const user = await mongoStorage2.getUserById(message.userId);
            return {
              ...message,
              user: user ? {
                username: user.username,
                profilePicture: user.profilePicture
              } : null
            };
          } catch (error) {
            return {
              ...message,
              user: null
            };
          }
        })
      );
      res.json({
        success: true,
        messages: enhancedMessages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          total: await ContactMessage2.countDocuments(),
          unread: await ContactMessage2.countDocuments({ isRead: false }),
          read: await ContactMessage2.countDocuments({ isRead: true })
        }
      });
    } catch (error) {
      console.error("Admin get contact messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch contact messages"
      });
    }
  });
  app2.patch("/api/admin/contact-messages/:messageId/read", requireAdminAuth2, async (req, res) => {
    try {
      const { messageId } = req.params;
      const { ContactMessage: ContactMessage2 } = await Promise.resolve().then(() => (init_ContactMessage(), ContactMessage_exports));
      const message = await ContactMessage2.findByIdAndUpdate(
        messageId,
        { isRead: true, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found"
        });
      }
      res.json({
        success: true,
        message: "Message marked as read",
        data: message
      });
    } catch (error) {
      console.error("Admin mark message read error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark message as read"
      });
    }
  });
  app2.delete("/api/admin/contact-messages/:messageId", requireAdminAuth2, async (req, res) => {
    try {
      const { messageId } = req.params;
      const { ContactMessage: ContactMessage2 } = await Promise.resolve().then(() => (init_ContactMessage(), ContactMessage_exports));
      const message = await ContactMessage2.findByIdAndDelete(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found"
        });
      }
      res.json({
        success: true,
        message: "Message deleted successfully"
      });
    } catch (error) {
      console.error("Admin delete message error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete message"
      });
    }
  });
  app2.post("/api/admin/contact-messages/:messageId/reply", requireAdminAuth2, async (req, res) => {
    try {
      const { messageId } = req.params;
      const { reply } = req.body;
      const { ContactMessage: ContactMessage2 } = await Promise.resolve().then(() => (init_ContactMessage(), ContactMessage_exports));
      const { Notification: Notification2 } = await Promise.resolve().then(() => (init_Notification(), Notification_exports));
      if (!reply || reply.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Reply message is required" });
      }
      const message = await ContactMessage2.findByIdAndUpdate(
        messageId,
        {
          adminReply: reply.trim(),
          adminReplyAt: /* @__PURE__ */ new Date(),
          hasReply: true,
          isRead: true
        },
        { new: true }
      );
      if (!message) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
      const notification = new Notification2({
        userId: message.userId,
        type: "message",
        title: `Reply to: ${message.subject}`,
        message: reply.trim(),
        data: {
          messageId: message._id,
          originalSubject: message.subject
        }
      });
      await notification.save();
      if (global.wss) {
        const notificationData = {
          type: "new_notification",
          notification: {
            _id: notification._id,
            userId: notification.userId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            data: notification.data
          }
        };
        global.wss.clients.forEach((client2) => {
          if (client2.readyState === 1) {
            client2.send(JSON.stringify(notificationData));
          }
        });
      }
      res.json({ success: true, message: "Reply sent successfully", data: message });
    } catch (error) {
      console.error("Error sending admin reply:", error);
      res.status(500).json({ success: false, message: "Failed to send reply" });
    }
  });
  app2.get("/api/user/contact-messages", requireAuth2, async (req, res) => {
    try {
      const userId = req.session?.userId;
      const { ContactMessage: ContactMessage2 } = await Promise.resolve().then(() => (init_ContactMessage(), ContactMessage_exports));
      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      const messages = await ContactMessage2.find({ userId }).sort({ createdAt: -1 }).lean();
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error("Error fetching user contact messages:", error);
      res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
  });
  app2.set("wss", wss2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      host: "0.0.0.0",
      port: 5e3
    },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic2(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json({ limit: "10mb" }));
app.use(express3.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic2(app);
    }
    const port = 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
})();
