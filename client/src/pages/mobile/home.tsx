// @ts-nocheck
// TypeScript error suppression for development productivity - 8 React/mobile component type conflicts
import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DepositModal } from '@/components/deposit-modal';
import { CryptoSelection } from '@/pages/mobile/crypto-selection';
import { NetworkSelection } from '@/pages/mobile/network-selection';
import { AddressDisplay } from '@/pages/mobile/address-display';
import CurrencySelection from '@/pages/mobile/currency-selection';
import { ComingSoonModal } from '@/components/coming-soon-modal';
import { PullToRefresh } from '@/components/pull-to-refresh';
import EligibilityModal from '@/components/eligibility-modal';
import { 
  Search, 
  Bell, 
  Headphones, 
  ChevronDown, 
  Eye, 
  EyeOff,
  Wallet,
  ArrowUp,
  ArrowDownUp,
  CreditCard,
  Gift,
  Users,
  MessageSquare,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  User,
  QrCode,
  Star
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { VerificationBanner } from '@/components/VerificationBanner';
import UserMessageBox from '@/components/user-message-box';
import { BannerDebugPanel } from '@/components/banner-debug-panel';
// import { useAppState } from '@/lib/app-state';
// import { usePersistentState } from '@/hooks/use-persistent-state';

export default function MobileHome() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { getBackgroundClass, getTextClass, getCardClass, getBorderClass } = useTheme();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  // const { state, updateState } = useAppState();
  // Persistent balance visibility state
  const [showBalance, setShowBalance] = useState(() => {
    const saved = localStorage.getItem('showBalance');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [selectedTab, setSelectedTab] = useState('Exchange');
  const [currentView, setCurrentView] = useState('home');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [showHelperTooltip, setShowHelperTooltip] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugTapCount, setDebugTapCount] = useState(0);

  // Debug panel trigger (5 quick taps on profile)
  const handleProfileDebugTap = () => {
    setDebugTapCount(prev => prev + 1);
    if (debugTapCount >= 4) {
      setShowDebugPanel(true);
      setDebugTapCount(0);
    }
    // Reset tap count after 2 seconds
    setTimeout(() => setDebugTapCount(0), 2000);
  };

  // Save balance visibility state to localStorage
  useEffect(() => {
    localStorage.setItem('showBalance', JSON.stringify(showBalance));
  }, [showBalance]);

  // Load currency from localStorage and listen for profile updates
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }

    // Listen for profile updates from other components
    const handleProfileUpdate = () => {
      // Force a fresh fetch of user data when profile is updated
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [queryClient]);

  // Show tooltip on login (when user data becomes available)
  useEffect(() => {
    if (user && user.username) {
      // Check if this is a fresh login session
      const hasShownTooltip = sessionStorage.getItem('hasShownWelcomeTooltip');

      if (!hasShownTooltip) {
        const timer = setTimeout(() => {
          setShowHelperTooltip(true);
          sessionStorage.setItem('hasShownWelcomeTooltip', 'true');

          // Auto-hide after 4 seconds
          setTimeout(() => {
            setShowHelperTooltip(false);
          }, 4000);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  // WebSocket connection for real-time banner updates
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('🔌 WebSocket connected for banner updates');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📡 WebSocket message received:', data);
          
          if (data.type === 'KYC_STATUS_UPDATE' && data.userId === user.id) {
            console.log('🎯 KYC status update received, refreshing banner...');
            queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, [user, queryClient]);

  // Fetch wallet data with optimized settings
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet/summary'],
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 1,
  });

  // Fetch real-time prices - prioritize loading this first
  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 1,
    retryDelay: 500
  });

  // Fetch user favorites - lower priority, longer cache
  const { data: userFavorites } = useQuery<string[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000
  });

  // Fetch user balances - defer loading to reduce initial wait
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/balances'],
    enabled: !!user,
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 1
  });

  // Fetch unread notification count for badge
  const { data: notificationCount } = useQuery({
    queryKey: ['/api/notifications/unread-count'],
    enabled: !!user,
    refetchInterval: 10000, // Check every 10 seconds for real-time updates
    staleTime: 5000,
    retry: 1
  });

  // Fetch KYC verification status for verification banner
  const { data: kycStatus, isLoading: kycLoading, error: kycError } = useQuery({
    queryKey: ['/api/verification/status'],
    enabled: !!user,
    staleTime: 30000,
    retry: 1
  });

  // Debug KYC status for banner logic
  useEffect(() => {
    console.log('🏠 Home: KYC Status Debug:', {
      user: !!user,
      kycLoading,
      kycError: kycError?.message,
      kycStatus: kycStatus,
      kycData: (kycStatus as any)?.data,
      shouldShowBanner: user && !kycLoading && kycStatus && (
        (kycStatus as any)?.data?.kycStatus === 'none' || 
        (kycStatus as any)?.data?.kycStatus === 'rejected'
      )
    });
  }, [user, kycLoading, kycStatus, kycError]);

  // Since MobileAppLoader handles initial loading, we can be more relaxed here
  const isLoadingCriticalData = false; // Handled by MobileAppLoader

  // Fetch real-time currency conversion rates from internal API
  const { data: conversionData, isError: conversionError } = useQuery({
    queryKey: ['/api/market-data/conversion-rates'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/market-data/conversion-rates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        throw error;
      }
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000, // Consider data fresh for 4 minutes
    retry: 2,
    retryDelay: 2000
  });

  // Use real exchange rates or fallback to static rates
  const conversionRates = conversionData?.data || {
    'USD': 1,           // Base currency
    'EUR': 0.92,        // Euro
    'GBP': 0.79,        // British Pound
    'JPY': 149.50,      // Japanese Yen
    'CAD': 1.36,        // Canadian Dollar
    'AUD': 1.52,        // Australian Dollar
    'CHF': 0.88,        // Swiss Franc
    'CNY': 7.24,        // Chinese Yuan
    'INR': 83.25,       // Indian Rupee
    'KRW': 1310,        // South Korean Won
    'BRL': 5.95,        // Brazilian Real
    'MXN': 17.15,       // Mexican Peso
    'RUB': 92.50,       // Russian Ruble
    'SGD': 1.34,        // Singapore Dollar
    'HKD': 7.83,        // Hong Kong Dollar
    'NOK': 10.95,       // Norwegian Krone
    'SEK': 10.85,       // Swedish Krona
    'DKK': 6.87,        // Danish Krone
    'PLN': 4.05,        // Polish Zloty
    'CZK': 22.85,       // Czech Koruna
    'HUF': 360,         // Hungarian Forint
    'RON': 4.58,        // Romanian Leu
    'BGN': 1.80,        // Bulgarian Lev
    'TRY': 29.45,       // Turkish Lira
    'ZAR': 18.75,       // South African Rand
    'EGP': 30.85,       // Egyptian Pound
    'MAD': 10.15,       // Moroccan Dirham
    'NGN': 775,         // Nigerian Naira
    'KES': 155,         // Kenyan Shilling
    'UGX': 3750,        // Ugandan Shilling
    'AED': 3.67,        // UAE Dirham
    'SAR': 3.75,        // Saudi Riyal
    'QAR': 3.64,        // Qatari Riyal
    'KWD': 0.31,        // Kuwaiti Dinar
    'BHD': 0.377,       // Bahraini Dinar
    'OMR': 0.385,       // Omani Rial
    'ILS': 3.65,        // Israeli Shekel
    'PKR': 278,         // Pakistani Rupee
    'BDT': 119,         // Bangladeshi Taka
    'VND': 24350,       // Vietnamese Dong
    'THB': 35.25,       // Thai Baht
    'MYR': 4.65,        // Malaysian Ringgit
    'IDR': 15850,       // Indonesian Rupiah
    'PHP': 55.75,       // Philippine Peso
    'TWD': 31.85,       // Taiwan Dollar
    'MOP': 8.08,        // Macanese Pataca
    'NZD': 1.68         // New Zealand Dollar
  };

  // Convert USD amounts to selected currency with real-time rates
  const convertToSelectedCurrency = React.useCallback((usdAmount: number): string => {
    if (!usdAmount || usdAmount === 0) return '0.00';
    
    // Use real-time exchange rates from API
    const currentRates = conversionData?.data || conversionRates;
    const rate = currentRates[selectedCurrency];
    
    if (!rate) {
      console.warn(`No conversion rate found for ${selectedCurrency}, using USD`);
      return usdAmount.toFixed(2);
    }
    
    const convertedAmount = usdAmount * rate;

    // Format based on currency - currencies with no decimal places
    if (['JPY', 'KRW', 'VND', 'IDR', 'UGX', 'HUF', 'NGN', 'KES'].includes(selectedCurrency)) {
      return Math.round(convertedAmount).toLocaleString();
    } 
    // Currencies with 3 decimal places
    else if (['KWD', 'BHD', 'OMR'].includes(selectedCurrency)) {
      return convertedAmount.toFixed(3);
    }
    // Most currencies with 2 decimal places
    else {
      return convertedAmount.toFixed(2);
    }
  }, [selectedCurrency, conversionData, conversionRates]);

  // Get currency symbol - returns empty string to show only numbers
  const getCurrencySymbol = (currency: string): string => {
    return '';
  };

  // Fetch notification count
  const { data: notificationData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => apiRequest('/api/notifications/unread-count'),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const handleDepositClick = () => {
    setDepositModalOpen(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setDepositModalOpen(false);

    if (method === 'crypto') {
      setCurrentView('crypto-selection');
    } else if (method === 'buy-usd') {
      setComingSoonFeature('Buy with USD');
      setComingSoonOpen(true);
    } else if (method === 'p2p') {
      setComingSoonFeature('P2P Trading');
      setComingSoonOpen(true);
    }
  };

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    setCurrentView('network-selection');
  };

  const handleChainSelect = (chain: string) => {
    setSelectedChain(chain);
    setCurrentView('address-display');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCrypto('');
    setSelectedChain('');
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    // Save to localStorage for persistence
    localStorage.setItem('selectedCurrency', currency);
    setCurrentView('home');
    
    // Force refresh exchange rates to get latest data for new currency
    queryClient.invalidateQueries({ queryKey: ['/api/market-data/conversion-rates'] });
    
    // Trigger force refresh of exchange rates from server
    fetch('/api/market-data/conversion-rates/refresh', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log(`Exchange rates refreshed for ${currency}:`, data.source);
          // Invalidate queries to refresh UI with new rates
          queryClient.invalidateQueries({ queryKey: ['/api/market-data/conversion-rates'] });
        }
      })
      .catch(error => console.error('Failed to refresh exchange rates:', error));
  };

  const quickActions = [
    { name: t('earn'), icon: Gift, color: 'text-orange-500', href: '/mobile/earn' },
    { name: t('invite_friends'), icon: Users, color: 'text-orange-500', href: '/mobile/invite-friends' }
  ];

  // Load favorites from localStorage
  const [favoriteCoins, setFavoriteCoins] = useState<string[]>([]);
  const [activeWatchlistTab, setActiveWatchlistTab] = useState('Hot');

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCoins');
    if (savedFavorites) {
      setFavoriteCoins(JSON.parse(savedFavorites));
    }
  }, []);

  // Fetch live market data from CoinGecko API with real-time updates
  const { data: marketData } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    queryFn: async () => {
      const response = await fetch('/api/crypto/realtime-prices');
      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchInterval: 3000, // Refresh every 3 seconds for real-time BTC price
    retry: 3,
    staleTime: 1000, // Consider data stale after 1 second for real-time feel
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Process market data from CoinGecko API
  const processedMarkets = React.useMemo(() => {
    if (!marketData?.data || !Array.isArray(marketData.data)) {
      return [];
    }

    return marketData.data.map((ticker: any) => {
      const baseSymbol = ticker.symbol.replace('USDT', '').replace('USDC', '').replace('USD', '');
      const price = ticker.price;
      const change = ticker.change;
      const volume = parseFloat(ticker.turnover24h);

      return {
        symbol: baseSymbol, // Just the base symbol like BTC, ETH
        pair: ticker.symbol, // Full trading pair like BTCUSDT, ETHUSDT
        displayPair: `${baseSymbol}/USDT`, // Display format like BTC/USDT
        price: price >= 1 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : price.toFixed(8),
        priceValue: price,
        change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        changeValue: change,
        isPositive: change >= 0,
        volume: volume >= 1e9 ? `$${(volume / 1e9).toFixed(2)}B` : volume >= 1e6 ? `$${(volume / 1e6).toFixed(2)}M` : volume >= 1e3 ? `$${(volume / 1e3).toFixed(2)}K` : `$${volume.toFixed(2)}`,
        volumeValue: volume,
        sentiment: change > 5 ? 'Bullish' : change < -5 ? 'Bearish' : 'Neutral',
        favorite: favoriteCoins.includes(ticker.symbol)
      };
    });
  }, [marketData, favoriteCoins]);

  // Get filtered markets based on active tab
  const getWatchlistMarkets = () => {
    let filtered = processedMarkets;

    switch (activeWatchlistTab) {
      case 'Favorites':
        return filtered.filter(market => market.favorite);
      case 'Gainers':
        return filtered
          .filter(market => market.changeValue > 0)
          .sort((a, b) => b.changeValue - a.changeValue)
          .slice(0, 5);
      case 'Losers':
        return filtered
          .filter(market => market.changeValue < 0)
          .sort((a, b) => a.changeValue - b.changeValue)
          .slice(0, 5);
      case 'Hot':
        return filtered.sort((a, b) => b.volumeValue - a.volumeValue).slice(0, 5);
      case 'New':
        return filtered.sort((a, b) => Math.abs(b.changeValue) - Math.abs(a.changeValue)).slice(0, 5);
      case 'Turnover':
        return filtered.sort((a, b) => b.volumeValue - a.volumeValue).slice(0, 5);
      default:
        return filtered.sort((a, b) => b.volumeValue - a.volumeValue).slice(0, 5);
    }
  };

  const watchlistMarkets = getWatchlistMarkets();
  const marketTabs = [
    { key: 'Favorites', label: t('favorites') },
    { key: 'Hot', label: t('hot') },
    { key: 'New', label: t('new') },
    { key: 'Gainers', label: t('gainers') },
    { key: 'Losers', label: t('losers') },
    { key: 'Turnover', label: t('turnover') }
  ];

  // Get BTC price for USD to BTC conversion from real CoinGecko data
  const getBTCPrice = () => {
    if (!marketData?.data || !Array.isArray(marketData.data)) return 0;
    const btcTicker = marketData.data.find((ticker: any) => ticker.symbol === 'BTC');
    const price = btcTicker ? parseFloat(btcTicker.price) : 0;
    console.log('🏠 Real-time BTC Price from CoinGecko:', { btcTicker, price, marketData });
    return price || 0; // Return 0 if no real data available
  };

  // Get user's USD balance
  const getUserUSDBalance = () => {
    return walletData?.data?.usdBalance || 0;
  };

  // Convert USD to BTC
  const convertUSDToBTC = (usdAmount: number) => {
    const btcPrice = getBTCPrice();
    if (btcPrice === 0) return 0;
    return usdAmount / btcPrice;
  };

  const handleHelperClick = () => {
    if (!showHelperTooltip) {
      setShowHelperTooltip(true);
      setTimeout(() => {
        setShowHelperTooltip(false);
      }, 3000);
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    let socket: WebSocket;
    
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected for real-time home page updates');
        socket.send(JSON.stringify({ type: 'subscribe_notifications' }));
        socket.send(JSON.stringify({ type: 'subscribe_prices' }));
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Real-time home update received:', data);
          
          if (data.type === 'DEPOSIT_CREATED' || data.type === 'TRANSFER_CREATED' || data.type === 'notification_update' || data.type === 'kyc_status_update' || data.type === 'CONNECTION_REQUEST_CREATED' || data.type === 'CONNECTION_REQUEST_RESPONDED') {
            // Update notification badge and balance data instantly
            queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] });
            queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] });
            queryClient.invalidateQueries({ queryKey: ['/api/balances'] });
            
            if (data.type === 'kyc_status_update') {
              // Also refresh verification status for verification banner
              queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
            }
            
            console.log('Home page data refreshed due to real-time update:', data.type);
          } else if (data.type === 'PRICE_UPDATE') {
            // Real-time price updates for BTC and other currencies
            queryClient.setQueryData(['/api/crypto/realtime-prices'], data.data);
            console.log('🏠 Real-time price update received:', data.data);
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };
    
    if (user) {
      connectWebSocket();
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, queryClient]);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/crypto/realtime-prices'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/balances'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/favorites'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread-count'] })
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };



  // Show different views based on current state
  if (currentView === 'crypto-selection') {
    return (
      <CryptoSelection
        onBack={handleBackToHome}
        onSelectCrypto={handleCryptoSelect}
        onComingSoon={(feature: string) => {
          setComingSoonFeature(feature);
          setComingSoonOpen(true);
        }}
      />
    );
  }

  if (currentView === 'network-selection') {
    return (
      <NetworkSelection
        selectedCrypto={selectedCrypto}
        onBack={() => setCurrentView('crypto-selection')}
        onSelectChain={handleChainSelect}
      />
    );
  }

  if (currentView === 'address-display') {
    return (
      <AddressDisplay
        selectedCrypto={selectedCrypto}
        selectedChain={selectedChain}
        onBack={() => setCurrentView('network-selection')}
      />
    );
  }

  if (currentView === 'currency-selection') {
    return (
      <CurrencySelection
        onSelectCurrency={handleCurrencySelect}
        currentCurrency={selectedCurrency}
      />
    );
  }

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <MobileLayout>
        <div className={`flex items-center justify-center min-h-screen ${getBackgroundClass()}`}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your account...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const handleQRScan = () => {
    // Check if device has camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          // Create a simple QR scanner modal
          const scannerModal = document.createElement('div');
          scannerModal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
          scannerModal.innerHTML = `
            <div class="relative w-full max-w-sm mx-4">
              <video id="qr-video" class="w-full rounded-lg" autoplay></video>
              <div class="absolute inset-0 border-2 border-orange-500 rounded-lg pointer-events-none">
                <div class="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-orange-500"></div>
                <div class="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-orange-500"></div>
                <div class="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-orange-500"></div>
                <div class="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-orange-500"></div>
              </div>
              <button id="close-scanner" class="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">×</button>
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                ${t('point_camera_qr')}
              </div>
            </div>
          `;

          document.body.appendChild(scannerModal);
          const video = document.getElementById('qr-video') as HTMLVideoElement;
          const closeBtn = document.getElementById('close-scanner');

          video.srcObject = stream;

          closeBtn?.addEventListener('click', () => {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(scannerModal);
          });

          // Auto-close after 30 seconds
          setTimeout(() => {
            if (document.body.contains(scannerModal)) {
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(scannerModal);
            }
          }, 30000);
        })
        .catch((error) => {
          alert(t('camera_access_denied'));
          console.error('Camera error:', error);
        });
    } else {
      alert(t('qr_scanner_not_supported'));
    }
  };

  return (
    <MobileLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Verification Banner - Only show for unverified users who haven't submitted KYC */}
        {user && !kycLoading && kycStatus && (
          kycStatus.data?.kycStatus === 'none' || kycStatus.data?.kycStatus === 'rejected'
        ) && (
          <VerificationBanner 
            userName={user.firstName || user.username || 'User'}
            onVerifyClick={() => navigate('/mobile/verification')}
            questionsCompleted={kycStatus?.data?.kycData?.sourceOfIncome ? true : false}
            kycStatus={kycStatus?.data?.kycStatus || 'none'}
          />
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <div className="flex items-center space-x-3">
          <div 
            onClick={(e) => {
              e.preventDefault();
              handleProfileDebugTap();
              navigate('/mobile/profile');
            }}
            className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
          >
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-gray-300" />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <UserMessageBox className="flex-shrink-0" />
          <div className="relative">
            <div onClick={handleHelperClick}>
              <Link href="/mobile/chatbot">
                <Headphones className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </Link>
            </div>
            {showHelperTooltip && (
              <div className="absolute top-8 -right-2 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg z-50 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div className="absolute -top-1 right-4 w-2 h-2 bg-orange-500 rotate-45"></div>
{t('welcome_helper').replace('Welcome!', `${t('welcome')} ${user?.firstName || user?.username || 'User'}!`)}
              </div>
            )}
          </div>
          <Link href="/mobile/notifications">
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
              {notificationCount?.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">
                    {notificationCount.unreadCount > 9 ? '9+' : notificationCount.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="BDXN/USDT"
            className="pl-10 bg-blue-900 border-blue-700 text-white placeholder-gray-400"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <button onClick={handleQRScan} className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center">
              <QrCode className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">{t('total_balance')}</span>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          <Button 
            onClick={handleDepositClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
{t('deposit')}
          </Button>
        </div>

        <div className="mb-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white">
              {showBalance ? (
                user ? `${getCurrencySymbol(selectedCurrency)}${parseFloat(convertToSelectedCurrency(getUserUSDBalance())).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${getCurrencySymbol(selectedCurrency)}0.00`
              ) : '****'}
            </span>
            <button 
              onClick={() => setCurrentView('currency-selection')}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              <span>{selectedCurrency}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <span>≈ {showBalance ? 
              (user ? convertUSDToBTC(getUserUSDBalance()).toFixed(8) : '0.00000000') : 
              '********'
            } BTC</span>
          </div>
        </div>



        {/* Promotional Banner */}
        <Card 
          className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 p-4 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowEligibilityModal(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-orange-500" />
              <span className="text-white">{t('apply_now')}</span>
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="flex flex-col items-center space-y-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-xs text-gray-300 text-center">{action.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="px-4">
        <h3 className="text-lg font-semibold text-white mb-4">{t('watchlist')}</h3>

        <div className="flex space-x-4 mb-4 overflow-x-auto scrollbar-hide">
          {marketTabs.map((tab) => (
            <button 
              key={tab.key}
              onClick={() => setActiveWatchlistTab(tab.key)}
              className={`whitespace-nowrap pb-2 transition-colors ${
                activeWatchlistTab === tab.key 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex space-x-4 mb-4">
          <button className="text-orange-500 border-b-2 border-orange-500 pb-2 font-medium">
            {t('spot')}
          </button>
          <button className="text-gray-400 pb-2">
            {t('derivatives')}
          </button>
        </div>

        {/* Live Market Data List */}
        <div className="space-y-4">
          {watchlistMarkets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {activeWatchlistTab === 'Favorites' ? t('no_favorites_selected') : t('loading_market_data')}
              </p>
            </div>
          ) : (
            watchlistMarkets.map((market, index) => (
              <div
                key={`${market.pair}-${index}`}
                onClick={() => {
                  // Store the trading pair symbol for trade page
                  const tradingSymbol = market.pair; // This should be like BTCUSDT, ETHUSDT, etc.
                  const tradingViewSymbol = `BINANCE:${tradingSymbol}`;
                  
                  // Update persistent chart state
                  const chartState = {
                    currentSymbol: tradingSymbol,
                    tradingViewSymbol: tradingViewSymbol,
                    timeframe: '15m',
                    lastUpdated: Date.now(),
                    isChartMounted: false
                  };
                  localStorage.setItem('nedaxer_chart_state', JSON.stringify(chartState));
                  
                  // Store in sessionStorage for immediate navigation
                  sessionStorage.setItem('selectedSymbol', tradingSymbol);
                  sessionStorage.setItem('selectedTab', 'Charts');
                  sessionStorage.setItem('tradingViewSymbol', tradingViewSymbol);
                  
                  console.log('Home page: Saved chart state and navigating to trade with symbol:', tradingSymbol);
                  
                  // Navigate to trade page
                  navigate('/mobile/trade');
                }}
                className="flex items-center justify-between py-3 px-2 hover:bg-blue-900/30 rounded transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {market.favorite && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{market.displayPair}</span>
                      <span className="text-gray-400 text-xs">{t('vol')}: {market.volume}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    ${market.price}
                  </div>
                  <div className={`text-sm flex items-center justify-end space-x-1 ${
                    market.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {market.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-medium">{market.change}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
      />

        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={comingSoonOpen}
          onClose={() => setComingSoonOpen(false)}
          feature={comingSoonFeature}
        />

        {/* Eligibility Modal */}
        <EligibilityModal
          isOpen={showEligibilityModal}
          onClose={() => setShowEligibilityModal(false)}
        />
      </PullToRefresh>

      {/* Debug Panel - Shows when profile is tapped 5 times */}
      {showDebugPanel && (
        <BannerDebugPanel onClose={() => setShowDebugPanel(false)} />
      )}
    </MobileLayout>
  );
}