import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { mongoStorage as storage } from './mongoStorage';
import { InsertMongoUser } from '@shared/mongo-schema';

// Configure Google OAuth strategy - using environment variables only
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required');
}

// Dynamic callback URL based on environment
const getCallbackURL = () => {
  // Check multiple environment variables for domain detection
  const possibleDomains = [
    process.env.BASE_URL,
    process.env.REPLIT_DOMAINS,
    process.env.REPLIT_DEV_DOMAIN,
    process.env.REPL_SLUG && process.env.REPL_OWNER ? 
      `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.replit.dev` : null,
    // Auto-detect from headers if available
    process.env.REPLIT_URL
  ].filter(Boolean);

  console.log('Available domain options:', possibleDomains);

  for (const domain of possibleDomains) {
    if (domain) {
      const cleanDomain = domain.startsWith('http') ? domain : `https://${domain}`;
      const callbackUrl = `${cleanDomain}/auth/google/callback`;
      console.log(`Using domain for Google OAuth callback: ${callbackUrl}`);
      return callbackUrl;
    }
  }

  // Production fallback
  const renderCallback = "https://nedaxer.onrender.com/auth/google/callback";
  console.log(`Using fallback for Google OAuth callback: ${renderCallback}`);
  return renderCallback;
};

const callbackURL = getCallbackURL();

passport.use(new GoogleStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: callbackURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔧 Google OAuth Configuration Debug:', {
      clientID: clientID ? `SET (${clientID.substring(0, 12)}...)` : 'MISSING',
      clientSecret: clientSecret ? `SET (${clientSecret.substring(0, 8)}...)` : 'MISSING',
      callbackURL: callbackURL,
      currentDomain: process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN || 'unknown',
      allReplitEnvVars: {
        REPLIT_DOMAINS: process.env.REPLIT_DOMAINS,
        REPLIT_DEV_DOMAIN: process.env.REPLIT_DEV_DOMAIN,
        REPL_SLUG: process.env.REPL_SLUG,
        REPL_OWNER: process.env.REPL_OWNER,
        BASE_URL: process.env.BASE_URL,
        REPLIT_URL: process.env.REPLIT_URL
      }
    });

    console.log('🌐 IMPORTANT: Add this domain to Google Cloud Console:');
    console.log('   Authorized JavaScript origins:', callbackURL.replace('/auth/google/callback', ''));
    console.log('   Authorized redirect URIs:', callbackURL);

    console.log('Google OAuth profile received:', {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName
    });

    const email = profile.emails?.[0]?.value;

    if (!email) {
      return done(new Error('No email found in Google profile'), undefined);
    }

    // Check if user already exists with this email
    let user = await storage.getUserByEmail(email);

    if (user) {
      console.log('Existing user found, logging in:', user.email);
      return done(null, user);
    }

    // Create new user from Google profile
    const firstName = profile.name?.givenName || '';
    const lastName = profile.name?.familyName || '';
    const displayName = profile.displayName || email.split('@')[0];

    const newUser = await storage.createUser({
      username: email,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: '', // No password needed for OAuth users
      favorites: [],
      isVerified: true, // Google accounts are pre-verified
      isAdmin: false,
      balance: 0,
      kycStatus: 'none',
      profilePicture: profile.photos?.[0]?.value || '',
      googleId: profile.id
    });

    console.log('New Google user created:', newUser.email);
    return done(null, newUser);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, undefined);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;