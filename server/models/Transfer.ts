import mongoose, { Document, Schema, model } from 'mongoose';

export interface ITransfer extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
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

// Create indexes for efficient queries
transferSchema.index({ fromUserId: 1, createdAt: -1 });
transferSchema.index({ toUserId: 1, createdAt: -1 });
transferSchema.index({ transactionId: 1 });

// Export the Transfer model
export const Transfer = mongoose.models.Transfer || model<ITransfer>('Transfer', transferSchema);