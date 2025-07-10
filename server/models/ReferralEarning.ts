import mongoose, { Schema, Document } from 'mongoose';

export interface IReferralEarning extends Document {
  referrerId: string;
  referredUserId: string;
  amount: number;
  percentage: number;
  transactionType: string;
  originalAmount: number;
  currencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralEarningSchema: Schema = new Schema({
  referrerId: {
    type: String,
    required: true,
    index: true
  },
  referredUserId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['trading', 'deposit', 'withdrawal', 'staking']
  },
  originalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currencyId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
ReferralEarningSchema.index({ referrerId: 1, createdAt: -1 });
ReferralEarningSchema.index({ referredUserId: 1, createdAt: -1 });

export const ReferralEarning = mongoose.model<IReferralEarning>('ReferralEarning', ReferralEarningSchema);