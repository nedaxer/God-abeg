import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  userId: string;
  minimumDepositForWithdrawal: number;
  totalDeposited: number;
  canWithdraw: boolean;
  withdrawalMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  minimumDepositForWithdrawal: {
    type: Number,
    default: 500,
    min: 0
  },
  totalDeposited: {
    type: Number,
    default: 0,
    min: 0
  },
  canWithdraw: {
    type: Boolean,
    default: false
  },
  withdrawalMessage: {
    type: String,
    default: "You need to make a first deposit of ${amount} to unlock withdrawal features."
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
UserSettingsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Auto-calculate canWithdraw based on deposits
UserSettingsSchema.pre('save', function(next) {
  this.canWithdraw = this.totalDeposited >= this.minimumDepositForWithdrawal;
  next();
});

export const UserSettings = mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);