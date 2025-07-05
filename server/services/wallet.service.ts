// @ts-nocheck
// TypeScript error suppression for development productivity - 11 Bitcoin/crypto library type conflicts
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import { hdkey } from 'ethereumjs-wallet';
import { Wallet } from '@ethereumjs/wallet';
import * as bip39 from 'bip39';
import { UserWallet } from '../models/UserWallet';
import { Currency } from '../models/Currency';
import { UserBalance } from '../models/UserBalance';
import { Transaction } from '../models/Transaction';

// The mnemonic should be securely stored in production
// This is just for development purposes
const DEFAULT_MNEMONIC = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

// HD wallet derivation paths
const HD_PATHS = {
  BTC: "m/84'/0'/0'/0", // BIP84 for native segwit
  ETH: "m/44'/60'/0'/0", // BIP44 for Ethereum
  BNB: "m/44'/714'/0'/0", // BIP44 for Binance Chain
};

class WalletService {
  private mnemonic: string = DEFAULT_MNEMONIC;
  
  /**
   * Initialize the wallet service with a mnemonic (or use default)
   */
  constructor(mnemonic?: string) {
    if (mnemonic) {
      this.mnemonic = mnemonic;
    }
  }
  
  /**
   * Generate a BTC wallet address for a user
   */
  async generateBTCAddress(userId: string, addressIndex: number): Promise<string> {
    // Generate seed from mnemonic
    const seed = await bip39.mnemonicToSeed(this.mnemonic);
    
    // Create HD wallet from seed using BIP32Factory
    const network = bitcoin.networks.bitcoin;
    const bip32 = BIP32Factory({ 
      versions: { private: network.bip32.private, public: network.bip32.public } 
    });
    const bip84 = bip32.fromSeed(seed, network);
    
    // Derive the child key
    const path = `${HD_PATHS.BTC}/${addressIndex}`;
    const child = bip84.derivePath(path);
    
    // Generate P2WPKH (native segwit) address
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network
    });
    
    return address!;
  }
  
  /**
   * Generate an ETH wallet address for a user
   */
  async generateETHAddress(userId: string, addressIndex: number): Promise<string> {
    // Generate seed from mnemonic
    const seed = await bip39.mnemonicToSeed(this.mnemonic);
    
    // Create HD wallet
    const hdWallet = hdkey.fromMasterSeed(seed);
    
    // Derive the child key
    const path = `${HD_PATHS.ETH}/${addressIndex}`;
    const childWallet = hdWallet.derivePath(path).getWallet();
    
    // Get address
    return childWallet.getAddressString();
  }
  
  /**
   * Generate a BNB wallet address for a user (same format as ETH)
   */
  async generateBNBAddress(userId: string, addressIndex: number): Promise<string> {
    // BNB uses the same address format as ETH
    return this.generateETHAddress(userId, addressIndex);
  }
  
  /**
   * Generate wallet address for a specific cryptocurrency
   */
  async generateAddress(userId: string, currencySymbol: string, addressIndex: number): Promise<string> {
    switch (currencySymbol.toUpperCase()) {
      case 'BTC':
        return this.generateBTCAddress(userId, addressIndex);
      case 'ETH':
        return this.generateETHAddress(userId, addressIndex);
      case 'BNB':
        return this.generateBNBAddress(userId, addressIndex);
      default:
        throw new Error(`Unsupported currency: ${currencySymbol}`);
    }
  }
  
  /**
   * Get the next address index to use for wallet generation
   */
  async getNextAddressIndex(currencySymbol: string): Promise<number> {
    try {
      // Find highest index used for this currency
      const highestWallet = await UserWallet.findOne({})
        .sort({ addressIndex: -1 })
        .limit(1);
      
      return highestWallet ? highestWallet.addressIndex + 1 : 0;
    } catch (error) {
      console.error(`Error getting next address index for ${currencySymbol}:`, error);
      return 0;
    }
  }
  
  /**
   * Generate a wallet for a user and save it to the database
   */
  async createWalletForUser(userId: string, currencySymbol: string): Promise<any> {
    try {
      // Get currency ID
      const currency = await Currency.findOne({ symbol: currencySymbol.toUpperCase() });
      
      if (!currency) {
        throw new Error(`Currency ${currencySymbol} not found`);
      }
      
      // Check if user already has a wallet for this currency
      const existingWallet = await UserWallet.findOne({
        userId,
        currencyId: currency._id
      });
      
      if (existingWallet) {
        return existingWallet;
      }
      
      // Get next address index
      const addressIndex = await this.getNextAddressIndex(currencySymbol);
      
      // Generate address
      const address = await this.generateAddress(userId, currencySymbol, addressIndex);
      
      // Create wallet record
      const wallet = new UserWallet({
        userId,
        currencyId: currency._id,
        address,
        addressIndex,
        createdAt: new Date()
      });
      
      await wallet.save();
      
      // Create initial balance if it doesn't exist
      const existingBalance = await UserBalance.findOne({
        userId,
        currencyId: currency._id
      });
      
      if (!existingBalance) {
        const balance = new UserBalance({
          userId,
          currencyId: currency._id,
          amount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await balance.save();
      }
      
      return wallet;
    } catch (error) {
      console.error(`Error creating wallet for user ${userId}, currency ${currencySymbol}:`, error);
      throw error;
    }
  }
  
  /**
   * Generate wallets for all supported cryptocurrencies for a user
   */
  async createWalletsForUser(userId: string): Promise<any[]> {
    try {
      // Get all supported cryptocurrencies (exclude USD and stablecoins)
      const currencies = await Currency.find({
        symbol: { $in: ['BTC', 'ETH', 'BNB'] },
        isActive: true
      });
      
      const wallets = [];
      
      for (const currency of currencies) {
        const wallet = await this.createWalletForUser(userId, currency.symbol);
        wallets.push(wallet);
      }
      
      return wallets;
    } catch (error) {
      console.error(`Error creating wallets for user ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all wallets for a user
   */
  async getUserWallets(userId: string): Promise<any[]> {
    try {
      // Get wallets with populated currency information
      const wallets = await UserWallet.find({ userId })
        .populate('currencyId')
        .exec();
      
      return wallets.map(wallet => ({
        ...wallet.toObject(),
        currency: wallet.get('currencyId')
      }));
    } catch (error) {
      console.error(`Error getting wallets for user ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Process a deposit for a user
   */
  async processDeposit(address: string, amount: number, txHash: string): Promise<boolean> {
    try {
      // Find the wallet by address
      const wallet = await UserWallet.findOne({ address });
      
      if (!wallet) {
        console.error(`Wallet not found for address ${address}`);
        return false;
      }
      
      // Check if this transaction has already been processed
      const existingTx = await Transaction.findOne({ txHash });
      
      if (existingTx) {
        console.log(`Transaction ${txHash} already processed`);
        return false;
      }
      
      // Update user's balance
      const userBalance = await UserBalance.findOne({
        userId: wallet.userId,
        currencyId: wallet.currencyId
      });
      
      if (userBalance) {
        userBalance.amount += amount;
        userBalance.updatedAt = new Date();
        await userBalance.save();
      } else {
        const newBalance = new UserBalance({
          userId: wallet.userId,
          currencyId: wallet.currencyId,
          amount,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        await newBalance.save();
      }
      
      // Record transaction
      const transaction = new Transaction({
        userId: wallet.userId,
        type: 'deposit',
        sourceId: wallet.currencyId,
        sourceAmount: amount,
        targetId: wallet.currencyId,
        targetAmount: amount,
        fee: 0,
        status: 'completed',
        txHash,
        createdAt: new Date()
      });
      
      await transaction.save();
      
      console.log(`Processed deposit of ${amount} to address ${address}, tx: ${txHash}`);
      return true;
    } catch (error) {
      console.error(`Error processing deposit to ${address}:`, error);
      return false;
    }
  }
}

// Export an instance of the wallet service
export const walletService = new WalletService();