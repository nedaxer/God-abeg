import { pgTable, text, integer, boolean, timestamp, doublePrecision, primaryKey, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User-related tables
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  uid: varchar("uid", { length: 10 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  verificationCode: varchar("verification_code", { length: 255 }),
  verificationCodeExpires: timestamp("verification_code_expires"),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  kycStatus: varchar("kyc_status", { length: 50 }).default("pending").notNull(),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  totalPortfolioValue: doublePrecision("total_portfolio_value").default(0).notNull(),
  riskLevel: varchar("risk_level", { length: 50 }).default("moderate").notNull(),
  referralCode: varchar("referral_code", { length: 255 }).unique(),
  referredBy: integer("referred_by"),
  profilePicture: text("profile_picture"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  balances: many(userBalances),
  wallets: many(userWallets),
  transactions: many(transactions),
  stakingPositions: many(stakingPositions),
  favorites: many(userFavorites),
  preferences: one(userPreferences)
}));

// Currency types
export const currencies = pgTable("currencies", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  symbol: varchar("symbol", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const currenciesRelations = relations(currencies, ({ many }) => ({
  balances: many(userBalances),
  stakingRates: many(stakingRates),
  wallets: many(userWallets)
}));

// User balance table
export const userBalances = pgTable("user_balances", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  currencyId: integer("currency_id").notNull().references(() => currencies.id),
  balance: doublePrecision("balance").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const userBalancesRelations = relations(userBalances, ({ one }) => ({
  user: one(users, {
    fields: [userBalances.userId],
    references: [users.id]
  }),
  currency: one(currencies, {
    fields: [userBalances.currencyId],
    references: [currencies.id]
  })
}));

// User wallets for crypto deposits
export const userWallets = pgTable("user_wallets", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  currencyId: integer("currency_id").notNull().references(() => currencies.id),
  address: varchar("address", { length: 255 }).notNull(),
  privateKey: text("private_key"), // Encrypted private key
  publicKey: text("public_key"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userWalletsRelations = relations(userWallets, ({ one }) => ({
  user: one(users, {
    fields: [userWallets.userId],
    references: [users.id]
  }),
  currency: one(currencies, {
    fields: [userWallets.currencyId],
    references: [currencies.id]
  })
}));

// Transactions table
export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  currencyId: integer("currency_id").notNull().references(() => currencies.id),
  type: varchar("type", { length: 50 }).notNull(), // 'deposit', 'withdrawal', 'trade'
  amount: doublePrecision("amount").notNull(),
  fee: doublePrecision("fee").default(0).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  txHash: varchar("tx_hash", { length: 255 }),
  fromAddress: varchar("from_address", { length: 255 }),
  toAddress: varchar("to_address", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  }),
  currency: one(currencies, {
    fields: [transactions.currencyId],
    references: [currencies.id]
  })
}));

// Staking rates
export const stakingRates = pgTable("staking_rates", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  currencyId: integer("currency_id").notNull().references(() => currencies.id),
  apy: doublePrecision("apy").notNull(),
  minAmount: doublePrecision("min_amount").default(0).notNull(),
  maxAmount: doublePrecision("max_amount").default(1000000).notNull(),
  lockPeriod: integer("lock_period").default(30).notNull(), // days
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const stakingRatesRelations = relations(stakingRates, ({ one, many }) => ({
  currency: one(currencies, {
    fields: [stakingRates.currencyId],
    references: [currencies.id]
  }),
  positions: many(stakingPositions)
}));

// Staking positions
export const stakingPositions = pgTable("staking_positions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  currencyId: integer("currency_id").notNull().references(() => currencies.id),
  amount: doublePrecision("amount").notNull(),
  apy: doublePrecision("apy").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  rewards: doublePrecision("rewards").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const stakingPositionsRelations = relations(stakingPositions, ({ one }) => ({
  user: one(users, {
    fields: [stakingPositions.userId],
    references: [users.id]
  }),
  currency: one(currencies, {
    fields: [stakingPositions.currencyId],
    references: [currencies.id]
  })
}));

// Market prices for real-time data
export const marketPrices = pgTable("market_prices", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  symbol: varchar("symbol", { length: 20 }).notNull().unique(),
  price: doublePrecision("price").notNull(),
  change24h: doublePrecision("change_24h").default(0).notNull(),
  volume24h: doublePrecision("volume_24h").default(0).notNull(),
  marketCap: doublePrecision("market_cap").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});

// Futures orders
export const futuresOrders = pgTable("futures_orders", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  side: varchar("side", { length: 10 }).notNull(), // 'long', 'short'
  size: doublePrecision("size").notNull(),
  entryPrice: doublePrecision("entry_price").notNull(),
  markPrice: doublePrecision("mark_price").notNull(),
  pnl: doublePrecision("pnl").default(0).notNull(),
  margin: doublePrecision("margin").notNull(),
  leverage: integer("leverage").default(1).notNull(),
  status: varchar("status", { length: 20 }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const futuresOrdersRelations = relations(futuresOrders, ({ one }) => ({
  user: one(users, {
    fields: [futuresOrders.userId],
    references: [users.id]
  })
}));

// Portfolio snapshots
export const portfolioSnapshots = pgTable("portfolio_snapshots", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalValue: doublePrecision("total_value").notNull(),
  totalChange: doublePrecision("total_change").default(0).notNull(),
  totalChangePercent: doublePrecision("total_change_percent").default(0).notNull(),
  positions: json("positions").$type<Array<{symbol: string, amount: number, value: number}>>(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const portfolioSnapshotsRelations = relations(portfolioSnapshots, ({ one }) => ({
  user: one(users, {
    fields: [portfolioSnapshots.userId],
    references: [users.id]
  })
}));

// User favorites
export const userFavorites = pgTable("user_favorites", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  cryptoPairSymbol: varchar("crypto_pair_symbol", { length: 20 }).notNull(),
  cryptoId: varchar("crypto_id", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id]
  })
}));

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  lastSelectedPair: varchar("last_selected_pair", { length: 20 }),
  lastSelectedCrypto: varchar("last_selected_crypto", { length: 50 }),
  lastSelectedTab: varchar("last_selected_tab", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id]
  })
}));

