import { useState, useEffect } from 'react';
import { Route, Switch, Router, Redirect } from 'wouter';
import { useHashLocation } from './hooks/use-hash-location';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/protected-route';
import { AuthRedirect } from '@/components/auth-redirect';

import { PWAInstallPrompt } from '@/components/pwa-install-prompt';
import { SplashScreen } from '@/components/splash-screen';
import { BottomSlideBanner } from '@/components/bottom-slide-banner';
import { useBottomBanner } from '@/hooks/use-bottom-banner';

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

import MobileFutures from '@/pages/mobile/futures';
import MobileSpot from '@/pages/mobile/spot';
import MobileInviteFriends from '@/pages/mobile/invite-friends';
import MobileNotifications from '@/pages/mobile/notifications';
import NotificationSettings from '@/pages/mobile/notification-settings';
import Chatbot from '@/pages/mobile/chatbot';

import MobileNews from '@/pages/mobile/news';
import MobileSettings from '@/pages/mobile/settings';
import MobileSecurity from '@/pages/mobile/security';
import LanguageSelection from '@/pages/mobile/language-selection';
import AssetsHistory from '@/pages/mobile/assets-history';
import DepositDetails from '@/pages/mobile/deposit-details';
import WithdrawalDetails from '@/pages/mobile/withdrawal-details';
import TransferDetails from '@/pages/mobile/transfer-details';
import Transfer from '@/pages/mobile/transfer';
import MobileWithdrawal from '@/pages/mobile/withdrawal';
import MessagesPage from '@/pages/mobile/messages';
import { VerificationFlow } from '@/pages/mobile/verification/VerificationFlow';
import MobileKYCStatus from '@/pages/mobile/kyc-status';
import VerificationSubmitted from '@/pages/mobile/verification-submitted';


// Admin Pages
import UnifiedAdminPortal from '@/pages/admin-portal-unified';

