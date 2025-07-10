// Google OAuth Configuration Fix
// Run this to verify current configuration

import axios from 'axios';

async function debugGoogleOAuth() {
  try {
    console.log('🔧 GOOGLE OAUTH CONFIGURATION DEBUG');
    console.log('====================================');

    // Check current configuration
    const response = await axios.get('http://localhost:5000/api/auth/debug-callback');
    console.log('\n📋 Current Configuration:');
    console.log(JSON.stringify(response.data, null, 2));

    // Expected configuration for Google Cloud Console
    console.log('\n🌐 REQUIRED GOOGLE CLOUD CONSOLE SETTINGS:');
    console.log('==========================================');
    
    const currentDomain = '3093c53e-ad87-42cc-96be-582a5be74ca5-00-1e4f5sk4j7c01.kirk.replit.dev';
    console.log('\n1. OAuth 2.0 Client ID Configuration:');
    console.log(`   Client ID: 743240689211-84rndle2bgiko4p26tcaeugnlmu1pua7.apps.googleusercontent.com`);
    console.log('\n2. Authorized JavaScript origins:');
    console.log(`   https://${currentDomain}`);
    console.log('\n3. Authorized redirect URIs:');
    console.log(`   https://${currentDomain}/auth/google/callback`);
    
    console.log('\n🔄 ALTERNATIVE WILDCARD CONFIGURATION:');
    console.log('=====================================');
    console.log('Authorized JavaScript origins:');
    console.log('   https://*.replit.dev');
    console.log('Authorized redirect URIs:');
    console.log('   https://*.replit.dev/auth/google/callback');
    
    console.log('\n⚠️  TROUBLESHOOTING STEPS:');
    console.log('=========================');
    console.log('1. Verify Client ID in Google Cloud Console matches: 743240689211-84rndle2bgiko4p26tcaeugnlmu1pua7.apps.googleusercontent.com');
    console.log('2. Ensure OAuth consent screen is configured for External users');
    console.log('3. Add current domain to authorized origins and redirect URIs');
    console.log('4. Wait 5-10 minutes after making changes for Google to propagate');
    console.log('5. Try using wildcard domains if you have a paid Google Cloud account');
    
    console.log('\n🧪 TEST GOOGLE OAUTH:');
    console.log('=====================');
    console.log(`Visit: https://${currentDomain}/auth/google`);
    console.log('This should redirect to Google OAuth without errors');

  } catch (error) {
    console.error('❌ Error checking configuration:', error.message);
  }
}

debugGoogleOAuth();