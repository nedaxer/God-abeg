import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer_sent' | 'transfer_received' | 'system' | 'trade' | 'announcement' | 'kyc_approved' | 'kyc_rejected' | 'message' | 'connection_request';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer_sent', 'transfer_received', 'system', 'trade', 'announcement', 'kyc_approved', 'kyc_rejected', 'message', 'connection_request'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);