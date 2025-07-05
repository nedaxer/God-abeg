import mongoose, { Document } from 'mongoose';
const { Schema, model } = mongoose;

// Interface representing a StakingRate document
export interface IStakingRate extends Document {
  currencyId: string;
  rate: number;  // Annual rate (0.05 = 5%)
  minAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const stakingRateSchema = new Schema<IStakingRate>(
  {
    currencyId: {
      type: String,
      required: true,
      unique: true,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 1, // Rate between 0 and 1 (0% to 100%)
    },
    minAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export the StakingRate model (ensuring it's only defined once)
export const StakingRate = mongoose.models.StakingRate || model<IStakingRate>('StakingRate', stakingRateSchema);