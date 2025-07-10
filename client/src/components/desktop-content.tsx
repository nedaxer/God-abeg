import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CryptoLogo from './crypto-logo';

import { DepositModal } from './deposit-modal';

// Import desktop page components
import DesktopTransfer from './desktop-pages/desktop-transfer';
import DesktopWithdrawal from './desktop-pages/desktop-withdrawal-new';
import DesktopSettings from './desktop-pages/desktop-settings';
import DesktopVerification from './desktop-pages/desktop-verification';
import DesktopNews from './desktop-pages/desktop-news';
import DesktopAssetsHistory from './desktop-pages/desktop-assets-history';
import DesktopDepositDetails from './desktop-pages/desktop-deposit-details';
import DesktopWithdrawalDetails from './desktop-pages/desktop-withdrawal-details';
import DesktopTransferDetails from './desktop-pages/desktop-transfer-details';

interface DesktopContentProps {
  children: ReactNode;
  page?: 'home' | 'assets' | 'trade' | 'markets' | 'earn' | 'profile' | 'notifications';
}

export default function DesktopContent({ children, page = 'home' }: DesktopContentProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const queryClient = useQueryClient();
  

  
  // Deposit modal state
  const [showDepositModal, setShowDepositModal] = useState(false);





  // Handle deposit method selection
  const handleDepositMethod = (method: string) => {
    setShowDepositModal(false);
    
    if (method === 'crypto') {
      window.location.hash = '#/mobile/deposit';
    } else if (method === 'buy-usd') {
      console.log('Buy USD selected');
    } else if (method === 'p2p') {
      console.log('P2P selected');
    }
  };

  // Get wallet data for overview
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet/summary'],
    staleTime: 10000,
  });

  // Get real-time prices
  const { data: pricesData } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    refetchInterval: 10000,
  });

  const totalBalance = walletData?.data?.totalUSDValue || 0;
  const btcPrice = pricesData?.data?.find((coin: any) => coin.symbol === 'BTC')?.price || 0;
  const ethPrice = pricesData?.data?.find((coin: any) => coin.symbol === 'ETH')?.price || 0;

  // Check if current location should use a specific desktop component
  // Instead of returning the component directly, we render it as content within the desktop layout
  
  if (location === '/mobile/transfer') {
    return (
      <div className="space-y-6">
        <DesktopTransfer />
      </div>
    );
  }
  
  if (location === '/mobile/withdrawal') {
    return (
      <div className="space-y-6">
        <DesktopWithdrawal />
      </div>
    );
  }
  
  if (location === '/mobile/settings') {
    return (
      <div className="space-y-6">
        <DesktopSettings />
      </div>
    );
  }
  
  if (location === '/mobile/verification' || location === '/mobile/kyc-status') {
    return (
      <div className="space-y-6">
        <DesktopVerification />
      </div>
    );
  }
  
  if (location === '/mobile/news') {
    return (
      <div className="space-y-6">
        <DesktopNews />
      </div>
    );
  }
  
  // For assets history page, use dedicated desktop component
  if (location === '/mobile/assets-history') {
    return (
      <div className="space-y-6">
        <DesktopAssetsHistory />
      </div>
    );
  }
  
  // Handle deposit details page for desktop
  if (location.startsWith('/mobile/deposit-details/')) {
    return (
      <div className="space-y-6">
        <DesktopDepositDetails />
      </div>
    );
  }
  
  // Handle withdrawal details page for desktop
  if (location.startsWith('/mobile/withdrawal-details/')) {
    return (
      <div className="space-y-6">
        <DesktopWithdrawalDetails />
      </div>
    );
  }

  // Handle transfer details page for desktop
  if (location.startsWith('/mobile/transfer-details/')) {
    return (
      <div className="space-y-6">
        <DesktopTransferDetails />
      </div>
    );
  }

  // Desktop-specific content wrapper
  if (page === 'home') {
    return (
      <div className="space-y-6">
        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/20 border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-400 text-sm">Total Portfolio</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  $0.00
                </p>
                <p className="text-green-500 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +2.4% today
                </p>
              </div>
              <Wallet className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="bg-black/20 border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bitcoin Price</p>
                <p className="text-2xl font-bold text-white">
                  ${btcPrice.toLocaleString()}
                </p>
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  -0.3% today
                </p>
              </div>
              <CryptoLogo symbol="BTC" size={32} />
            </div>
          </Card>

          <Card className="bg-black/20 border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ethereum Price</p>
                <p className="text-2xl font-bold text-white">
                  ${ethPrice.toLocaleString()}
                </p>
                <p className="text-green-500 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +0.5% today
                </p>
              </div>
              <CryptoLogo symbol="ETH" size={32} />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-black/20 border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Dashboard Overview</h3>
              {children}
            </Card>
          </div>
          
          <div className="space-y-6">


            <Card className="bg-black/20 border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Top Movers</h3>
              <div className="space-y-3">
                {pricesData?.data?.slice(0, 5).map((coin: any) => (
                  <div key={coin.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CryptoLogo symbol={coin.symbol} size={24} />
                      <span className="text-white text-sm">{coin.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white text-sm">${coin.price?.toLocaleString()}</div>
                      <div className={`text-xs ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change >= 0 ? '+' : ''}{coin.change?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Deposit Modal */}
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onSelectMethod={handleDepositMethod}
        />
      </div>
    );
  }

  // For other pages, use a simpler wrapper with page-specific styling
  if (page === 'trade') {
    return (
      <div className="space-y-6 h-full">
        <Card className="bg-black/20 border-gray-700/50 p-6 h-full">
          <div className="h-full flex flex-col">
            {children}
          </div>
        </Card>
      </div>
    );
  }

  // For other pages, use a simpler wrapper
  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-gray-700/50 p-6">
        {children}
      </Card>
    </div>
  );
}