import mongoose, { Document, Schema, model } from 'mongoose';

export interface ICurrency extends Document {
  symbol: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

const currencySchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Create an index for faster isActive lookups
currencySchema.index({ isActive: 1 });

// Export the Currency model
export const Currency = mongoose.models.Currency || model<ICurrency>('Currency', currencySchema);