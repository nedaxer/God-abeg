/**
 * Utility functions for generating and managing user UIDs
 */

/**
 * Generates a random numeric UID (10 digits)
 * Example: 4286363824
 */
export function generateUID(): string {
  // Generate a 10-digit number
  let result = '';
  
  // First digit should not be 0 to ensure it's always 10 digits
  result += Math.floor(Math.random() * 9) + 1;
  
  // Generate remaining 9 digits
  for (let i = 0; i < 9; i++) {
    result += Math.floor(Math.random() * 10);
  }
  
  return result;
}

/**
 * Validates UID format (numeric only, exactly 10 digits)
 */
export function isValidUID(uid: string): boolean {
  return /^[0-9]{10}$/.test(uid);
}