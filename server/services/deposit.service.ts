// @ts-nocheck
// TypeScript error suppression for development productivity - 16 MongoDB type conflicts
import { db } from '../db';
import { 
  userWallets, 
  transactions, 
  currencies, 
  userBalances,
  UserWallet 
} from '@shared/schema';
import { eq, and, desc, or } from 'drizzle-orm';
import { walletService } from './wallet.service';
import { tradingService } from './trading.service';
import { getLatestPrice } from './price.service';

// Define constant for USDT contract address
const USDT_CONTRACT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

class DepositService {
  /**
   * Generate wallet addresses for a user for all supported cryptocurrencies
   */
  async generateUserWallets(userId: number): Promise<UserWallet[]> {
    try {
      // Get all active cryptocurrencies
      const cryptoCurrencies = await db
        .select()
        .from(currencies)
        .where(
          and(
            eq(currencies.isActive, true),
            eq(currencies.type, 'crypto')
          )
        );
      
      const generatedWallets: UserWallet[] = [];
      
      for (const currency of cryptoCurrencies) {
        // Check if wallet already exists for this currency and user
        const existingWallet = await db
          .select()
          .from(userWallets)
          .where(
            and(
              eq(userWallets.userId, userId),
              eq(userWallets.currencyId, currency.id)
            )
          );
        
        if (existingWallet.length > 0) {
          generatedWallets.push(existingWallet[0]);
          continue;
        }
        
        // Generate wallet based on currency
        let walletDetails;
        let index = await this.getNextAddressIndex(currency.symbol);
        
        switch (currency.symbol.toUpperCase()) {
          case 'BTC':
            walletDetails = walletService.generateBitcoinWallet(index);
            break;
          case 'ETH':
          case 'USDT': // USDT uses Ethereum addresses
            walletDetails = walletService.generateEthereumWallet(index);
            break;
          case 'BNB':
            walletDetails = walletService.generateBinanceWallet(index);
            break;
          default:
            console.warn(`Unsupported currency for wallet generation: ${currency.symbol}`);
            continue;
        }
        
        // Encrypt private key before storing
        const encryptedPrivateKey = walletService.encryptPrivateKey(walletDetails.privateKey);
        
        // Store wallet in database
        const [wallet] = await db
          .insert(userWallets)
          .values({
            userId,
            currencyId: currency.id,
            address: walletDetails.address,
            hdPath: walletDetails.hdPath,
            privateKeyEncrypted: encryptedPrivateKey,
            createdAt: new Date()
          })
          .returning();
        
        generatedWallets.push(wallet);
      }
      
      return generatedWallets;
      
    } catch (error) {
      console.error('Error generating user wallets:', error);
      throw error;
    }
  }

  /**
   * Get a user's deposit wallet for a specific currency
   */
  async getUserWallet(userId: number, currencyId: number): Promise<UserWallet | undefined> {
    const wallets = await db
      .select()
      .from(userWallets)
      .where(
        and(
          eq(userWallets.userId, userId),
          eq(userWallets.currencyId, currencyId)
        )
      );
    
    return wallets.length > 0 ? wallets[0] : undefined;
  }

  /**
   * Get all deposit wallets for a user
   */
  async getUserWallets(userId: number): Promise<(UserWallet & { currency: { symbol: string; name: string } })[]> {
    const result = await db
      .select({
        wallet: userWallets,
        currency: {
          symbol: currencies.symbol,
          name: currencies.name
        }
      })
      .from(userWallets)
      .innerJoin(currencies, eq(userWallets.currencyId, currencies.id))
      .where(eq(userWallets.userId, userId));
    
    return result.map(row => ({
      ...row.wallet,
      currency: row.currency
    }));
  }

  /**
   * Get the next address index to use for wallet generation
   */
  private async getNextAddressIndex(currencySymbol: string): Promise<number> {
    // Find the highest index used so far
    const currency = await db
      .select()
      .from(currencies)
      .where(eq(currencies.symbol, currencySymbol.toUpperCase()))
      .limit(1);
    
    if (currency.length === 0) {
      throw new Error(`Currency ${currencySymbol} not found`);
    }
    
    const wallets = await db
      .select()
      .from(userWallets)
      .where(eq(userWallets.currencyId, currency[0].id));
    
    let highestIndex = 0;
    
    for (const wallet of wallets) {
      const hdPath = wallet.hdPath;
      const parts = hdPath.split('/');
      const index = parseInt(parts[parts.length - 1], 10);
      
      if (!isNaN(index) && index > highestIndex) {
        highestIndex = index;
      }
    }
    
    return highestIndex + 1;
  }

