// @ts-nocheck
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DesktopDepositBanner from './desktop-deposit-banner';
import CryptoLogo from '../crypto-logo';

export default function DesktopAssets() {
  const [showDepositBanner, setShowDepositBanner] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedChain, setSelectedChain] = useState('');

  // Get wallet summary data
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['/api/wallet/summary'],
    refetchInterval: 10000,
    staleTime: 5000,
  });

  // Get real-time crypto prices
  const { data: cryptoPrices } = useQuery({
    queryKey: ['/api/coins'],
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const formatCurrency = (amount: number) => {
    if (hideBalance) return '••••••';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatCrypto = (amount: number, symbol: string) => {
    if (hideBalance) return '••••••';
    return `${amount.toFixed(6)} ${symbol}`;
  };

  const getCryptoPrice = (symbol: string) => {
    if (!cryptoPrices?.data) return { price: 0, change: 0 };

    const crypto = cryptoPrices.data.find((coin: any) => coin.symbol === symbol);
    return {
      price: crypto?.price || 0,
      change: crypto?.change24h || 0
    };
  };

  const holdings = [
    { symbol: 'BTC', amount: 0.00000000, name: 'Bitcoin' },
    { symbol: 'ETH', amount: 0.00000000, name: 'Ethereum' },
    { symbol: 'USDT', amount: 0.00000000, name: 'Tether' },
    { symbol: 'BNB', amount: 0.00000000, name: 'BNB' }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Portfolio Overview */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Portfolio Overview</h2>
                <p className="text-gray-400">Your cryptocurrency holdings and balance</p>
              </div>
              <Button
                onClick={() => setHideBalance(!hideBalance)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                {hideBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a40]/30 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Total Balance</div>
                <div className="text-3xl font-bold text-white">
                  {walletLoading ? '••••••' : formatCurrency(walletData?.data?.totalUSDValue || 10000000)}
                </div>
                <div className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.45% today
                </div>
              </div>

              <div className="bg-[#1a1a40]/30 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Available for Trading</div>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(walletData?.data?.totalUSDValue || 10000000)}
                </div>
                <div className="text-blue-400 text-sm mt-1">Ready to use</div>
              </div>

              <div className="bg-[#1a1a40]/30 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Pending Orders</div>
                <div className="text-xl font-bold text-white">$0.00</div>
                <div className="text-gray-400 text-sm mt-1">No active orders</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer group">
            <div 
              className="p-6 text-center"
              onClick={() => setShowDepositBanner(true)}
            >
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <ArrowDownRight className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Deposit</h3>
              <p className="text-gray-400 text-sm">Add funds to your account</p>
              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white border-0">
                Deposit Funds
              </Button>
            </div>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50 hover:border-red-500/50 transition-all duration-300 cursor-pointer group">
            <div className="p-6 text-center">
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/30 transition-colors">
                <ArrowUpRight className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Withdraw</h3>
              <p className="text-gray-400 text-sm">Send funds to external wallet</p>
              <Button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white border-0">
                Withdraw Funds
              </Button>
            </div>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
            <div className="p-6 text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <ArrowUpRight className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Transfer</h3>
              <p className="text-gray-400 text-sm">Send to other Nedaxer users</p>
              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white border-0">
                Transfer Funds
              </Button>
            </div>
          </Card>
        </div>

        {/* Holdings */}
        <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Your Holdings</h3>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {holdings.length} Assets
              </Badge>
            </div>

            <div className="space-y-4">
              {holdings.map((holding) => {
                const priceData = getCryptoPrice(holding.symbol);
                const isPositive = priceData.change >= 0;
                const usdValue = holding.amount * priceData.price;

                return (
                  <div 
                    key={holding.symbol}
                    className="flex items-center justify-between p-4 bg-[#1a1a40]/30 rounded-xl hover:bg-[#1a1a40]/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <CryptoLogo symbol={holding.symbol} className="w-10 h-10" />
                      <div>
                        <div className="font-bold text-white">{holding.symbol}</div>
                        <div className="text-gray-400 text-sm">{holding.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {formatCrypto(holding.amount, holding.symbol)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatCurrency(usdValue)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-white font-medium">
                          ${priceData.price.toLocaleString()}
                        </div>
                        <div className={`text-sm flex items-center gap-1 ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPositive ? '+' : ''}{priceData.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {holdings.every(h => h.amount === 0) && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-400 mb-2">No Holdings Yet</h4>
                <p className="text-gray-500 mb-6">Start by depositing cryptocurrency to begin trading</p>
                <Button 
                  onClick={() => setShowDepositBanner(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Make Your First Deposit
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/20 backdrop-blur-sm border-gray-700/50">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>

            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8 text-gray-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-400 mb-2">No Recent Activity</h4>
              <p className="text-gray-500 mb-6">Your transaction history will appear here</p>
              <Button 
                onClick={() => setShowDepositBanner(true)}
                variant="outline" 
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-[#1a1a40] hover:text-white"
              >
                Start Trading
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Deposit Banner Modal */}
      <DesktopDepositBanner 
        isOpen={showDepositBanner}
        onClose={() => setShowDepositBanner(false)}
        selectedCrypto={selectedCrypto}
        selectedChain={selectedChain}
        onCryptoSelect={setSelectedCrypto}
        onChainSelect={setSelectedChain}
      />
    </>
  );
}