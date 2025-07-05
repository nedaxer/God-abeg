
import { db } from "../db";
import { users, userBalances, transactions } from "@shared/schema";
import { eq } from "drizzle-orm";

class BackupService {
  /**
   * Create a backup of user data
   */
  async backupUserData(userId: number) {
    try {
      // Get user data
      const userData = await db.select().from(users).where(eq(users.id, userId));
      
      // Get user balances
      const userBalanceData = await db.select().from(userBalances).where(eq(userBalances.userId, userId));
      
      // Get user transactions
      const userTransactionData = await db.select().from(transactions).where(eq(transactions.userId, userId));
      
      const backup = {
        timestamp: new Date().toISOString(),
        user: userData[0] || null,
        balances: userBalanceData,
        transactions: userTransactionData
      };
      
      return {
        success: true,
        data: backup,
        message: "User data backed up successfully"
      };
    } catch (error) {
      console.error("Error backing up user data:", error);
      return {
        success: false,
        message: "Failed to backup user data",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Backup all users data (admin function)
   */
  async backupAllUsers() {
    try {
      const allUsers = await db.select().from(users);
      const allBalances = await db.select().from(userBalances);
      const allTransactions = await db.select().from(transactions);
      
      const backup = {
        timestamp: new Date().toISOString(),
        users: allUsers,
        balances: allBalances,
        transactions: allTransactions
      };
      
      return {
        success: true,
        data: backup,
        message: "All user data backed up successfully"
      };
    } catch (error) {
      console.error("Error backing up all user data:", error);
      return {
        success: false,
        message: "Failed to backup all user data",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Restore user data from backup
   */
  async restoreUserData(userId: number, backupData: any) {
    try {
      // This is a basic restore - in production you'd want more validation
      if (backupData.user) {
        await db.update(users)
          .set(backupData.user)
          .where(eq(users.id, userId));
      }
      
      return {
        success: true,
        message: "User data restored successfully"
      };
    } catch (error) {
      console.error("Error restoring user data:", error);
      return {
        success: false,
        message: "Failed to restore user data",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

export const backupService = new BackupService();
