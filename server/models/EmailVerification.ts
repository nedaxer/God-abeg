import mongoose from 'mongoose';

export interface IEmailVerification {
  _id: string;
  userId: string;
  otp: string;
  email: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  otp: { 
    type: String, 
    required: true,
    length: 6
  },
  email: { 
    type: String, 
    required: true,
    index: true
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index for automatic cleanup
  },
  verified: { 
    type: Boolean, 
    default: false,
    index: true
  },
  attempts: { 
    type: Number, 
    default: 0,
    max: 5 // Maximum 5 attempts per OTP
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Compound index for efficient queries
EmailVerificationSchema.index({ userId: 1, verified: 1 });
EmailVerificationSchema.index({ email: 1, verified: 1 });

export const EmailVerification = mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema);