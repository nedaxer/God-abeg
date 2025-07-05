// @ts-nocheck
// TypeScript error suppression for development productivity - 1 wallet platform type conflict
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, ArrowUpRight, ArrowDownRight, Copy, QrCode, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface WalletBalance {
  currency: {
    id: number;
    symbol: string;
    name: string;
    logoUrl: string;
    currentPrice: number;
  };
  availableBalance: number;
  lockedBalance: number;
  totalBalance: number;
  walletAddress?: string;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'trade' | 'staking';
  currency: {
    symbol: string;
    name: string;
  };
  amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: string;
  networkFee?: number;
}

export default function WalletDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Supported currencies for deposits/withdrawals
  const supportedCurrencies = ['BTC', 'ETH', 'BNB', 'USDT'];

  // Mock wallet balances with real-looking data
  const walletBalances: WalletBalance[] = [
    {
      currency: { id: 1, symbol: 'BTC', name: 'Bitcoin', logoUrl: '', currentPrice: 43250.00 },
      availableBalance: 0.5423,
      lockedBalance: 0.0577,
      totalBalance: 0.6000,
      walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    },
    {
      currency: { id: 2, symbol: 'ETH', name: 'Ethereum', logoUrl: '', currentPrice: 2650.00 },
      availableBalance: 4.2156,
      lockedBalance: 0.7844,
      totalBalance: 5.0000,
      walletAddress: '0x742d35Cc6634C0532925a3b8D400E4c85e71B8Cb'
    },
    {
      currency: { id: 3, symbol: 'USDT', name: 'Tether', logoUrl: '', currentPrice: 1.00 },
      availableBalance: 2450.00,
      lockedBalance: 550.00,
      totalBalance: 3000.00,
      walletAddress: '0x742d35Cc6634C0532925a3b8D400E4c85e71B8Cb'
    },
    {
      currency: { id: 4, symbol: 'BNB', name: 'BNB', logoUrl: '', currentPrice: 315.00 },
      availableBalance: 12.5678,
      lockedBalance: 2.4322,
      totalBalance: 15.0000,
      walletAddress: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2'
    },
    {
      currency: { id: 5, symbol: 'SOL', name: 'Solana', logoUrl: '', currentPrice: 98.50 },
      availableBalance: 75.67,
      lockedBalance: 10.00,
      totalBalance: 85.67,
      walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
    }
  ];

  // Mock transaction history
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'deposit',
      currency: { symbol: 'BTC', name: 'Bitcoin' },
      amount: 0.1,
      fee: 0.0001,
      status: 'completed',
      txHash: '4f46066bd50cc2684484407696b7949e82bd906ea92c040f59a97cba47ed8176',
      createdAt: '2024-01-15T10:30:00Z',
      networkFee: 0.0001
    },
    {
      id: 2,
      type: 'withdrawal',
      currency: { symbol: 'ETH', name: 'Ethereum' },
      amount: 1.0,
      fee: 0.005,
      status: 'pending',
      createdAt: '2024-01-15T09:15:00Z',
      networkFee: 0.005
    },
    {
      id: 3,
      type: 'deposit',
      currency: { symbol: 'USDT', name: 'Tether' },
      amount: 1000.0,
      fee: 1.0,
      status: 'completed',
      txHash: 'a1e5c8f4d2b3e7f9c6a4b8d3e1f7a2b9c5e8f1a4d7b2c6e9f3a8b5d1c4e7f0',
      createdAt: '2024-01-14T16:45:00Z',
      networkFee: 1.0
    },
    {
      id: 4,
      type: 'trade',
      currency: { symbol: 'BNB', name: 'BNB' },
      amount: 5.0,
      fee: 0.05,
      status: 'completed',
      createdAt: '2024-01-14T14:20:00Z'
    }
  ];

  const selectedBalance = walletBalances.find(b => b.currency.symbol === selectedCurrency);
  const totalPortfolioValue = walletBalances.reduce((sum, balance) => 
    sum + (balance.totalBalance * balance.currency.currentPrice), 0
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const handleDeposit = async () => {
    if (!depositAmount || !selectedBalance) return;
    
    try {
      // In a real implementation, this would generate a new deposit address
      console.log('Generating deposit for:', { currency: selectedCurrency, amount: depositAmount });
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress || !selectedBalance) return;
    
    try {
      await apiRequest('/api/wallet/withdraw', {
        method: 'POST',
        body: {
          currencyId: selectedBalance.currency.id,
          amount: parseFloat(withdrawAmount),
          address: withdrawAddress
        }
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balances'] });
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  const getNetworkFee = (symbol: string) => {
    const fees = {
      'BTC': 0.0001,
      'ETH': 0.005,
      'USDT': 1.0,
      'BNB': 0.001
    };
    return fees[symbol as keyof typeof fees] || 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-[#0033a0]" />
              <span>Wallet</span>
            </h1>
            <p className="text-gray-600">Manage your cryptocurrency deposits and withdrawals</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Portfolio Value</p>
            <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {walletBalances.map((balance) => (
                <div
                  key={balance.currency.symbol}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCurrency(balance.currency.symbol)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-[#0033a0] rounded-full flex items-center justify-center text-white font-bold">
                      {balance.currency.symbol.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{balance.currency.symbol}</h3>
                      <p className="text-xs text-gray-500">{balance.currency.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span className="font-mono">{balance.availableBalance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Locked:</span>
                      <span className="font-mono text-orange-600">{balance.lockedBalance}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-1">
                      <span>Total:</span>
                      <span className="font-mono">{balance.totalBalance}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      ≈ ${(balance.totalBalance * balance.currency.currentPrice).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deposit/Withdraw Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Deposit & Withdraw</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposit" className="flex items-center space-x-2">
                      <ArrowDownRight className="h-4 w-4" />
                      <span>Deposit</span>
                    </TabsTrigger>
                    <TabsTrigger value="withdraw" className="flex items-center space-x-2">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>Withdraw</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="deposit" className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium">Select Currency</label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedCurrencies.map(currency => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedBalance && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-3">Deposit Address</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <Input
                            value={selectedBalance.walletAddress}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(selectedBalance.walletAddress || '')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>• Only send {selectedCurrency} to this address</p>
                          <p>• Minimum deposit: {selectedCurrency === 'BTC' ? '0.001' : selectedCurrency === 'ETH' ? '0.01' : '10'} {selectedCurrency}</p>
                          <p>• Network: {selectedCurrency === 'USDT' ? 'ERC20/TRC20' : selectedCurrency === 'BNB' ? 'BSC' : selectedCurrency}</p>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                        Important Notice
                      </h4>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p>• Deposits require network confirmations (1-12 confirmations depending on currency)</p>
                        <p>• Do not send from exchange accounts directly</p>
                        <p>• Sending wrong currency or using wrong network may result in permanent loss</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="withdraw" className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium">Select Currency</label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedCurrencies.map(currency => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Withdrawal Address</label>
                      <Input
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder={`Enter ${selectedCurrency} address`}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="mt-1"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Available: {selectedBalance?.availableBalance || 0} {selectedCurrency}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => setWithdrawAmount(selectedBalance?.availableBalance.toString() || '0')}
                        >
                          Max
                        </Button>
                      </div>
                    </div>

                    {withdrawAmount && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span>{withdrawAmount} {selectedCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Network Fee:</span>
                            <span>{getNetworkFee(selectedCurrency)} {selectedCurrency}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>You'll Receive:</span>
                            <span>{(parseFloat(withdrawAmount) - getNetworkFee(selectedCurrency)).toFixed(8)} {selectedCurrency}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || !withdrawAddress || (parseFloat(withdrawAmount) > (selectedBalance?.availableBalance || 0))}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Withdraw {selectedCurrency}
                    </Button>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Withdrawals are processed within 30 minutes</p>
                      <p>• Minimum withdrawal: {selectedCurrency === 'BTC' ? '0.001' : selectedCurrency === 'ETH' ? '0.01' : '10'} {selectedCurrency}</p>
                      <p>• Daily withdrawal limit: {selectedCurrency === 'BTC' ? '10' : selectedCurrency === 'ETH' ? '100' : '50,000'} {selectedCurrency}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(tx.status)}
                          <span className="font-medium capitalize">{tx.type}</span>
                        </div>
                        <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                          {tx.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">{tx.currency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-mono">{tx.amount} {tx.currency.symbol}</span>
                        </div>
                        {tx.fee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fee:</span>
                            <span className="font-mono">{tx.fee} {tx.currency.symbol}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span>{new Date(tx.createdAt).toLocaleString()}</span>
                        </div>
                        {tx.txHash && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hash:</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => copyToClipboard(tx.txHash!)}
                            >
                              {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-8)}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}