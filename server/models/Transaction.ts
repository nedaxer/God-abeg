import mongoose, { Document, Schema, model } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: string; // 'buy', 'sell', 'deposit', 'withdrawal', 'staking', 'unstaking', 'credit'
  sourceId: string; // Currency ID or staking ID (depending on transaction type)
  sourceAmount: number;
  targetId: string; // Currency ID (if applicable)
  targetAmount: number;
  fee: number;
  status: string; // 'pending', 'completed', 'failed'
  txHash?: string; // Blockchain transaction hash (for deposit/withdrawal)
  metadata?: Record<string, any>; // Additional data like price or rate
  createdAt: Date;
}

const transactionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['trade_buy', 'trade_sell', 'deposit', 'withdrawal', 'staking', 'unstaking', 'credit'],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sourceAmount: {
      type: Number,
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    targetAmount: {
      type: Number,
      required: false,
    },
    fee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    txHash: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed, // Can store any JSON data
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
transactionSchema.index({ userId: 1, createdAt: -1 }); // For user transaction history
transactionSchema.index({ type: 1, status: 1 }); // For filtering by type and status
transactionSchema.index({ txHash: 1 }, { sparse: true }); // For looking up blockchain transactions

// Export the Transaction model
export const Transaction = mongoose.models.Transaction || model<ITransaction>('Transaction', transactionSchema);