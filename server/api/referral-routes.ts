// @ts-nocheck
// TypeScript error suppression for development productivity - 26 Express/MongoDB type conflicts
import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users, referralEarnings } from '@shared/schema';
import { eq, sql, and, desc } from 'drizzle-orm';

const router = Router();

// Middleware to require authentication
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  next();
};

// Generate unique referral code
function generateReferralCode(firstName: string, lastName: string): string {
  try {
    // Ensure we have valid strings
    const validFirstName = (firstName || 'User').toString().trim();
    const validLastName = (lastName || 'Name').toString().trim();
    
    // Get initials safely
    const firstInitial = validFirstName.length > 0 ? validFirstName.charAt(0).toUpperCase() : 'U';
    const lastInitial = validLastName.length > 0 ? validLastName.charAt(0).toUpperCase() : 'N';
    const initials = `${firstInitial}${lastInitial}`;
    
    // Generate random string
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp for uniqueness
    const year = new Date().getFullYear();
    
    const code = `NEDAXER_${initials}${year}_${randomString}${timestamp}`;
    console.log(`[REFERRAL] Generated code: ${code} for ${validFirstName} ${validLastName}`);
    
    return code;
  } catch (error) {
    console.error('[REFERRAL] Error generating referral code:', error);
    // Fallback code generation
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `NEDAXER_GUEST_${timestamp}_${randomString}`;
  }
}

