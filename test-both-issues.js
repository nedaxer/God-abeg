import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';

async function testBothIssues() {
  let client;
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('nedaxer');
    
    console.log('🔧 Testing both withdrawal restriction messages and transfer history...\n');
    
    // 1. Use admin login which we know works
    console.log('=== TESTING WITH ADMIN LOGIN ===');
    const adminLoginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'nedaxer.us@gmail.com',
        password: 'SMART456'
      })
    });
    
    const adminLoginData = await adminLoginResponse.json();
    console.log('Admin login response:', adminLoginData);
    
    if (adminLoginData.success) {
      const adminSessionCookie = adminLoginResponse.headers.get('set-cookie')?.split(';')[0] || '';
      console.log('Admin session cookie:', adminSessionCookie);
      
      // Test withdrawal restriction endpoint with admin session
      console.log('\n1. Testing Withdrawal Restriction with Admin Session:');
      const withdrawalResponse = await fetch('http://localhost:5000/api/user/withdrawal-restriction', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminSessionCookie
        }
      });
      
      const withdrawalData = await withdrawalResponse.json();
      console.log('Withdrawal restriction response:', JSON.stringify(withdrawalData, null, 2));
      
      // Test transfer history endpoint with admin session
      console.log('\n2. Testing Transfer History with Admin Session:');
      const transferResponse = await fetch('http://localhost:5000/api/transfers/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': adminSessionCookie
        }
      });
      
      const transferData = await transferResponse.json();
      console.log('Transfer history response:', JSON.stringify(transferData, null, 2));
      
      // Analyze results
      console.log('\n=== RESULTS ANALYSIS ===');
      
      if (withdrawalData.success) {
        console.log('✅ Withdrawal restriction endpoint working');
      } else {
        console.log('❌ Withdrawal restriction endpoint failed:', withdrawalData.message);
      }
      
      if (transferData.success) {
        console.log(`✅ Transfer history endpoint working - Found ${transferData.data?.length || 0} transfers`);
      } else {
        console.log('❌ Transfer history endpoint failed:', transferData.message);
      }
      
    } else {
      console.log('❌ Admin login failed:', adminLoginData.message);
    }
    
    // 2. Test direct database operations to verify data exists
    console.log('\n=== TESTING DATABASE OPERATIONS ===');
    
    // Check for users with withdrawal restriction messages
    const usersWithRestrictions = await db.collection('users').find({
      withdrawalRestrictionMessage: { $exists: true, $ne: null }
    }).toArray();
    
    console.log(`Found ${usersWithRestrictions.length} users with withdrawal restriction messages`);
    usersWithRestrictions.forEach(user => {
      console.log(`- ${user.email}: "${user.withdrawalRestrictionMessage}"`);
    });
    
    // Check for transfer records
    const transfers = await db.collection('transfers').find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log(`\nFound ${transfers.length} transfer records in database`);
    transfers.forEach(transfer => {
      console.log(`- ${transfer.transactionId}: $${transfer.amount} ${transfer.currency} (${transfer.status})`);
    });
    
  } catch (error) {
    console.error('Error testing both issues:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testBothIssues().catch(console.error);