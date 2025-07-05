import mongoose, { Document, Schema, model } from 'mongoose';

export interface IUserBalance extends Document {
  userId: mongoose.Types.ObjectId;
  currencyId: string;
  amount: number;
  updatedAt: Date;
  createdAt: Date;
}

const userBalanceSchema = new Schema(
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
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
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

// Create a compound index for querying by user and currency
userBalanceSchema.index({ userId: 1, currencyId: 1 }, { unique: true });

// Export the UserBalance model
export const UserBalance = mongoose.models.UserBalance || model<IUserBalance>('UserBalance', userBalanceSchema);