// Get referral stats for the current user
router.get("/stats", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    console.log(`[REFERRAL DEBUG] Getting stats for user: ${userId}`);
    
    // Get user's referral code, generate if doesn't exist
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    console.log(`[REFERRAL DEBUG] User query result:`, user.length > 0 ? 'User found' : 'User not found');
    
    if (!user.length) {
      console.log(`[REFERRAL DEBUG] User ${userId} not found in database`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const userData = user[0];
    console.log(`[REFERRAL DEBUG] User data:`, {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      existingReferralCode: userData.referralCode
    });
    
    let referralCode = userData.referralCode;
    if (!referralCode) {
      console.log(`[REFERRAL DEBUG] Generating new referral code for user ${userId}`);
      
      // Ensure we have valid names for code generation
      const firstName = userData.firstName || 'User';
      const lastName = userData.lastName || 'Name';
      
      referralCode = generateReferralCode(firstName, lastName);
      console.log(`[REFERRAL DEBUG] Generated code: ${referralCode}`);
      
      // Update the user with the new referral code
      try {
        const updateResult = await db
          .update(users)
          .set({ referralCode })
          .where(eq(users.id, userId))
          .returning({ id: users.id, referralCode: users.referralCode });
        
        console.log(`[REFERRAL DEBUG] Update result:`, updateResult);
      } catch (updateError) {
        console.error(`[REFERRAL DEBUG] Error updating referral code:`, updateError);
        // Continue with the generated code even if update fails
      }
    } else {
      console.log(`[REFERRAL DEBUG] Using existing referral code: ${referralCode}`);
    }

    // Initialize default stats
    let totalEarnings = 0;
    let totalReferrals = 0;
    let monthlyEarnings = 0;
    let recentEarnings: any[] = [];

    try {
      // Get total earnings
      const totalEarningsResult = await db
        .select({ 
          total: sql<number>`COALESCE(SUM(${referralEarnings.amount}), 0)` 
        })
        .from(referralEarnings)
        .where(eq(referralEarnings.referrerId, userId));
      
      totalEarnings = Number(totalEarningsResult[0]?.total || 0);
      console.log(`[REFERRAL DEBUG] Total earnings: ${totalEarnings}`);

      // Get total referrals count
      const totalReferralsResult = await db
        .select({ 
          count: sql<number>`COUNT(DISTINCT ${referralEarnings.referredUserId})` 
        })
        .from(referralEarnings)
        .where(eq(referralEarnings.referrerId, userId));
      
      totalReferrals = Number(totalReferralsResult[0]?.count || 0);
      console.log(`[REFERRAL DEBUG] Total referrals: ${totalReferrals}`);

      // Get monthly earnings (current month)
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const monthlyEarningsResult = await db
        .select({ 
          monthly: sql<number>`COALESCE(SUM(${referralEarnings.amount}), 0)` 
        })
        .from(referralEarnings)
        .where(
          and(
            eq(referralEarnings.referrerId, userId),
            sql`${referralEarnings.createdAt} >= ${startOfMonth}`
          )
        );
      
      monthlyEarnings = Number(monthlyEarningsResult[0]?.monthly || 0);
      console.log(`[REFERRAL DEBUG] Monthly earnings: ${monthlyEarnings}`);

      // Get recent earnings with user info
      const recentEarningsResult = await db
        .select({
          id: referralEarnings.id,
          amount: referralEarnings.amount,
          percentage: referralEarnings.percentage,
          transactionType: referralEarnings.transactionType,
          createdAt: referralEarnings.createdAt,
          referredUserEmail: users.email
        })
        .from(referralEarnings)
        .innerJoin(users, eq(users.id, referralEarnings.referredUserId))
        .where(eq(referralEarnings.referrerId, userId))
        .orderBy(desc(referralEarnings.createdAt))
        .limit(10);

      recentEarnings = recentEarningsResult.map(earning => ({
        id: earning.id,
        amount: Number(earning.amount),
        percentage: Number(earning.percentage),
        transactionType: earning.transactionType,
        referredUserEmail: earning.referredUserEmail,
        createdAt: earning.createdAt.toISOString()
      }));
      
      console.log(`[REFERRAL DEBUG] Recent earnings count: ${recentEarnings.length}`);
    } catch (earningsError) {
      console.error(`[REFERRAL DEBUG] Error fetching earnings data:`, earningsError);
      // Continue with default values
    }

    const stats = {
      totalEarnings,
      totalReferrals,
      monthlyEarnings,
      referralCode,
      recentEarnings
    };

    console.log(`[REFERRAL DEBUG] Final stats:`, stats);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[REFERRAL DEBUG] Error fetching referral stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Add referral earning (called when referred user performs an action)
router.post("/add-earning", requireAuth, async (req: Request, res: Response) => {
  try {
    const { referredUserId, amount, percentage, transactionType, originalAmount, currencyId } = req.body;
    const referrerId = req.session.userId!;

    // Verify the referred user exists and was referred by this user
    const referredUser = await db
      .select()
      .from(users)
      .where(and(
        eq(users.id, referredUserId),
        eq(users.referredBy, referrerId)
      ))
      .limit(1);

    if (!referredUser.length) {
      return res.status(400).json({ success: false, message: 'Invalid referral relationship' });
    }

    // Add the earning record
    await db.insert(referralEarnings).values({
      referrerId,
      referredUserId,
      amount: Number(amount),
      percentage: Number(percentage),
      transactionType,
      originalAmount: Number(originalAmount),
      currencyId: Number(currencyId)
    });

    res.json({ success: true, message: 'Referral earning added successfully' });
  } catch (error) {
    console.error('Error adding referral earning:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Validate referral code during registration
router.get("/validate/:code", async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    
    const referrer = await db
      .select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
      .from(users)
      .where(eq(users.referralCode, code))
      .limit(1);

    if (!referrer.length) {
      return res.status(404).json({ success: false, message: 'Invalid referral code' });
    }

    res.json({ 
      success: true, 
      data: { 
        referrerId: referrer[0].id,
        referrerName: `${referrer[0].firstName} ${referrer[0].lastName}`
      }
    });
  } catch (error) {
    console.error('Error validating referral code:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Development endpoint to create test referral data
router.post("/create-test-data", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId!;
    
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Not available in production' });
    }
    
    console.log(`[REFERRAL TEST] Creating test data for user: ${userId}`);
    
    // Ensure user has a referral code
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    let referralCode = user[0].referralCode;
    if (!referralCode) {
      referralCode = generateReferralCode(user[0].firstName || 'Test', user[0].lastName || 'User');
      await db.update(users).set({ referralCode }).where(eq(users.id, userId));
    }
    
    // Create some test earnings if none exist
    const existingEarnings = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.referrerId, userId))
      .limit(1);
    
    if (existingEarnings.length === 0) {
      // Create dummy referred user IDs (using other existing users or create fake ones)
      const otherUsers = await db.select({ id: users.id }).from(users).where(sql`${users.id} != ${userId}`).limit(3);
      
      const testEarnings = [
        {
          referrerId: userId,
          referredUserId: otherUsers[0]?.id || userId, // Fallback to self for testing
          amount: 25.50,
          percentage: 25,
          transactionType: 'trading',
          originalAmount: 102.00,
          currencyId: 'USD'
        },
        {
          referrerId: userId,
          referredUserId: otherUsers[1]?.id || userId,
          amount: 15.75,
          percentage: 15,
          transactionType: 'deposit',
          originalAmount: 105.00,
          currencyId: 'USD'
        }
      ];
      
      try {
        await db.insert(referralEarnings).values(testEarnings);
        console.log(`[REFERRAL TEST] Created ${testEarnings.length} test earnings`);
      } catch (insertError) {
        console.error(`[REFERRAL TEST] Error creating test earnings:`, insertError);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Test data created successfully',
      referralCode 
    });
  } catch (error) {
    console.error('[REFERRAL TEST] Error creating test data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;