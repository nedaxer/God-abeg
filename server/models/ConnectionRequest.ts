import mongoose, { Schema, Document } from 'mongoose';

export interface IConnectionRequest extends Document {
  userId: string;
  adminId: string;
  customMessage: string;
  successMessage: string;
  serviceName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
}

const ConnectionRequestSchema = new Schema<IConnectionRequest>({
  userId: { type: String, required: true, index: true },
  adminId: { type: String, required: true },
  customMessage: { type: String, required: true },
  successMessage: { type: String, required: true },
  serviceName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  respondedAt: { type: Date }
}, {
  timestamps: true
});

export const ConnectionRequest = mongoose.model<IConnectionRequest>('ConnectionRequest', ConnectionRequestSchema);