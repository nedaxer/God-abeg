// @ts-nocheck
// Bundle optimization utilities for reducing chunk sizes
// Alternative approach since vite.config.ts cannot be modified

// Dynamic import functions to reduce initial bundle size
export const loadAdminPortal = () => import('../pages/admin-portal-unified');
export const loadTradingChart = () => import('../components/advanced-trading-chart');
export const loadLightweightChart = () => import('../components/lightweight-chart');
export const loadTradingViewWidget = () => import('../components/tradingview-widget');

// Mobile page loaders
export const loadMobileHome = () => import('../pages/mobile/home');
export const loadMobileMarkets = () => import('../pages/mobile/markets');
export const loadMobileAssets = () => import('../pages/mobile/assets');
export const loadMobileTrade = () => import('../pages/mobile/trade');
export const loadMobileProfile = () => import('../pages/mobile/profile');
export const loadMobileSettings = () => import('../pages/mobile/settings');

// Heavy component loaders
export const loadDepositModal = () => import('../components/deposit-modal');
export const loadCryptoSelectionModal = () => import('../components/crypto-selection-modal');
export const loadNotificationModal = () => import('../components/notification-message-modal');

// Crypto library loaders (major contributors to bundle size)
export const loadBitcoinLibs = async () => {
  const [bitcoinjs, bip32, bip39] = await Promise.all([
    import('bitcoinjs-lib'),
    import('bip32'),
    import('bip39')
  ]);
  return { bitcoinjs, bip32, bip39 };
};

// Chart library loaders
export const loadChartLibs = async () => {
  const [recharts, lightweightCharts] = await Promise.all([
    import('recharts'),
    import('lightweight-charts')
  ]);
  return { recharts, lightweightCharts };
};