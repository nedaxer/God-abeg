import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  uid: string;
  username: string;
  email: string;
  password: string;
  actualPassword?: string; // Store actual password for admin viewing
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  isAdmin: boolean;
  balance: number;
  profilePicture?: string;
  favorites?: string[];
  preferences?: {
    lastSelectedPair?: string;
    lastSelectedCrypto?: string;
    lastSelectedTab?: string;
  };
  verificationCode?: string;
  verificationExpiry?: Date;
  resetPasswordCode?: string;
  resetPasswordExpiry?: Date;
  lastActivity?: Date;
  onlineTime?: number; // Total online time in minutes
  sessionStart?: Date;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Admin controlled fields
  requiresDeposit?: boolean;
  withdrawalRestrictionMessage?: string;
  withdrawalAccess?: boolean;
  transferAccess?: boolean;
  allFeaturesDisabled?: boolean;
  // OAuth fields
  googleId?: string;
  // KYC verification fields
  kycStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  kycData?: {
    hearAboutUs?: string;
    dateOfBirth?: {
      day: number;
      month: number;
      year: number;
    };
    sourceOfIncome?: string;
    annualIncome?: string;
    investmentExperience?: string;
    plannedDeposit?: string;
    investmentGoal?: string;
    documentType?: string;
    documents?: {
      front?: string;
      back?: string;
      single?: string;
    };
  };
}

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  actualPassword: String, // Store actual password for admin viewing
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
  onlineTime: { type: Number, default: 0 }, // Total online time in minutes
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
  kycStatus: { type: String, enum: ['none', 'pending', 'verified', 'rejected'], default: 'none' },
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

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);