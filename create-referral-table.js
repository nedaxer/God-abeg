
import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function createReferralEarningsTable() {
  try {
    console.log('🔧 Creating referral_earnings table if it doesn\'t exist...');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS referral_earnings (
        id SERIAL PRIMARY KEY,
        referrer_id INTEGER NOT NULL REFERENCES users(id),
        referred_user_id INTEGER NOT NULL REFERENCES users(id),
        amount DOUBLE PRECISION NOT NULL,
        percentage DOUBLE PRECISION NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        original_amount DOUBLE PRECISION NOT NULL,
        currency_id VARCHAR(10) DEFAULT 'USD' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);
    
    console.log('✅ Referral earnings table created/verified successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating referral earnings table:', error);
    process.exit(1);
  }
}

createReferralEarningsTable();
