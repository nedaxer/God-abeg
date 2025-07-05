import { z } from "zod";

// MongoDB User schema for validation
export const mongoUserSchema = z.object({
  uid: z.string().length(10).regex(/^[0-9]{10}$/, "UID must be exactly 10 digits"),
  username: z.string().min(1).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  profilePicture: z.string().optional(),
  favorites: z.array(z.string()).default([]),
  preferences: z.object({
    lastSelectedPair: z.string().optional(),
    lastSelectedCrypto: z.string().optional(),
    lastSelectedTab: z.string().optional(),
  }).optional(),
  verificationCode: z.string().optional(),
  verificationCodeExpires: z.date().optional(),
  resetPasswordCode: z.string().optional(),
  resetPasswordCodeExpires: z.date().optional(),
  isVerified: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  balance: z.number().default(0),
  googleId: z.string().optional(),
  // New verification fields
  kycStatus: z.enum(['none', 'pending', 'verified', 'rejected']).default('none'),
  kycData: z.object({
    // Step 1: How did you hear about us
    hearAboutUs: z.string().optional(),
    // Step 2: Date of birth
    dateOfBirth: z.object({
      day: z.number().min(1).max(31),
      month: z.number().min(1).max(12),
      year: z.number().min(1900).max(2023)
    }).optional(),
    // Step 3: Investment questionnaire
    sourceOfIncome: z.enum(['employment', 'business', 'investments', 'pension', 'other']).optional(),
    annualIncome: z.enum(['below_10k', '10k_50k', '50k_100k', 'above_100k']).optional(),
    investmentExperience: z.enum(['none', 'beginner', 'intermediate', 'advanced']).optional(),
    plannedDeposit: z.enum(['below_500', '500_2k', '2k_10k', 'above_10k']).optional(),
    investmentGoal: z.enum(['long_term_growth', 'short_term_profit', 'retirement_savings', 'other']).optional(),
    // Step 4: Identity documents
    documentType: z.enum(['passport', 'driving_license', 'residence_permit']).optional(),
    documents: z.object({
      front: z.string().optional(),
      back: z.string().optional(),
      selfie: z.string().optional()
    }).optional(),
    // Verification results
    verificationResults: z.object({
      documentValid: z.boolean().optional(),
      faceMatch: z.boolean().optional(),
      ocrResults: z.object({
        name: z.string().optional(),
        dateOfBirth: z.string().optional(),
        documentNumber: z.string().optional(),
        expiryDate: z.string().optional()
      }).optional(),
      confidence: z.number().min(0).max(100).optional(),
      issues: z.array(z.string()).default([])
    }).optional()
  }).optional(),
  createdAt: z.date().default(() => new Date()),
});

// Insert schema for user creation (omit auto-generated fields)
export const insertMongoUserSchema = mongoUserSchema.omit({
  uid: true,
  createdAt: true,
  verificationCode: true,
  verificationCodeExpires: true,
  resetPasswordCode: true,
  resetPasswordCodeExpires: true,
});

// Types for MongoDB user operations
export type MongoUser = z.infer<typeof mongoUserSchema>;
export type InsertMongoUser = z.infer<typeof insertMongoUserSchema>;

// User data type for API responses (without sensitive fields)
export const userDataSchema = z.object({
  _id: z.string(),
  uid: z.string(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().optional(),
  favorites: z.array(z.string()).default([]),
  preferences: z.object({
    lastSelectedPair: z.string().optional(),
    lastSelectedCrypto: z.string().optional(),
    lastSelectedTab: z.string().optional(),
  }).optional(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  balance: z.number(),
  createdAt: z.date(),
});

export type UserData = z.infer<typeof userDataSchema>;