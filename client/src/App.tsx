import { useState, useEffect } from 'react';
import { Route, Switch, Router, Redirect } from 'wouter';
import { useHashLocation } from './hooks/use-hash-location';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/protected-route';
import { ProtectedRouteWithTransition } from '@/components/protected-route-with-transition';
import { AuthRedirect } from '@/components/auth-redirect';

import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { SplashScreen } from '@/components/splash-screen';
import { BottomSlideBanner } from '@/components/bottom-slide-banner';
import { useBottomBanner } from '@/hooks/use-bottom-banner';
import { ErrorBoundary } from '@/components/error-boundary';
import { TransitionRoute, NoTransitionRoute } from '@/components/route-transition-wrapper';

import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { WithdrawalProvider } from '@/contexts/withdrawal-context';
import { lazy } from 'react';
import { CookieConsent } from '@/components/cookie-consent';

// Pages
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

// Trading Pages (removed - using mobile interface only)
// import SpotTrading from '@/pages/SpotTrading';
// import Futures from '@/pages/Futures';
// import Staking from '@/pages/Staking';
// import Deposit from '@/pages/Deposit';
// import Withdraw from '@/pages/Withdraw';
// import AdminPanel from '@/pages/AdminPanel';

// Company Pages
import About from '@/pages/company/about';
import Careers from '@/pages/company/careers';
import Contact from '@/pages/company/contact';
import News from '@/pages/company/news';
import Regulations from '@/pages/company/regulations';

// Products Pages
import BinaryOptions from '@/pages/products/binary-options';
import CallSpreads from '@/pages/products/call-spreads';
import KnockOuts from '@/pages/products/knock-outs';
import Pricing from '@/pages/products/pricing';
import TouchBrackets from '@/pages/products/touch-brackets';

// Markets Pages
import AltcoinMarkets from '@/pages/markets/altcoins';
import BitcoinMarkets from '@/pages/markets/bitcoin';
import Commodities from '@/pages/markets/commodities';
import CryptoEvents from '@/pages/markets/crypto-events';
import EthereumMarkets from '@/pages/markets/ethereum';
import Events from '@/pages/markets/events';
import MarketData from '@/pages/markets/market-data';
import LiveMarkets from '@/pages/markets/live-markets';

// Platform Pages
import Funding from '@/pages/platform/funding';
import MobileApp from '@/pages/platform/mobile-app';
import Security from '@/pages/platform/security';
import WebPlatform from '@/pages/platform/web-platform';

// Learn Pages
import BinaryOptionsLearn from '@/pages/learn/binary-options';
import CallSpreadsLearn from '@/pages/learn/call-spreads';
import GettingStarted from '@/pages/learn/getting-started';
import KnockOutsLearn from '@/pages/learn/knock-outs';
import TradingGuides from '@/pages/learn/trading-guides';
import TradingStrategies from '@/pages/learn/trading-strategies';
import Webinars from '@/pages/learn/webinars';

// Legal Pages
import CFTC from '@/pages/legal/cftc';
import Privacy from '@/pages/legal/privacy';
import Risk from '@/pages/legal/risk';
import Terms from '@/pages/legal/terms';

// Account Pages
import Login from '@/pages/account/login';
import Register from '@/pages/account/register';
import ForgotPassword from '@/pages/account/forgot-password';
import ResetPassword from '@/pages/account/reset-password';
import VerifyAccount from '@/pages/account/verify';

// Legacy Dashboard Pages (keeping for compatibility)
// import LegacyDashboard from '@/pages/dashboard';
// import Trade from '@/pages/dashboard/trade';
// import LegacyStaking from '@/pages/dashboard/staking';
// import LegacyDeposit from '@/pages/dashboard/deposit';

// Mobile Pages
import MobileHome from '@/pages/mobile/home';
import MobileAssets from '@/pages/mobile/assets';
import MobileTrade from '@/pages/mobile/trade';
import MobileMarkets from '@/pages/mobile/markets';
import MobileEarn from '@/pages/mobile/earn';
import MobileProfile from '@/pages/mobile/profile';
import ProfileSettings from '@/pages/mobile/profile-settings';

import MobileFutures from '@/pages/mobile/futures';
import MobileSpot from '@/pages/mobile/spot';
import MobileInviteFriends from '@/pages/mobile/invite-friends';
import MobileNotifications from '@/pages/mobile/notifications';
import NotificationSettings from '@/pages/mobile/notification-settings';
import Chatbot from '@/pages/mobile/chatbot';

import MobileNews from '@/pages/mobile/news';

