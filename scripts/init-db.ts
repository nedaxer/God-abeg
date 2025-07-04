import { db, pool } from "../server/db";
import { 
  users, 
  currencies,
  stakingRates,
  transactions,
  userBalances
} from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Initialize the database with default values for the trading platform
 */
async function initializeDatabase() {
  console.log("Initializing database tables...");
  
  try {
    // Create initial currencies
    const defaultCurrencies = [
      { symbol: "USD", name: "US Dollar", type: "fiat", isActive: true },
      { symbol: "BTC", name: "Bitcoin", type: "crypto", isActive: true },
      { symbol: "ETH", name: "Ethereum", type: "crypto", isActive: true },
      { symbol: "BNB", name: "BNB", type: "crypto", isActive: true },
      { symbol: "USDT", name: "Tether USD", type: "crypto", isActive: true }
    ];
    
    // Insert currencies if they don't already exist
    for (const currency of defaultCurrencies) {
      const existing = await db
        .select()
        .from(currencies)
        .where(eq(currencies.symbol, currency.symbol));
      
      if (existing.length === 0) {
        console.log(`Creating currency: ${currency.symbol}`);
        await db.insert(currencies).values({
          ...currency,
          createdAt: new Date()
        });
      } else {
        console.log(`Currency ${currency.symbol} already exists`);
      }
    }
    
    // Set up staking rates for crypto coins
    const stakingSettings = [
      { symbol: "BTC", rate: 0.02, minAmount: 0.001 }, // 2% APY for BTC
      { symbol: "ETH", rate: 0.035, minAmount: 0.01 }, // 3.5% APY for ETH
      { symbol: "BNB", rate: 0.045, minAmount: 0.1 }, // 4.5% APY for BNB
    ];
    
    for (const stakingSetting of stakingSettings) {
      // Find currency ID
      const currencyResult = await db
        .select()
        .from(currencies)
        .where(eq(currencies.symbol, stakingSetting.symbol));
      
      if (currencyResult.length === 0) {
        console.log(`Currency ${stakingSetting.symbol} not found for staking`);
        continue;
      }
      
      const currencyId = currencyResult[0].id;
      
      // Check if staking rate already exists
      const existingRate = await db
        .select()
        .from(stakingRates)
        .where(eq(stakingRates.currencyId, currencyId));
      
      if (existingRate.length === 0) {
        console.log(`Creating staking rate for ${stakingSetting.symbol}: ${stakingSetting.rate * 100}%`);
        await db.insert(stakingRates).values({
          currencyId,
          apy: stakingSetting.rate,
          minimumStake: stakingSetting.minAmount,
          isActive: true
        });
      } else {
        console.log(`Staking rate for ${stakingSetting.symbol} already exists`);
      }
    }
    
    // Create an admin user if one doesn't exist
    const adminUser = {
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // In a real app, this would be hashed
      firstName: "Admin",
      lastName: "User",
      isVerified: true,
      isAdmin: true,
      createdAt: new Date()
    };
    
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, adminUser.username));
    
    if (existingAdmin.length === 0) {
      console.log("Creating admin user");
      await db.insert(users).values(adminUser);
    } else {
      console.log("Admin user already exists");
    }
    
    console.log("Database initialization completed successfully");
    
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase().catch(console.error);