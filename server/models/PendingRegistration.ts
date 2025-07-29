import mongoose from 'mongoose';

const pendingRegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: String },
  monthOfBirth: { type: String },
  yearOfBirth: { type: String },
  gender: { type: String },
  referralCode: { type: String },
  profilePicture: { type: String },
  referredBy: { type: String },
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) } // 10 minutes
});

// TTL index to automatically delete expired records
pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema);