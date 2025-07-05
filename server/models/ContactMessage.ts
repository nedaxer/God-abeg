import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'general' | 'support' | 'security' | 'technical';
  adminReply?: string;
  adminReplyAt?: Date;
  hasReply: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'support', 'security', 'technical'],
    default: 'general'
  },
  adminReply: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  adminReplyAt: {
    type: Date
  },
  hasReply: {
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
ContactMessageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient querying
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ isRead: 1 });

export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);