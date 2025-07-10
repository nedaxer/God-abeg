// HARDCODED ADMIN CREDENTIALS
// These credentials work regardless of MongoDB URL changes
// Multiple credentials for reliability across environment changes

export interface AdminCredential {
  email: string;
  password: string;
  adminId: string;
  description: string;
}

export const ADMIN_CREDENTIALS: AdminCredential[] = [
  {
    email: 'admin@nedaxer.com',
    password: 'SMART456',
    adminId: 'ADMIN001',
    description: 'Primary admin account'
  },
  {
    email: 'admin@nedaxer.com',
    password: 'admin123',
    adminId: 'ADMIN002',
    description: 'Primary admin account (alternative password)'
  },
  {
    email: 'nedaxer.admin@gmail.com',
    password: 'SMART456',
    adminId: 'ADMIN003',
    description: 'Gmail admin account'
  },
  {
    email: 'nedaxer.admin@gmail.com',
    password: 'admin123',
    adminId: 'ADMIN004',
    description: 'Gmail admin account (alternative password)'
  },
  {
    email: 'support@nedaxer.com',
    password: 'SMART456',
    adminId: 'ADMIN005',
    description: 'Support admin account'
  },
  {
    email: 'root@nedaxer.com',
    password: 'SMART456',
    adminId: 'ADMIN006',
    description: 'Root admin account'
  },
  {
    email: 'super@nedaxer.com',
    password: 'SMART456',
    adminId: 'ADMIN007',
    description: 'Super admin account'
  },
  {
    email: 'admin',
    password: 'SMART456',
    adminId: 'ADMIN008',
    description: 'Simple admin username'
  },
  {
    email: 'admin',
    password: 'admin123',
    adminId: 'ADMIN009',
    description: 'Simple admin username (alternative password)'
  }
];

// All admin IDs for middleware validation
export const ADMIN_IDS = ADMIN_CREDENTIALS.map(cred => cred.adminId);

// Function to validate admin credentials
export function validateAdminCredentials(email: string, password: string): AdminCredential | null {
  return ADMIN_CREDENTIALS.find(cred => 
    cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
  ) || null;
}

// Function to check if user ID is admin
export function isAdminUserId(userId: string): boolean {
  return ADMIN_IDS.includes(userId);
}

// Admin user object generator
export function createAdminUser(credential: AdminCredential) {
  return {
    _id: credential.adminId,
    uid: credential.adminId,
    username: credential.email,
    email: credential.email,
    firstName: 'System',
    lastName: 'Administrator',
    profilePicture: '',
    isVerified: true,
    isAdmin: true,
    balance: 0,
    kycStatus: 'verified',
    withdrawalAccess: true,
    transferAccess: true,
    requiresDeposit: false,
    allFeaturesDisabled: false
  };
}