// Basic validation schemas using zod
export const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  verificationCode: z.string().optional(),
  verificationCodeExpires: z.date().optional(),
  isVerified: z.boolean().default(false),
  isAdmin: z.boolean().default(false),
  kycStatus: z.string().default("pending"),
  phone: z.string().optional(),
  country: z.string().optional(),
  totalPortfolioValue: z.number().default(0),
  riskLevel: z.string().default("moderate"),
  referralCode: z.string().optional(),
  referredBy: z.number().optional(),
  profilePicture: z.string().optional(),
});

export const insertCurrencySchema = z.object({
  symbol: z.string(),
  name: z.string(),
  type: z.string(),
  isActive: z.boolean().default(true),
});

export const insertUserBalanceSchema = z.object({
  userId: z.number(),
  currencyId: z.number(),
  balance: z.number(),
});

export const insertUserWalletSchema = z.object({
  userId: z.number(),
  currencyId: z.number(),
  address: z.string(),
  privateKey: z.string().optional(),
  publicKey: z.string().optional(),
  type: z.string(),
});

export const insertTransactionSchema = z.object({
  userId: z.number(),
  type: z.string(),
  amount: z.number(),
  currencyId: z.number(),
  status: z.string().default("pending"),
  txHash: z.string().optional(),
  description: z.string().optional(),
});

export const insertStakingRateSchema = z.object({
  currencyId: z.number(),
  apr: z.number(),
  isActive: z.boolean().default(true),
});

export const insertStakingPositionSchema = z.object({
  userId: z.number(),
  currencyId: z.number(),
  amount: z.number(),
  apr: z.number(),
  startDate: z.date(),
  endDate: z.date().optional(),
  rewards: z.number().default(0),
  status: z.string().default("active"),
});

export const insertMarketPriceSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change24h: z.number().optional(),
  volume24h: z.number().optional(),
  marketCap: z.number().optional(),
});

export const insertFuturesOrderSchema = z.object({
  userId: z.number(),
  symbol: z.string(),
  type: z.string(),
  side: z.string(),
  amount: z.number(),
  price: z.number().optional(),
  leverage: z.number().default(1),
  status: z.string().default("pending"),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
});

export const insertPortfolioSnapshotSchema = z.object({
  userId: z.number(),
  totalValue: z.number(),
  allocation: z.record(z.number()),
});

export const insertUserFavoriteSchema = z.object({
  userId: z.number(),
  symbol: z.string(),
});

export const insertUserPreferenceSchema = z.object({
  userId: z.number(),
  language: z.string().default("en"),
  currency: z.string().default("USD"),
  theme: z.string().default("dark"),
  notifications: z.boolean().default(true),
  chartType: z.string().default("candlestick"),
  lastSelectedPair: z.string().optional(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Currency = typeof currencies.$inferSelect;
export type InsertCurrency = z.infer<typeof insertCurrencySchema>;

export type UserBalance = typeof userBalances.$inferSelect;
export type InsertUserBalance = z.infer<typeof insertUserBalanceSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type StakingRate = typeof stakingRates.$inferSelect;
export type InsertStakingRate = z.infer<typeof insertStakingRateSchema>;

export type StakingPosition = typeof stakingPositions.$inferSelect;
export type InsertStakingPosition = z.infer<typeof insertStakingPositionSchema>;

export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;

export type FuturesOrder = typeof futuresOrders.$inferSelect;
export type InsertFuturesOrder = z.infer<typeof insertFuturesOrderSchema>;

export type PortfolioSnapshot = typeof portfolioSnapshots.$inferSelect;
export type InsertPortfolioSnapshot = z.infer<typeof insertPortfolioSnapshotSchema>;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;

export type UserWallet = typeof userWallets.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;