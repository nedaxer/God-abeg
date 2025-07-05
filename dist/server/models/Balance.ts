import mongoose from 'mongoose';

export interface IBalance {
  _id: string;
  userId: string;
  assetSymbol: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BalanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  assetSymbol: { type: String, required: true },
  amount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Create compound index for efficient queries
BalanceSchema.index({ userId: 1, assetSymbol: 1 }, { unique: true });

export const Balance = mongoose.model<IBalance>('Balance', BalanceSchema);