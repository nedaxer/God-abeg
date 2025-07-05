import mongoose, { Document, Schema, model } from 'mongoose';

export interface IMarketPrice extends Document {
  currencyId: string;
  price: number;
  timestamp: Date;
  source: string;
  createdAt: Date;
}

const marketPriceSchema = new Schema(
  {
    currencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: ['API', 'MANUAL', 'SYSTEM'],
      default: 'API',
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

// Create an index on the timestamp for faster querying of recent prices
marketPriceSchema.index({ timestamp: -1 });
// Create a compound index on currencyId and timestamp
marketPriceSchema.index({ currencyId: 1, timestamp: -1 });

// Export the MarketPrice model
export const MarketPrice = mongoose.models.MarketPrice || model<IMarketPrice>('MarketPrice', marketPriceSchema);