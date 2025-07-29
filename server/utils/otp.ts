import crypto from 'crypto';

/**
 * Generate a secure 6-digit OTP
 */
export function generateOTP(): string {
  // Generate a random 6-digit number using crypto for security
  const randomBytes = crypto.randomBytes(3);
  const randomNumber = parseInt(randomBytes.toString('hex'), 16);
  
  // Ensure it's exactly 6 digits by taking modulo and padding
  const otp = (randomNumber % 900000 + 100000).toString();
  
  return otp;
}

/**
 * Generate OTP expiration time (3 minutes from now)
 */
export function generateOTPExpiry(): Date {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 3);
  return expiryTime;
}

/**
 * Check if an OTP is expired
 */
export function isOTPExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

/**
 * Get remaining time for OTP in minutes
 */
export function getOTPRemainingTime(expiryDate: Date): number {
  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60))); // Return minutes
}