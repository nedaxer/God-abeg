import mongoose, { Schema, Document } from 'mongoose';

export interface IPendingDeposit extends Document {
  _id: string;
  userId: string;
  cryptoSymbol: string;
  chainType: string;
  depositAddress: string;
  usdAmount: number;
  cryptoAmount?: number;
  cryptoPrice?: number;
  receiptImageUrl?: string;
  status: 'pending_payment' | 'pending_approval' | 'approved' | 'declined';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PendingDepositSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  cryptoSymbol: {
    type: String,
    required: true
  },
  chainType: {
    type: String,
    required: true
  },
  depositAddress: {
    type: String,
    required: true
  },
  usdAmount: {
    type: Number,
    required: true,
    min: 500 // Minimum $500 as per requirements
  },
  cryptoAmount: {
    type: Number,
    default: null
  },
  cryptoPrice: {
    type: Number,
    default: null
  },
  receiptImageUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending_payment', 'pending_approval', 'approved', 'declined'],
    default: 'pending_payment'
  },
  adminNotes: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'pendingdeposits'
});

// Index for better query performance
PendingDepositSchema.index({ userId: 1, status: 1 });
PendingDepositSchema.index({ status: 1, createdAt: -1 });

export const PendingDeposit = mongoose.model<IPendingDeposit>('PendingDeposit', PendingDepositSchema);