import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminMessage extends Document {
  userId: string;
  adminId: string;
  message: string;
  type: 'support_message';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminMessageSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  adminId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    default: 'support_message',
    enum: ['support_message']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
AdminMessageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const AdminMessage = mongoose.model<IAdminMessage>('AdminMessage', AdminMessageSchema);