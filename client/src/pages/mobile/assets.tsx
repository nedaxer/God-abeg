import MobileLayout from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DepositModal } from '@/components/deposit-modal';
import { CryptoSelection } from '@/pages/mobile/crypto-selection';
import { NetworkSelection } from '@/pages/mobile/network-selection';
import { AddressDisplay } from '@/pages/mobile/address-display';
import CurrencySelection from '@/pages/mobile/currency-selection';
import { ComingSoonModal } from '@/components/coming-soon-modal';
import { WithdrawalRestrictionModal } from '@/components/withdrawal-restriction-modal';
import { DepositActivationModal } from '@/components/deposit-activation-modal';
import { PullToRefresh } from '@/components/pull-to-refresh';
import { 
  Eye, 
  EyeOff,
  Wallet,
  ArrowUp,
  ArrowDown,
  ArrowDownUp,
  CreditCard,
  ChevronRight,
  ChevronDown,
  X,
  QrCode
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/hooks/use-auth';
import { useWithdrawal } from '@/contexts/withdrawal-context';
import advancedChartsVideo from '@/assets/advanced-charts-video.mp4';

export default function MobileAssets() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { getBackgroundClass, getTextClass, getCardClass, getBorderClass } = useTheme();
  const queryClient = useQueryClient();
  const { withdrawalData, isModalOpen, openModal, closeModal, refreshData } = useWithdrawal();
  const [location, navigate] = useLocation();

  // WebSocket connection for balance updates only (withdrawal handled by context)
  useEffect(() => {
    if (!user) return;

    const userId = (user as any)?._id;
    if (!userId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
      console.log('WebSocket connected for assets page balance updates');
      ws.send(JSON.stringify({ type: 'subscribe_notifications' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle balance updates
        if (data.type === 'balance_update' && data.userId === userId) {
          console.log('Received balance update:', data);
          queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] });
          queryClient.invalidateQueries({ queryKey: ['/api/balances'] });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [user, queryClient]);
  // Persistent balance visibility state
  const [showBalance, setShowBalance] = useState(() => {
    const saved = localStorage.getItem('showBalance');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showPromoCard, setShowPromoCard] = useState(true);
  const [currentView, setCurrentView] = useState('assets'); // 'assets', 'crypto-selection', 'network-selection', 'address-display', 'currency-selection'
  const [activeTab, setActiveTab] = useState('assets'); // Only 'assets' tab now
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

  const [depositActivationOpen, setDepositActivationOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Save balance visibility state to localStorage
  useEffect(() => {
    localStorage.setItem('showBalance', JSON.stringify(showBalance));
  }, [showBalance]);

  // Load currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Fetch user wallet summary for real-time balance
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet/summary'],
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data fresh for 25 seconds
    retry: 2,
  });

  // Fetch real-time price data for BTC conversion
  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data fresh for 25 seconds
    retry: 2,
  });

  // Fetch real-time currency conversion rates from internal API
  const { data: conversionData } = useQuery({
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
    'USD': 1,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 149.50,
    'CAD': 1.36,
    'AUD': 1.52,
    'CHF': 0.88,
    'CNY': 7.24,
    'INR': 83.25,
    'KRW': 1310,
    'BRL': 5.95,
    'MXN': 17.15,
    'RUB': 92.50,
    'SGD': 1.34,
    'HKD': 7.83,
    'NOK': 10.95,
    'SEK': 10.85,
    'DKK': 6.87,
    'PLN': 4.05,
    'CZK': 22.85,
    'HUF': 360,
    'RON': 4.58,
    'BGN': 1.80,
    'TRY': 29.45,
    'ZAR': 18.75,
    'EGP': 30.85,
    'MAD': 10.15,
    'NGN': 775,
    'KES': 155,
    'UGX': 3750,
    'AED': 3.67,
    'SAR': 3.75,
    'QAR': 3.64,
    'KWD': 0.31,
    'BHD': 0.377,
    'OMR': 0.385,
    'ILS': 3.65,
    'PKR': 278,
    'BDT': 119,
    'VND': 24350,
    'THB': 35.25,
    'MYR': 4.65,
    'IDR': 15850,
    'PHP': 55.75,
    'TWD': 31.85,
    'MOP': 8.08,
    'NZD': 1.68
  };

  // Convert USD amounts to selected currency
  const convertToSelectedCurrency = (usdAmount: number): string => {
    const rate = (conversionRates as any)[selectedCurrency] || 1;
    const convertedAmount = usdAmount * rate;

    // Format based on currency
    if (['JPY', 'KRW', 'VND', 'IDR', 'UGX', 'MMK', 'KHR', 'LAK'].includes(selectedCurrency)) {
      return Math.round(convertedAmount).toLocaleString();
    } else {
      return convertedAmount.toFixed(2);
    }
  };

  // Get currency symbol - returns empty string to show only numbers
  const getCurrencySymbol = (currency: string): string => {
    return '';
  };

  // Get BTC price for USD to BTC conversion from real CoinGecko data
  const getBTCPrice = () => {
    if (!(priceData as any)?.data || !Array.isArray((priceData as any).data)) return 0;
    const btcTicker = (priceData as any).data.find((ticker: any) => ticker.symbol === 'BTC');
    const price = btcTicker ? parseFloat(btcTicker.price) : 0;
    console.log('💰 Assets Real-time BTC Price from CoinGecko:', { btcTicker, price, priceData });
    return price || 0; // Return 0 if no real data available
  };

  // Get user's USD balance
  const getUserUSDBalance = () => {
    return (walletData as any)?.data?.usdBalance || 0;
  };





  // Convert USD to BTC
  const convertUSDToBTC = (usdAmount: number) => {
    const btcPrice = getBTCPrice();
    if (btcPrice === 0) return 0;
    return usdAmount / btcPrice;
  };

  const handleDepositClick = () => {
    setDepositModalOpen(true);
  };

  const handleWithdrawClick = () => {
    // Check withdrawal access first
    checkWithdrawalAccess();
  };

  // Fetch withdrawal eligibility
  const { data: withdrawalEligibility } = useQuery({
    queryKey: ['/api/withdrawals/eligibility'],
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 25000,
  });

  const checkWithdrawalAccess = () => {
    const eligibility = (withdrawalEligibility as any)?.data;
    
    if (eligibility?.canWithdraw && eligibility?.hasAccess) {
      // User has withdrawal access, navigate to withdrawal page
      navigate('/mobile/withdrawal');
    } else {
      // Show restriction modal
      openModal();
    }
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

  const handleBackFromCrypto = () => {
    setCurrentView('assets');
  };

  const handleBackFromNetwork = () => {
    setCurrentView('crypto-selection');
  };

  const handleBackFromAddress = () => {
    setCurrentView('network-selection');
  };

  const handleComingSoon = () => {
    setComingSoonFeature('Fiat Deposits');
    setComingSoonOpen(true);
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    setCurrentView('assets');
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/crypto/realtime-prices'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/balances'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/user/withdrawal-restriction'] })
      ]);
      
      // Also refresh withdrawal context data
      if (typeof refreshData === 'function') {
        refreshData();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

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
                Point camera at QR code
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
          alert('Camera access denied or not available');
          console.error('Camera error:', error);
        });
    } else {
      alert('QR scanner not supported on this device');
    }
  };

  // Render full-page components instead of assets page
  if (currentView === 'crypto-selection') {
    return (
      <CryptoSelection
        onBack={handleBackFromCrypto}
        onSelectCrypto={handleCryptoSelect}
        onComingSoon={handleComingSoon}
      />
    );
  }

  if (currentView === 'network-selection') {
    return (
      <NetworkSelection
        onBack={handleBackFromNetwork}
        selectedCrypto={selectedCrypto}
        onSelectChain={handleChainSelect}
      />
    );
  }

  if (currentView === 'address-display') {
    return (
      <AddressDisplay
        onBack={handleBackFromAddress}
        selectedCrypto={selectedCrypto}
        selectedChain={selectedChain}
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

  // Default assets page view
  return (
    <MobileLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <h1 className="text-xl font-bold text-white">My Assets</h1>
        <button onClick={handleQRScan} className="w-8 h-8 bg-[#0b0b30] rounded-lg flex items-center justify-center">
          <QrCode className="w-4 h-4 text-gray-400" />
        </button>
      </div>



      {/* Total Assets */}
      <div className="px-4 pb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-400 text-sm">Total Assets</span>
          <button onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? (
              <Eye className="w-4 h-4 text-gray-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="mb-4">
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

        {/* Advanced Charts Video Background */}
        <div className="relative h-32 bg-blue-950 rounded-lg mb-4 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            style={{ filter: 'brightness(0.8) contrast(1.2)' }}
          >
            <source src={advancedChartsVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/60" />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="text-white">
              <div className="text-sm font-medium opacity-90">Advanced Trading</div>
              <div className="text-xs text-gray-300">Live Market Analysis</div>
            </div>
            <div className="text-right">
              <div className="text-orange-500 text-lg font-bold">+2.4%</div>
              <div className="text-xs text-gray-300">24h Change</div>
            </div>
          </div>
        </div>

        
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-4 gap-4">
          <button onClick={handleDepositClick}>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-blue-900 rounded-lg flex items-center justify-center">
                <Wallet className="w-7 h-7 text-orange-500" />
              </div>
              <span className="text-xs text-gray-300 text-center">Deposit</span>
            </div>
          </button>
          
          <button onClick={handleWithdrawClick}>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-blue-900 rounded-lg flex items-center justify-center">
                <ArrowUp className="w-7 h-7 text-orange-500" />
              </div>
              <span className="text-xs text-gray-300 text-center">Withdraw</span>
            </div>
          </button>
          
          <Link href="/mobile/transfer">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-blue-900 rounded-lg flex items-center justify-center">
                <ArrowDownUp className="w-7 h-7 text-orange-500" />
              </div>
              <span className="text-xs text-gray-300 text-center">Transfer</span>
            </div>
          </Link>
          
          <Link href="/mobile/assets-history">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-blue-900 rounded-lg flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-orange-500" />
              </div>
              <span className="text-xs text-gray-300 text-center">History</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Empty Portfolio State */}
      <div className="px-4">
        <h3 className="text-white font-medium mb-6 text-sm">Portfolio Distribution</h3>
        
        {/* Empty Portfolio Display */}
        <div className="relative flex flex-col items-center mb-8">
          <div className="relative w-80 h-80 mb-6 flex items-center justify-center">
            {/* Empty Circle */}
            <div className="w-64 h-64 border-4 border-dashed border-gray-600 rounded-full flex items-center justify-center">
              <div className="text-center">
                <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <div className="text-lg font-semibold text-gray-400 mb-2">Empty Portfolio</div>
                <div className="text-sm text-gray-500">Your portfolio will appear here once you start trading</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Zero Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-900 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">24h Change</div>
            <div className="text-gray-500 text-lg font-bold">$0.00</div>
          </div>
          <div className="bg-blue-900 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total Profit</div>
            <div className="text-gray-500 text-lg font-bold">$0.00</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
      />

      <ComingSoonModal
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        feature={comingSoonFeature}
      />

      <WithdrawalRestrictionModal
        open={isModalOpen}
        onOpenChange={closeModal}
        withdrawalData={withdrawalData}
        onMakeDeposit={() => setDepositModalOpen(true)}
      />

      <DepositActivationModal
        isOpen={depositActivationOpen}
        onClose={() => setDepositActivationOpen(false)}
        onMakeDeposit={() => setDepositModalOpen(true)}
      />
      </PullToRefresh>
    </MobileLayout>
  );
}