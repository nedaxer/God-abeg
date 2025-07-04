import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUserWallet extends Document {
  userId: mongoose.Types.ObjectId;
  currencyId: mongoose.Types.ObjectId;
  address: string;
  addressIndex: number;
  privateKey?: string; // Optional: Only stored encrypted if needed
  createdAt: Date;
  lastChecked?: Date;
}

const userWalletSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    currencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    addressIndex: {
      type: Number,
      required: true,
    },
    privateKey: {
      type: String,
      select: false, // Don't return by default in queries
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastChecked: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for wallet queries
userWalletSchema.index({ userId: 1, currencyId: 1 });
userWalletSchema.index({ address: 1 }, { unique: true });

// Export the UserWallet model
export const UserWallet = mongoose.models.UserWallet || model<IUserWallet>('UserWallet', userWalletSchema);