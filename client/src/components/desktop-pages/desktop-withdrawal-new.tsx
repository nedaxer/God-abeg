import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { showSuccessBanner, showErrorBanner } from '@/hooks/use-bottom-banner';
import { 
  ArrowLeft, 
  Wallet, 
  DollarSign, 
  Send, 
  AlertCircle,
  CheckCircle2,
  Bitcoin,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  Info,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

// Import crypto logo component
import CryptoLogo from '@/components/crypto-logo';

interface CryptoNetwork {
  networkId: string;
  networkName: string;
  chainType: string;
  minWithdrawal: number;
}

interface CryptoOption {
  symbol: string;
  name: string;
  networks: CryptoNetwork[];
}

const cryptoOptions: CryptoOption[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    networks: [
      {
        networkId: 'bitcoin',
        networkName: 'Bitcoin Network',
        chainType: 'Bitcoin',
        minWithdrawal: 0.00027
      }
    ]
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    networks: [
      {
        networkId: 'erc20',
        networkName: 'Ethereum (ERC20)',
        chainType: 'ERC20',
        minWithdrawal: 0.01
      }
    ]
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    networks: [
      {
        networkId: 'erc20',
        networkName: 'Ethereum (ERC20)',
        chainType: 'ERC20',
        minWithdrawal: 10
      },
      {
        networkId: 'trc20',
        networkName: 'TRON (TRC20)',
        chainType: 'TRC20',
        minWithdrawal: 1
      },
      {
        networkId: 'bep20',
        networkName: 'BNB Smart Chain (BEP20)',
        chainType: 'BEP20',
        minWithdrawal: 1
      }
    ]
  }
];

