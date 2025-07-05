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
import { Plus, DollarSign, RefreshCw } from 'lucide-react';

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
  {
    symbol: 'ETH',
    name: 'Ethereum',
    chains: [
      { name: 'ETH', network: 'Ethereum Network', fee: '~0.005 ETH', time: '5-15 min' },
      { name: 'ETH (BEP-20)', network: 'BNB Smart Chain', fee: '~0.001 ETH', time: '1-3 min' },
    ],
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    chains: [
      { name: 'BEP-20', network: 'BNB Smart Chain', fee: '~0.001 BNB', time: '1-3 min' },
    ],
  },
];



interface AdminDepositCreatorProps {
  userId: string;
  username: string;
  onSuccess?: () => void;
}

export default function AdminDepositCreator({ userId, username, onSuccess }: AdminDepositCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainInfo | null>(null);
  const [usdAmount, setUsdAmount] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
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
    }
  }, [priceData]);

  const createDepositMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      cryptoSymbol: string;
      cryptoName: string;
      chainType: string;
      networkName: string;
      senderAddress: string;
      usdAmount: number;
      cryptoPrice: number;
    }) => {
      const response = await fetch('/api/admin/deposits/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create deposit');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Deposit Created",
        description: data.message,
        variant: "default",
      });
      setIsOpen(false);
      resetForm();
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/all"] });
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to create deposit",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedCrypto(null);
    setSelectedChain(null);
    setUsdAmount('');
    setSenderAddress('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCrypto || !selectedChain || !usdAmount || !senderAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const usdAmountNum = parseFloat(usdAmount);
    if (isNaN(usdAmountNum) || usdAmountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid USD amount",
        variant: "destructive",
      });
      return;
    }

    const cryptoPrice = cryptoPrices[selectedCrypto.symbol] || 1;

    createDepositMutation.mutate({
      userId,
      cryptoSymbol: selectedCrypto.symbol,
      cryptoName: selectedCrypto.name,
      chainType: selectedChain.name,
      networkName: selectedChain.network,
      senderAddress,
      usdAmount: usdAmountNum,
      cryptoPrice,
    });
  };

  const calculateCryptoAmount = () => {
    if (!selectedCrypto || !usdAmount) return '0';
    const usdAmountNum = parseFloat(usdAmount);
    if (isNaN(usdAmountNum)) return '0';
    const cryptoPrice = cryptoPrices[selectedCrypto.symbol] || 1;
    return (usdAmountNum / cryptoPrice).toFixed(8);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-green-500/30 text-green-400 hover:bg-green-500/20">
          <Plus className="w-4 h-4 mr-1" />
          Create Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>Create Deposit Transaction</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetchPrices()}
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Update Prices
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a deposit transaction for user: <span className="text-white font-medium">{username}</span>
            <br />
            <span className="text-yellow-400 text-sm">Note: This will add funds to user's account and create transaction history</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cryptocurrency Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Cryptocurrency</Label>
            <Select onValueChange={(value) => {
              const crypto = cryptocurrencies.find(c => c.symbol === value);
              setSelectedCrypto(crypto || null);
              setSelectedChain(null);
            }}>
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue placeholder="Choose cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {cryptocurrencies.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-orange-400">{crypto.symbol}</span>
                      <span className="text-gray-400">-</span>
                      <span>{crypto.name}</span>
                      <span className="text-green-400 text-sm font-mono">
                        {cryptoPrices[crypto.symbol] ? 
                          `$${cryptoPrices[crypto.symbol].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6
                          })}` : 
                          '⟳'
                        }
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
              <Label className="text-sm font-medium">Select Network Chain</Label>
              <Select onValueChange={(value) => {
                const chain = selectedCrypto.chains.find(c => c.name === value);
                setSelectedChain(chain || null);
              }}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Choose network chain" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {selectedCrypto.chains.map((chain) => (
                    <SelectItem key={chain.name} value={chain.name}>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-blue-400">{chain.name}</span>
                          <span className="text-gray-400">-</span>
                          <span>{chain.network}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Fee: {chain.fee} • Time: {chain.time}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* USD Amount Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">USD Amount to Send</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Enter USD amount"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
            {selectedCrypto && usdAmount && (
              <div className="text-sm text-gray-400">
                Equivalent: <span className="text-orange-400 font-mono">{calculateCryptoAmount()} {selectedCrypto.symbol}</span>
              </div>
            )}
          </div>

          {/* Sender Address Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sender Address</Label>
            <Input
              type="text"
              placeholder="Enter sender wallet address"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
            />
            <div className="text-xs text-gray-500">
              This address will be shown to the user as the deposit source
            </div>
          </div>

          {/* Summary Card */}
          {selectedCrypto && selectedChain && usdAmount && senderAddress && (
            <Card className="bg-slate-800 border-slate-600 p-4">
              <h4 className="text-sm font-medium text-white mb-3">Transaction Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">User:</span>
                  <span className="text-white">{username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cryptocurrency:</span>
                  <span className="text-orange-400">{selectedCrypto.symbol} ({selectedCrypto.name})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-blue-400">{selectedChain.name} - {selectedChain.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USD Amount:</span>
                  <span className="text-green-400">${parseFloat(usdAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Crypto Amount:</span>
                  <span className="text-orange-400 font-mono">{calculateCryptoAmount()} {selectedCrypto.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sender Address:</span>
                  <span className="text-white font-mono text-xs">{senderAddress.substring(0, 20)}...</span>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-slate-600 text-gray-400 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createDepositMutation.isPending || !selectedCrypto || !selectedChain || !usdAmount || !senderAddress}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createDepositMutation.isPending ? 'Creating...' : 'Send Deposit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}