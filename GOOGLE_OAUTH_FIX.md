# Google OAuth Configuration Fix

## Current Issue
The Google OAuth authentication is failing with "Error 401: invalid_client" because the current Replit domain is not configured in your Google Cloud Console OAuth application.

## Current Settings (Updated January 6, 2025)
- **Current Replit Domain**: `43394f07-8670-4a8d-a365-45d78480cb74-00-11yizgzgxkswa.picard.replit.dev`
- **Callback URL**: `https://43394f07-8670-4a8d-a365-45d78480cb74-00-11yizgzgxkswa.picard.replit.dev/auth/google/callback`

## System Status
✅ **Admin KYC System**: FULLY FUNCTIONAL
✅ **Admin Authentication**: WORKING
✅ **KYC Approval Workflow**: COMPLETE
✅ **Notification System**: INTEGRATED
❌ **Google OAuth**: REQUIRES DOMAIN CONFIGURATION

## Required Google Cloud Console Configuration

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Navigate to **APIs & Services** > **Credentials**

### Step 2: Configure OAuth 2.0 Client
1. Find your OAuth 2.0 Client ID in the credentials list
2. Click on it to edit
3. Under **Authorized JavaScript origins**, add:
   ```
   https://43394f07-8670-4a8d-a365-45d78480cb74-00-11yizgzgxkswa.picard.replit.dev
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   https://43394f07-8670-4a8d-a365-45d78480cb74-00-11yizgzgxkswa.picard.replit.dev/auth/google/callback
   ```

### Step 3: OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Ensure your app is configured for external users
3. Add the current domain to authorized domains if required

### Step 4: Test Configuration
After updating the settings, wait a few minutes for changes to propagate, then test the Google OAuth login.

## Alternative: Use Wildcard Domain (if available)
If you have a paid Google Cloud account, you can use:
- Origin: `https://*.replit.dev`
- Callback: `https://*.replit.dev/auth/google/callback`

This will work for all future Replit domains.

## Current Environment Variables
The following environment variables are properly configured:
- ✅ GOOGLE_CLIENT_ID: Exists
- ✅ GOOGLE_CLIENT_SECRET: Exists
- ✅ REPLIT_DOMAINS: Set correctly

## Next Steps
1. Update your Google Cloud Console OAuth application with the current domain
2. Test the Google OAuth login functionality
3. The system will automatically redirect to the mobile app after successful authentication