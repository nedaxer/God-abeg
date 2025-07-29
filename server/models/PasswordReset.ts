import mongoose from 'mongoose';

interface IPasswordReset {
  email: string;
  resetCode: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const passwordResetSchema = new mongoose.Schema<IPasswordReset>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  resetCode: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient lookups
passwordResetSchema.index({ email: 1, resetCode: 1 });
passwordResetSchema.index({ expiresAt: 1 });

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', passwordResetSchema);
export type { IPasswordReset };