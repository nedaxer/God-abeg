import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

/**
 * Auth Service - Responsible for security-related operations
 */
class AuthService {
  /**
   * Hash a password using bcrypt with proper salt rounds
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify if a plain text password matches a hashed password
   */
  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  /**
   * Generate a secure 6-digit verification code
   */
  generateVerificationCode(): string {
    // Generate a 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate a secure reset token (for password reset)
   */
  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generate an expiration date for verification codes or tokens
   * @param minutes Number of minutes until expiration
   */
  generateExpirationDate(minutes: number = 30): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  /**
   * Check if a token or code is expired
   */
  isExpired(expirationDate: Date): boolean {
    return expirationDate < new Date();
  }
}

// Export a singleton instance
export const authService = new AuthService();