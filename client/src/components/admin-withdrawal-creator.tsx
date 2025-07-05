import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Minus, DollarSign, RefreshCw } from 'lucide-react';

interface ChainInfo {
  name: string;
  network: string;
  fee: string;
  time: string;
}

interface Crypto {
  symbol: string;
  name: string;
  chains: ChainInfo[];
}

const cryptocurrencies: Crypto[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    chains: [
      { name: 'ERC20', network: 'Ethereum Network', fee: '~15 USDT', time: '5-15 min' },
      { name: 'TRC20', network: 'TRON Network', fee: '~1 USDT', time: '1-3 min' },
      { name: 'BSC', network: 'BNB Smart Chain', fee: '~0.5 USDT', time: '1-3 min' },
    ],
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    chains: [
      { name: 'Bitcoin', network: 'Bitcoin Network', fee: '~0.0005 BTC', time: '30-60 min' },
    ],
  },
];

interface AdminWithdrawalCreatorProps {
  userId: string;
  username: string;
  onSuccess?: () => void;
}

export default function AdminWithdrawalCreator({ userId, username, onSuccess }: AdminWithdrawalCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainInfo | null>(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: number }>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real-time crypto prices
  const { data: priceData, refetch: refetchPrices } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 0, // Always consider data stale to ensure fresh prices
    queryFn: async () => {
      const response = await fetch('/api/crypto/realtime-prices');
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (priceData && (priceData as any).success && (priceData as any).data && Array.isArray((priceData as any).data)) {
      const prices: { [key: string]: number } = {};
      (priceData as any).data.forEach((crypto: any) => {
        if (crypto.symbol && crypto.price) {
          prices[crypto.symbol.toUpperCase()] = crypto.price;
        }
      });
      setCryptoPrices(prices);
      console.log('Prices updated:', prices);
    }
  }, [priceData]);

  const createWithdrawal = useMutation({
    mutationFn: async (data: {
      userId: string;
      cryptoSymbol: string;
      cryptoName: string;
      chainType: string;
      networkName: string;
      withdrawalAddress: string;
      usdAmount: number;
      cryptoPrice: number;
    }) => {
      const response = await fetch('/api/admin/withdrawals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || 'Failed to create withdrawal');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Withdrawal Created",
        description: data.message || "Withdrawal processed successfully",
      });
      
      // Reset form
      setSelectedCrypto(null);
      setSelectedChain(null);
      setUsdAmount('');
      setWithdrawalAddress('');
      setIsOpen(false);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/withdrawals/history"] });
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCrypto || !selectedChain || !usdAmount || !withdrawalAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const cryptoPrice = cryptoPrices[selectedCrypto.symbol];
    if (!cryptoPrice) {
      toast({
        title: "Error",
        description: "Unable to get current price for " + selectedCrypto.symbol,
        variant: "destructive",
      });
      return;
    }

    createWithdrawal.mutate({
      userId,
      cryptoSymbol: selectedCrypto.symbol,
      cryptoName: selectedCrypto.name,
      chainType: selectedChain.name,
      networkName: selectedChain.network,
      withdrawalAddress,
      usdAmount: parseFloat(usdAmount),
      cryptoPrice,
    });
  };

  const getCurrentPrice = (symbol: string) => {
    return cryptoPrices[symbol] || 0;
  };

  const getCryptoAmount = () => {
    if (!selectedCrypto || !usdAmount) return 0;
    const price = getCurrentPrice(selectedCrypto.symbol);
    if (price === 0) return 0;
    return parseFloat(usdAmount) / price;
  };

  return (
    <Card className="bg-white/10 backdrop-blur border-white/20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-xl font-medium mb-1">Create Withdrawal Transaction</h3>
            <p className="text-gray-300 text-sm">Selected User: {username}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Minus className="w-4 h-4 mr-2" />
                Create Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create Withdrawal Transaction</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Process a cryptocurrency withdrawal for {username}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Crypto Selection */}
                <div className="space-y-2">
                  <Label className="text-white">Cryptocurrency</Label>
                  <Select value={selectedCrypto?.symbol || ''} onValueChange={(value) => {
                    const crypto = cryptocurrencies.find(c => c.symbol === value);
                    setSelectedCrypto(crypto || null);
                    setSelectedChain(null);
                  }}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {cryptocurrencies.map((crypto) => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                          <div className="flex items-center justify-between w-full">
                            <span>{crypto.name} ({crypto.symbol})</span>
                            <span className="ml-4 text-green-400">
                              ${getCurrentPrice(crypto.symbol).toFixed(2)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chain Selection */}
                {selectedCrypto && (
                  <div className="space-y-2">
                    <Label className="text-white">Network</Label>
                    <Select value={selectedChain?.name || ''} onValueChange={(value) => {
                      const chain = selectedCrypto.chains.find(c => c.name === value);
                      setSelectedChain(chain || null);
                    }}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {selectedCrypto.chains.map((chain) => (
                          <SelectItem key={chain.name} value={chain.name} className="text-white">
                            <div className="flex flex-col">
                              <span>{chain.name} - {chain.network}</span>
                              <span className="text-xs text-gray-400">
                                Fee: {chain.fee} • Time: {chain.time}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* USD Amount */}
                <div className="space-y-2">
                  <Label className="text-white">USD Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      step="0.01"
                      value={usdAmount}
                      onChange={(e) => setUsdAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-10 bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  {selectedCrypto && usdAmount && (
                    <p className="text-sm text-gray-400">
                      ≈ {getCryptoAmount().toFixed(8)} {selectedCrypto.symbol}
                    </p>
                  )}
                </div>

                {/* Withdrawal Address */}
                <div className="space-y-2">
                  <Label className="text-white">Withdrawal Address</Label>
                  <Input
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    placeholder="Enter withdrawal address"
                    className="bg-slate-800 border-slate-600 text-white"
                    required
                  />
                </div>

                {/* Price Update */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Prices updated every 30 seconds
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => refetchPrices()}
                    className="border-slate-600 text-white hover:bg-slate-800"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Update Prices
                  </Button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={createWithdrawal.isPending}
                >
                  {createWithdrawal.isPending ? 'Creating...' : 'Create Withdrawal'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="text-center py-8">
          <Minus className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">
            Create a withdrawal transaction for this user. Funds will be deducted from their account and a notification will be sent.
          </p>
          <div className="text-sm text-gray-400">
            <p>• Supports BTC (Bitcoin Network) and USDT (ERC-20, TRC-20, BEP-20)</p>
            <p>• Real-time pricing with CoinGecko API</p>
            <p>• Instant notification and balance updates</p>
          </div>
        </div>
      </div>
    </Card>
  );
}