import MobileSecurity from '@/pages/mobile/security';
import LanguageSelection from '@/pages/mobile/language-selection';
import AssetsHistory from '@/pages/mobile/assets-history';
import DepositDetails from '@/pages/mobile/deposit-details';
import WithdrawalDetailsAdaptive from '@/pages/withdrawal-details-adaptive';
import TransferDetails from '@/pages/mobile/transfer-details';
import Transfer from '@/pages/mobile/transfer';
import MobileWithdrawal from '@/pages/mobile/withdrawal';
import MessagesPage from '@/pages/mobile/messages';
import DepositSelectionPage from '@/pages/mobile/deposit-selection';
import MobileDeposit from '@/pages/mobile/deposit';
import { VerificationFlow } from '@/pages/mobile/verification/VerificationFlow';
import MobileKYCStatus from '@/pages/mobile/kyc-status';
import VerificationSubmitted from '@/pages/mobile/verification-submitted';


// Admin Pages
import UnifiedAdminPortal from '@/pages/admin-portal-unified';

// Other Pages
import SiteMap from '@/pages/site-map';
import PortfolioDemo from '@/pages/portfolio-demo';
import BannerTest from '@/pages/banner-test';
import TransitionDemo from '@/pages/transition-demo';



// Provide a loading state
function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0033a0]"></div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [appCrashed, setAppCrashed] = useState(false);
  const { currentBanner, dismissBanner } = useBottomBanner();

  useEffect(() => {
    // Error boundary to catch app crashes
    const handleError = (error: ErrorEvent) => {
      console.error('App error:', error);
      
      // Don't crash app for common network or authentication errors
      if (error.message?.includes('fetch') || 
          error.message?.includes('Network') ||
          error.message?.includes('auth') ||
          error.message?.includes('401')) {
        console.log('Network/auth error, not crashing app');
        return;
      }
      
      setAppCrashed(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Always prevent default to stop the error from crashing the app
      event.preventDefault();
      
      // Don't crash app for any expected errors
      if (event.reason?.message?.includes('Not authenticated') || 
          event.reason?.message?.includes('401') ||
          event.reason?.message?.includes('WebSocket') ||
          event.reason?.message?.includes('websocket') ||
          event.reason?.message?.includes('vite') ||
          event.reason?.status === 401 ||
          event.reason?.type === 'unhandledrejection') {
        console.log('Expected error (auth/websocket/vite), not crashing app');
        return;
      }
      
      // Only crash for actual critical application errors
      if (event.reason?.stack && event.reason?.name !== 'TypeError') {
        setAppCrashed(true);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Always show splash screen for testing the optimizations
    // Comment out the cache check temporarily to test the improvements
    // const lastSplashTime = localStorage.getItem('lastSplashTime');
    // const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    // 
    // if (lastSplashTime && parseInt(lastSplashTime) > fiveMinutesAgo) {
    //   setShowSplash(false);
    // }

    // Just a small delay to ensure all routes are registered
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleSplashComplete = () => {
    localStorage.setItem('lastSplashTime', Date.now().toString());
    setShowSplash(false);
  };

  // Show splash screen on first visit
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show loading indicator while routes are being set up
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Show error fallback if app crashed
  if (appCrashed) {
    return (
      <div className="min-h-screen bg-[#0a0a2e] flex items-center justify-center p-4">
        <div className="text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-8">The app encountered an error. Please try again.</p>
          <button 
            onClick={() => {
              setAppCrashed(false);
              window.location.reload();
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <WithdrawalProvider>
              <Router hook={useHashLocation}>
                <ErrorBoundary 
                  fallback={
                    <div className="min-h-screen bg-[#0a0a2e] flex items-center justify-center p-4">
                      <div className="text-center max-w-sm mx-auto">
                        <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
                        <p className="text-gray-400 mb-8">Please wait while we load the application.</p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  }
                >
            <Switch>
            {/* Home route with auth redirect - WITH Glass Slide Transition */}
            <Route path="/">
              {(params) => (
                <TransitionRoute>
                  <AuthRedirect>
                    <Home {...(params || {})} />
                  </AuthRedirect>
                </TransitionRoute>
              )}
            </Route>

            {/* Company Routes - With Glass Slide Transitions */}
            <Route path="/company/about">
              {(params) => <TransitionRoute><About {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/company/careers">
              {(params) => <TransitionRoute><Careers {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/company/contact">
              {(params) => <TransitionRoute><Contact {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/company/news">
              {(params) => <TransitionRoute><News {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/company/regulations">
              {(params) => <TransitionRoute><Regulations {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Products Routes - With Glass Slide Transitions */}
            <Route path="/products/binary-options">
              {(params) => <TransitionRoute><BinaryOptions {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/products/call-spreads">
              {(params) => <TransitionRoute><CallSpreads {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/products/knock-outs">
              {(params) => <TransitionRoute><KnockOuts {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/products/pricing">
              {(params) => <TransitionRoute><Pricing {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/products/touch-brackets">
              {(params) => <TransitionRoute><TouchBrackets {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Markets Routes - With Glass Slide Transitions */}
            <Route path="/markets/altcoins">
              {(params) => <TransitionRoute><AltcoinMarkets {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/bitcoin">
              {(params) => <TransitionRoute><BitcoinMarkets {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/commodities">
              {(params) => <TransitionRoute><Commodities {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/crypto-events">
              {(params) => <TransitionRoute><CryptoEvents {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/ethereum">
              {(params) => <TransitionRoute><EthereumMarkets {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/events">
              {(params) => <TransitionRoute><Events {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/market-data">
              {(params) => <TransitionRoute><MarketData {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/markets/live-markets">
              {(params) => <TransitionRoute><LiveMarkets {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Platform Routes - With Glass Slide Transitions */}
            <Route path="/platform/funding">
              {(params) => <TransitionRoute><Funding {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/platform/mobile-app">
              {(params) => <TransitionRoute><MobileApp {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/platform/security">
              {(params) => <TransitionRoute><Security {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/platform/web-platform">
              {(params) => <TransitionRoute><WebPlatform {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Learn Routes - With Glass Slide Transitions */}
            <Route path="/learn/binary-options">
              {(params) => <TransitionRoute><BinaryOptionsLearn {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/learn/call-spreads">
              {(params) => <TransitionRoute><CallSpreadsLearn {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/learn/getting-started">
              {(params) => <TransitionRoute><GettingStarted {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/learn/knock-outs">
              {(params) => <TransitionRoute><KnockOutsLearn {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/learn/trading-guides">
              {(params) => <TransitionRoute><TradingGuides {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/learn/trading-strategies">
              {(params) => <TransitionRoute><TradingStrategies {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/learn/webinars">
              {(params) => <TransitionRoute><Webinars {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Legal Routes - With Glass Slide Transitions */}
            <Route path="/legal/cftc">
              {(params) => <TransitionRoute><CFTC {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/legal/privacy">
              {(params) => <TransitionRoute><Privacy {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/legal/risk">
              {(params) => <TransitionRoute><Risk {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/legal/terms">
              {(params) => <TransitionRoute><Terms {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Account Routes - with redirection for authenticated users and Glass Slide Transitions */}
            <Route path="/account/login">
              {(params) => (
                <TransitionRoute>
                  <AuthRedirect redirectTo="/mobile">
                    <Login {...(params || {})} />
                  </AuthRedirect>
                </TransitionRoute>
              )}
            </Route>
            <Route path="/account/register">
              {(params) => (
                <TransitionRoute>
                  <AuthRedirect redirectTo="/mobile">
                    <Register {...(params || {})} />
                  </AuthRedirect>
                </TransitionRoute>
              )}
            </Route>
            <Route path="/account/forgot-password">
              {(params) => <TransitionRoute><ForgotPassword {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/account/reset-password">
              {(params) => <TransitionRoute><ResetPassword {...(params || {})} /></TransitionRoute>}
            </Route>
            {/* Alternative route to catch reset-password with query params */}
            <Route path="/account/reset-password*" component={(params: any) => (
              <TransitionRoute><ResetPassword {...(params || {})} /></TransitionRoute>
            )} />
            {/* Account verification page - accessible to unverified users only */}
            <Route path="/account/verify">
              {(params) => <TransitionRoute><VerifyAccount {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Dashboard Route - Redirect to Mobile */}
            <Route path="/dashboard">
              {() => <Redirect to="/mobile" />}
            </Route>

            {/* Trading Platform Routes - Redirect to Mobile */}
            <Route path="/spot-trading">{() => <Redirect to="/mobile/spot" />}</Route>
            <Route path="/futures">{() => <Redirect to="/mobile/futures" />}</Route>
            <Route path="/staking">{() => <Redirect to="/mobile/earn" />}</Route>
            <Route path="/deposit">{() => <Redirect to="/mobile" />}</Route>
            <Route path="/withdraw">{() => <Redirect to="/mobile" />}</Route>

            {/* Mobile App Main Routes - NO Glass Slide Transitions (as requested) */}
            <ProtectedRouteWithTransition path="/mobile" component={MobileHome} disableTransition={true} />
            <ProtectedRouteWithTransition path="/mobile/assets" component={MobileAssets} disableTransition={true} />
            <ProtectedRouteWithTransition path="/mobile/trade" component={MobileTrade} disableTransition={true} />
            <ProtectedRouteWithTransition path="/mobile/markets" component={MobileMarkets} disableTransition={true} />

            {/* Mobile Secondary Routes - WITH Glass Slide Transitions */}
            <ProtectedRouteWithTransition path="/mobile/earn" component={MobileEarn} />
            <ProtectedRouteWithTransition path="/mobile/profile" component={MobileProfile} />
            <ProtectedRouteWithTransition path="/mobile/profile-settings" component={ProfileSettings} />
            <ProtectedRouteWithTransition path="/mobile/futures" component={MobileFutures} />
            <ProtectedRouteWithTransition path="/mobile/spot" component={MobileSpot} />
            <ProtectedRouteWithTransition path="/mobile/invite-friends" component={MobileInviteFriends} />
            <ProtectedRouteWithTransition path="/mobile/notifications" component={MobileNotifications} />
            <ProtectedRouteWithTransition path="/mobile/notification-settings" component={NotificationSettings} />
            <ProtectedRouteWithTransition path="/mobile/chatbot" component={Chatbot} />
            <ProtectedRouteWithTransition path="/mobile/messages" component={MessagesPage} />
            <ProtectedRouteWithTransition path="/mobile/news" component={MobileNews} disableTransition={true} />
            <ProtectedRouteWithTransition path="/mobile/security" component={MobileSecurity} />
            <ProtectedRouteWithTransition path="/mobile/language-selection" component={LanguageSelection} />
            <ProtectedRouteWithTransition path="/mobile/assets-history" component={AssetsHistory} />
            <ProtectedRouteWithTransition path="/mobile/deposit-details/:transactionId" component={DepositDetails} />
            <ProtectedRouteWithTransition path="/mobile/withdrawal-details/:transactionId" component={WithdrawalDetailsAdaptive} />
            <ProtectedRouteWithTransition path="/mobile/transfer-details/:transactionId" component={TransferDetails} />
            <ProtectedRouteWithTransition path="/mobile/transfer" component={Transfer} />
            <ProtectedRouteWithTransition path="/mobile/withdrawal" component={MobileWithdrawal} />
            <ProtectedRouteWithTransition path="/mobile/deposit-selection" component={DepositSelectionPage} />
            <ProtectedRouteWithTransition path="/mobile/deposit" component={MobileDeposit} />
            <ProtectedRouteWithTransition path="/mobile/verification" component={VerificationFlow} />
            <ProtectedRouteWithTransition path="/mobile/kyc-status" component={MobileKYCStatus} />
            <ProtectedRouteWithTransition path="/mobile/verification-submitted" component={VerificationSubmitted} />

            {/* Currency Selection with inline component */}
            <Route path="/mobile/currency-selection">
              {(params) => <TransitionRoute><div>Currency Selection</div></TransitionRoute>}
            </Route>


            {/* Admin Portal Routes - WITH Glass Slide Transitions */}
            <Route path="/admin-portal">
              {(params) => <TransitionRoute><UnifiedAdminPortal {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/admin-portal-enhanced">
              {(params) => <TransitionRoute><UnifiedAdminPortal {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/admin">
              {(params) => <TransitionRoute><UnifiedAdminPortal {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* Other Routes - WITH Glass Slide Transitions */}
            <Route path="/site-map">
              {(params) => <TransitionRoute><SiteMap {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/portfolio-demo">
              {(params) => <TransitionRoute><PortfolioDemo {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/banner-test">
              {(params) => <TransitionRoute><BannerTest {...(params || {})} /></TransitionRoute>}
            </Route>
            <Route path="/transition-demo">
              {(params) => <TransitionRoute><TransitionDemo {...(params || {})} /></TransitionRoute>}
            </Route>

            {/* 404 Route - WITH Glass Slide Transition */}
            <Route>
              {(params) => <TransitionRoute><NotFound {...(params || {})} /></TransitionRoute>}
            </Route>
            </Switch>
                </ErrorBoundary>
            <BottomSlideBanner 
              notification={currentBanner}
              onDismiss={dismissBanner}
            />
            <CookieConsent />
            <PWAInstallPrompt />
            </Router>
          </WithdrawalProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
  </ErrorBoundary>
  );
}