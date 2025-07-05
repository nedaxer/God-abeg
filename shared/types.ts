// Shared types for the application
// This file provides compatibility between MongoDB and PostgreSQL schemas

export interface User {
  _id?: string;
  id?: string;
  uid: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified: boolean;
  isAdmin: boolean;
  balance: number;
  kycStatus?: string;
  transferAccess?: boolean;
  withdrawalAccess?: boolean;
  requiresDeposit?: boolean;
  createdAt: Date;
}

export interface DepositTransaction {
  _id?: string;
  id?: string;
  userId: string;
  adminId: string;
  cryptoSymbol: string;
  cryptoName: string;
  chainType: string;
  networkName: string;
  usdAmount: number;
  cryptoAmount: number;
  cryptoPrice: number;
  createdAt: Date;
}

export interface WithdrawalTransaction {
  _id?: string;
  id?: string;
  userId: string;
  adminId: string;
  cryptoSymbol: string;
  cryptoName: string;
  chainType: string;
  networkName: string;
  withdrawalAddress: string;
  usdAmount: number;
  cryptoAmount: number;
  cryptoPrice: number;
  createdAt: Date;
}

export interface Transfer {
  _id?: string;
  id?: string;
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  transactionId: string;
  createdAt: Date;
}

export interface Notification {
  _id?: string;
  id?: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export interface UserBalance {
  _id?: string;
  id?: string;
  userId: string;
  currency: string;
  balance: number;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication types
export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

// Market data types
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

// Trading types
export interface TradeOrder {
  _id?: string;
  id?: string;
  userId: string;
  pair: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
}

export interface StakingPosition {
  _id?: string;
  id?: string;
  userId: string;
  cryptoSymbol: string;
  amount: number;
  apy: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed';
}