// Other Pages
import SiteMap from '@/pages/site-map';
import PortfolioDemo from '@/pages/portfolio-demo';
import BannerTest from '@/pages/banner-test';



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
      console.error('App crashed:', error);
      setAppCrashed(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setAppCrashed(true);
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
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <WithdrawalProvider>
              <Router hook={useHashLocation}>
            <Switch>
            {/* Home route with auth redirect */}
            <Route path="/">
              {(params) => (
                <AuthRedirect>
                  <Home {...(params || {})} />
                </AuthRedirect>
              )}
            </Route>

            {/* Company Routes */}
            <Route path="/company/about" component={About} />
            <Route path="/company/careers" component={Careers} />
            <Route path="/company/contact" component={Contact} />
            <Route path="/company/news" component={News} />
            <Route path="/company/regulations" component={Regulations} />

            {/* Products Routes */}
            <Route path="/products/binary-options" component={BinaryOptions} />
            <Route path="/products/call-spreads" component={CallSpreads} />
            <Route path="/products/knock-outs" component={KnockOuts} />
            <Route path="/products/pricing" component={Pricing} />
            <Route path="/products/touch-brackets" component={TouchBrackets} />

            {/* Markets Routes */}
            <Route path="/markets/altcoins" component={AltcoinMarkets} />
            <Route path="/markets/bitcoin" component={BitcoinMarkets} />
            <Route path="/markets/commodities" component={Commodities} />
            <Route path="/markets/crypto-events" component={CryptoEvents} />
            <Route path="/markets/ethereum" component={EthereumMarkets} />
            <Route path="/markets/events" component={Events} />
            <Route path="/markets/market-data" component={MarketData} />
            <Route path="/markets/live-markets" component={LiveMarkets} />

            {/* Platform Routes */}
            <Route path="/platform/funding" component={Funding} />
            <Route path="/platform/mobile-app" component={MobileApp} />
            <Route path="/platform/security" component={Security} />
            <Route path="/platform/web-platform" component={WebPlatform} />

            {/* Learn Routes */}
            <Route path="/learn/binary-options" component={BinaryOptionsLearn} />
            <Route path="/learn/call-spreads" component={CallSpreadsLearn} />
            <Route path="/learn/getting-started" component={GettingStarted} />
            <Route path="/learn/knock-outs" component={KnockOutsLearn} />
            <Route path="/learn/trading-guides" component={TradingGuides} />
            <Route path="/learn/trading-strategies" component={TradingStrategies} />
            <Route path="/learn/webinars" component={Webinars} />

            {/* Legal Routes */}
            <Route path="/legal/cftc" component={CFTC} />
            <Route path="/legal/privacy" component={Privacy} />
            <Route path="/legal/risk" component={Risk} />
            <Route path="/legal/terms" component={Terms} />

            {/* Account Routes - with redirection for authenticated users */}
            <Route path="/account/login">
              {(params) => (
                <AuthRedirect redirectTo="/mobile">
                  <Login {...(params || {})} />
                </AuthRedirect>
              )}
            </Route>
            <Route path="/account/register">
              {(params) => (
                <AuthRedirect redirectTo="/mobile">
                  <Register {...(params || {})} />
                </AuthRedirect>
              )}
            </Route>
            <Route path="/account/forgot-password" component={ForgotPassword} />
            {/* Redirect verify to mobile since we no longer need verification */}
            <Route path="/account/verify">
              {() => <Redirect to="/mobile" />}
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

            {/* Mobile App Routes */}
            <Route path="/mobile" component={MobileHome} />
            <Route path="/mobile/assets" component={MobileAssets} />
            <Route path="/mobile/trade" component={MobileTrade} />
            <Route path="/mobile/markets" component={MobileMarkets} />
            <Route path="/mobile/earn" component={MobileEarn} />
            <Route path="/mobile/profile" component={MobileProfile} />

            <Route path="/mobile/futures" component={MobileFutures} />
            <Route path="/mobile/spot" component={MobileSpot} />
            <Route path="/mobile/invite-friends" component={MobileInviteFriends} />
            <Route path="/mobile/notifications" component={MobileNotifications} />
            <Route path="/mobile/notification-settings" component={NotificationSettings} />
            <Route path="/mobile/chatbot" component={Chatbot} />
            <Route path="/mobile/messages" component={MessagesPage} />

            <Route path="/mobile/news" component={MobileNews} />
            <Route path="/mobile/settings" component={MobileSettings} />
            <Route path="/mobile/security" component={MobileSecurity} />
            <Route path="/mobile/language-selection" component={LanguageSelection} />
            <Route path="/mobile/assets-history" component={AssetsHistory} />
            <Route path="/mobile/deposit-details/:transactionId" component={DepositDetails} />
            <Route path="/mobile/withdrawal-details/:transactionId" component={WithdrawalDetails} />
            <Route path="/mobile/transfer-details/:transactionId" component={TransferDetails} />
            <Route path="/mobile/currency-selection">
              {() => <div>Currency Selection</div>}
            </Route>
            <Route path="/mobile/transfer" component={Transfer} />
            <Route path="/mobile/withdrawal" component={MobileWithdrawal} />
            <ProtectedRoute path="/mobile/verification" component={VerificationFlow} />
            <ProtectedRoute path="/mobile/kyc-status" component={MobileKYCStatus} />
            <ProtectedRoute path="/mobile/verification-submitted" component={VerificationSubmitted} />


            {/* Admin Portal Routes */}
            <Route path="/admin-portal" component={UnifiedAdminPortal} />
            <Route path="/admin-portal-enhanced" component={UnifiedAdminPortal} />
            <Route path="/admin" component={UnifiedAdminPortal} />

            {/* Other Routes */}
            <Route path="/site-map" component={SiteMap} />
            <Route path="/portfolio-demo" component={PortfolioDemo} />
            <Route path="/banner-test" component={BannerTest} />

            {/* 404 Route */}
            <Route component={NotFound} />
            </Switch>
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
  );
}