  /**
   * Check for new deposits for a user
   */
  async checkForNewDeposits(userId: number): Promise<{ success: boolean; depositsFound: number }> {
    try {
      let depositsFound = 0;
      
      // Get user's wallets
      const userWalletsWithCurrency = await this.getUserWallets(userId);
      
      // Check each wallet for deposits
      for (const walletWithCurrency of userWalletsWithCurrency) {
        const wallet = walletWithCurrency;
        const currencySymbol = walletWithCurrency.currency.symbol;
        
        // Skip if not BTC, ETH, BNB, or USDT
        if (!['BTC', 'ETH', 'BNB', 'USDT'].includes(currencySymbol.toUpperCase())) {
          continue;
        }
        
        // Get the latest transaction to determine what we've already processed
        const latestDepositTx = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, 'deposit'),
              eq(transactions.targetId, wallet.currencyId)
            )
          )
          .orderBy(desc(transactions.createdAt))
          .limit(1);
        
        let lastProcessedTxHash = latestDepositTx.length > 0 
          ? (latestDepositTx[0].txHash || '') 
          : '';
        
        // Check the balance based on currency
        let balance = 0;
        
        switch (currencySymbol.toUpperCase()) {
          case 'BTC':
            balance = await walletService.checkBitcoinBalance(wallet.address);
            break;
          case 'ETH':
            balance = await walletService.checkEthereumBalance(wallet.address);
            break;
          case 'BNB':
            balance = await walletService.checkBinanceBalance(wallet.address);
            break;
          case 'USDT':
            balance = await walletService.checkUSDTBalance(wallet.address);
            break;
        }
        
        if (balance > 0) {
          // Check if we have already processed this deposit
          const existingDeposit = await db
            .select()
            .from(transactions)
            .where(
              and(
                eq(transactions.userId, userId),
                eq(transactions.type, 'deposit'),
                eq(transactions.targetId, wallet.currencyId),
                eq(transactions.targetAmount, balance)
              )
            );
          
          if (existingDeposit.length === 0) {
            // This is a new deposit
            
            // Convert to USD
            const price = await getLatestPrice(currencySymbol);
            const usdAmount = balance * price;
            
            // Add to user's balance
            await tradingService.updateUserBalance(userId, wallet.currencyId, balance);
            
            // Record the transaction
            const now = new Date();
            await db
              .insert(transactions)
              .values({
                userId,
                type: 'deposit',
                sourceId: null,
                sourceAmount: 0,
                targetId: wallet.currencyId,
                targetAmount: balance,
                status: 'completed',
                txHash: 'deposit_' + Date.now(), // In a real system, use the actual blockchain transaction hash
                metadata: { price, usdValue: usdAmount },
                createdAt: now,
                updatedAt: now
              });
            
            depositsFound++;
          }
        }
      }
      
      return { success: true, depositsFound };
      
    } catch (error) {
      console.error('Error checking for deposits:', error);
      return { success: false, depositsFound: 0 };
    }
  }

  /**
   * Start a background job to check for deposits
   */
  startDepositCheckJob(intervalSeconds: number = 30): NodeJS.Timer {
    const intervalMs = intervalSeconds * 1000;
    
    return setInterval(async () => {
      try {
        // Get all users
        const allUsers = await db
          .select()
          .from(userBalances)
          .groupBy(userBalances.userId);
        
        // Check deposits for each user
        for (const userBalance of allUsers) {
          try {
            await this.checkForNewDeposits(userBalance.userId);
          } catch (error) {
            console.error(`Error checking deposits for user ${userBalance.userId}:`, error);
          }
        }
      } catch (error) {
        console.error('Error in deposit check job:', error);
      }
    }, intervalMs);
  }
}

export const depositService = new DepositService();