export default function DesktopWithdrawal() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork | null>(null);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cryptoAmount, setCryptoAmount] = useState('');

  // Disable WebSocket for now to fix connection issues
  // useEffect(() => {
  //   // WebSocket disabled to prevent constant reconnection issues
  // }, [queryClient]);

  // Fetch user balance with real-time updates
  const { data: walletData } = useQuery({
    queryKey: ['/api/wallet/summary'],
    enabled: !!user,
    refetchInterval: 5000,
    staleTime: 3000,
  });

  // Fetch withdrawal eligibility with real-time updates
  const { data: withdrawalEligibility } = useQuery({
    queryKey: ['/api/withdrawals/eligibility'],
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 25000,
  });

  // Fetch crypto prices for conversion with real-time updates
  const { data: cryptoPrices } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    refetchInterval: 5000,
    staleTime: 3000,
  });

  // Withdrawal mutation
  const withdrawalMutation = useMutation({
    mutationFn: async (data: {
      cryptoSymbol: string;
      cryptoName: string;
      chainType: string;
      networkName: string;
      withdrawalAddress: string;
      usdAmount: number;
      cryptoAmount: number;
    }) => {
      const response = await apiRequest('/api/withdrawals/create', {
        method: 'POST',
        data: data
      });
      return response;
    },
    onSuccess: (data) => {
      showSuccessBanner(
        'Withdrawal Submitted',
        'Your withdrawal request has been submitted successfully'
      );
      
      // Reset form
      setWithdrawalAmount('');
      setSelectedCrypto(null);
      setSelectedNetwork(null);
      setWithdrawalAddress('');
      setErrors({});
      
      // Refresh balances
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/summary'] });
      queryClient.invalidateQueries({ queryKey: ['/api/balances'] });
    },
    onError: (error: any) => {
      showErrorBanner(
        'Withdrawal Failed',
        error.message || 'An error occurred during withdrawal'
      );
    }
  });

  // Calculate crypto amount when USD amount or crypto selection changes
  useEffect(() => {
    if (withdrawalAmount && selectedCrypto && cryptoPrices?.data) {
      const price = getCryptoPrice(selectedCrypto.symbol);
      if (price > 0) {
        const amount = parseFloat(withdrawalAmount) / price;
        setCryptoAmount(amount.toFixed(8));
      } else {
        setCryptoAmount('');
      }
    } else {
      setCryptoAmount('');
    }
  }, [withdrawalAmount, selectedCrypto, cryptoPrices]);

  const handleWithdrawal = () => {
    const newErrors: { [key: string]: string } = {};

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!selectedCrypto) {
      newErrors.crypto = 'Please select a cryptocurrency';
    }

    if (!selectedNetwork) {
      newErrors.network = 'Please select a network';
    }

    if (!withdrawalAddress.trim()) {
      newErrors.address = 'Please enter a withdrawal address';
    }

    const balance = getUserUSDBalance();
    if (parseFloat(withdrawalAmount) > balance) {
      newErrors.amount = `Insufficient balance. Available: $${balance.toFixed(2)}`;
    }

    // Check crypto amount calculation
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      newErrors.cryptoAmount = 'Unable to calculate crypto amount. Please check the exchange rate.';
    }

    // Check minimum withdrawal amount
    if (selectedNetwork && cryptoAmount && parseFloat(cryptoAmount) < selectedNetwork.minWithdrawal) {
      newErrors.cryptoAmount = `Minimum withdrawal: ${selectedNetwork.minWithdrawal} ${selectedCrypto?.symbol}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorBanner(
        'Validation Error',
        'Please fix the errors and try again'
      );
      return;
    }

    // Check withdrawal eligibility
    if (withdrawalEligibility && !withdrawalEligibility.data?.canWithdraw) {
      showErrorBanner(
        'Withdrawal Not Available',
        withdrawalEligibility.data?.message || 'Withdrawals are not available for your account'
      );
      return;
    }

    const usdAmount = parseFloat(withdrawalAmount);
    const cryptoAmt = parseFloat(cryptoAmount);
    
    withdrawalMutation.mutate({
      cryptoSymbol: selectedCrypto!.symbol,
      cryptoName: selectedCrypto!.name,
      chainType: selectedNetwork!.chainType,
      networkName: selectedNetwork!.networkName,
      withdrawalAddress: withdrawalAddress.trim(),
      usdAmount: usdAmount,
      cryptoAmount: cryptoAmt,
    });
  };

  const getUserUSDBalance = () => {
    return walletData?.data?.totalUSDValue || walletData?.data?.usdBalance || 0;
  };

  const setMaxAmount = () => {
    const balance = getUserUSDBalance();
    setWithdrawalAmount(balance.toString());
  };

  const getCryptoPrice = (symbol: string) => {
    if (!cryptoPrices?.data || !Array.isArray(cryptoPrices.data)) return 0;
    const coin = cryptoPrices.data.find(c => c.symbol === symbol);
    return coin?.price || 0;
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#0a0a2e' }}>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/mobile/assets')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Assets
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Crypto Withdrawal</h1>
                <p className="text-gray-400">Withdraw your USD balance as cryptocurrency</p>
              </div>
            </div>
            

          </div>
          
          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Wallet className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Available Balance</p>
                    <p className="text-2xl font-bold text-white">
                      ${getUserUSDBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Crypto Prices</p>
                    <p className="text-lg font-semibold text-white">Live Updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Security</p>
                    <p className="text-lg font-semibold text-white">Bank-Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Withdrawal Interface */}
        <div className="grid grid-cols-1 gap-8">
          {/* Withdrawal Form Panel */}
          <Card className="bg-black/30 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center">
                <Send className="w-5 h-5 mr-2 text-orange-500" />
                Withdrawal Details
              </CardTitle>
              <p className="text-sm text-gray-400">Enter withdrawal amount and destination details</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Crypto Selection Dropdown */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Select Cryptocurrency</Label>
                <Select
                  value={selectedCrypto?.symbol || ''}
                  onValueChange={(value) => {
                    const crypto = cryptoOptions.find(c => c.symbol === value);
                    setSelectedCrypto(crypto || null);
                    setSelectedNetwork(null);
                  }}
                >
                  <SelectTrigger className="h-12 bg-black/20 border-gray-700/50 text-white focus:border-orange-500">
                    <SelectValue placeholder="Choose cryptocurrency to receive">
                      {selectedCrypto && (
                        <div className="flex items-center space-x-2">
                          <CryptoLogo symbol={selectedCrypto.symbol} size={20} />
                          <span>{selectedCrypto.name} ({selectedCrypto.symbol})</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {cryptoOptions.map((crypto) => (
                      <SelectItem 
                        key={crypto.symbol} 
                        value={crypto.symbol}
                        className="text-white hover:bg-gray-800"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <CryptoLogo symbol={crypto.symbol} size={24} />
                          <div className="flex-1">
                            <span className="font-medium">{crypto.name}</span>
                            <span className="text-gray-400 text-sm"> ({crypto.symbol})</span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            ${getCryptoPrice(crypto.symbol).toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.crypto && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.crypto}
                  </p>
                )}
              </div>

              {/* Amount Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-white font-medium">Amount (USD)</Label>
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="pl-12 h-12 bg-black/20 border-gray-700/50 text-white placeholder-gray-400 text-lg font-semibold focus:border-orange-500 focus:ring-orange-500/20"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={setMaxAmount}
                      className="h-12 px-6 border-gray-700/50 text-gray-400 hover:text-white hover:bg-orange-500/10 hover:border-orange-500"
                    >
                      Max
                    </Button>
                  </div>
                  {errors.amount && (
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.amount}
                    </p>
                  )}
                  <div className="text-sm text-gray-400">
                    Available: ${getUserUSDBalance().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Crypto Amount Display */}
                {selectedCrypto && cryptoAmount && (
                  <div className="space-y-3">
                    <Label className="text-white font-medium">You will receive</Label>
                    <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-xl border border-green-500/30">
                      <div className="flex items-center space-x-3">
                        <CryptoLogo symbol={selectedCrypto.symbol} size={32} />
                        <div>
                          <p className="text-green-400 text-lg font-bold">
                            {cryptoAmount} {selectedCrypto.symbol}
                          </p>
                          <p className="text-gray-400 text-sm">
                            ≈ ${parseFloat(withdrawalAmount || '0').toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Network Selection */}
              {selectedCrypto && (
                <div className="space-y-3">
                  <Label className="text-white font-medium">Network</Label>
                  <Select
                    value={selectedNetwork?.networkId || ''}
                    onValueChange={(value) => {
                      const network = selectedCrypto.networks.find(n => n.networkId === value);
                      setSelectedNetwork(network || null);
                    }}
                  >
                    <SelectTrigger className="h-12 bg-black/20 border-gray-700/50 text-white focus:border-orange-500">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {selectedCrypto.networks.map((network) => (
                        <SelectItem 
                          key={network.networkId} 
                          value={network.networkId}
                          className="text-white hover:bg-gray-800"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{network.networkName}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              Min: {network.minWithdrawal} {selectedCrypto.symbol}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.network && (
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.network}
                    </p>
                  )}
                </div>
              )}

              {/* Withdrawal Address */}
              <div className="space-y-3">
                <Label className="text-white font-medium">Withdrawal Address</Label>
                <Input
                  type="text"
                  placeholder="Enter your wallet address"
                  value={withdrawalAddress}
                  onChange={(e) => setWithdrawalAddress(e.target.value)}
                  className="h-12 bg-black/20 border-gray-700/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
                />
                {errors.address && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.address}
                  </p>
                )}
                <p className="text-gray-400 text-xs flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Double-check your address. Withdrawals cannot be reversed.
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-300 font-medium text-sm">Security Notice</p>
                    <p className="text-gray-300 text-xs mt-1">
                      All withdrawals are processed securely with bank-level encryption. 
                      Processing time: 15-30 minutes for most networks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Withdrawal Button */}
              <Button
                onClick={handleWithdrawal}
                disabled={!selectedCrypto || !selectedNetwork || !withdrawalAmount || !withdrawalAddress || withdrawalMutation.isPending}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {withdrawalMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing Withdrawal...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Submit Withdrawal</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Withdrawal Summary & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/30 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Withdrawal Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">USD Amount</span>
                  <span className="text-white font-semibold text-lg">
                    ${withdrawalAmount || '0.00'}
                  </span>
                </div>
                {selectedCrypto && cryptoAmount && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Crypto Amount</span>
                    <span className="text-green-400 font-semibold">
                      {cryptoAmount} {selectedCrypto.symbol}
                    </span>
                  </div>
                )}
                {selectedNetwork && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white font-medium">
                      {selectedNetwork.chainType}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-green-400 font-medium">Included</span>
                </div>
                <Separator className="bg-gray-700/50" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Processing Time</span>
                  <span className="text-blue-400 font-medium">15-30 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-medium text-sm mb-2">Withdrawal Process</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Transactions verified in real-time</li>
                      <li>• Multiple security checks applied</li>
                      <li>• Network fees included in processing</li>
                      <li>• Confirmation sent via email</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-orange-300 font-medium text-sm mb-2">Security Notice</p>
                    <p className="text-gray-300 text-sm">
                      Double-check your withdrawal address. Cryptocurrency transactions 
                      cannot be reversed once confirmed on the blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}