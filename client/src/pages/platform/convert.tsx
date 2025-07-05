import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, ArrowUpDown, Clock, TrendingUp, Calculator, Zap } from 'lucide-react';

interface ConversionRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  fee: number;
  minAmount: number;
  maxAmount: number;
}

interface ConversionHistory {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export default function ConvertAssets() {
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const queryClient = useQueryClient();

  // Available currencies for conversion
  const availableCurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.5423 },
    { symbol: 'ETH', name: 'Ethereum', balance: 4.2156 },
    { symbol: 'USDT', name: 'Tether', balance: 2500.00 },
    { symbol: 'USDC', name: 'USD Coin', balance: 1000.00 },
    { symbol: 'BNB', name: 'BNB', balance: 12.5678 },
    { symbol: 'SOL', name: 'Solana', balance: 85.67 },
    { symbol: 'ADA', name: 'Cardano', balance: 2500.00 },
    { symbol: 'DOT', name: 'Polkadot', balance: 125.43 },
    { symbol: 'AVAX', name: 'Avalanche', balance: 45.23 },
    { symbol: 'MATIC', name: 'Polygon', balance: 850.00 }
  ];

  // Mock conversion rates (in real app, these would come from API)
  const conversionRates: ConversionRate[] = [
    { fromCurrency: 'BTC', toCurrency: 'ETH', rate: 16.32, fee: 0.001, minAmount: 0.001, maxAmount: 10 },
    { fromCurrency: 'ETH', toCurrency: 'BTC', rate: 0.0613, fee: 0.001, minAmount: 0.01, maxAmount: 100 },
    { fromCurrency: 'BTC', toCurrency: 'USDT', rate: 43250, fee: 0.001, minAmount: 0.001, maxAmount: 10 },
    { fromCurrency: 'USDT', toCurrency: 'BTC', rate: 0.00002312, fee: 0.001, minAmount: 10, maxAmount: 500000 },
    { fromCurrency: 'ETH', toCurrency: 'USDT', rate: 2650, fee: 0.001, minAmount: 0.01, maxAmount: 100 },
    { fromCurrency: 'USDT', toCurrency: 'ETH', rate: 0.000377, fee: 0.001, minAmount: 10, maxAmount: 500000 }
  ];

  // Mock conversion history
  const conversionHistory: ConversionHistory[] = [
    {
      id: '1',
      fromCurrency: 'BTC',
      toCurrency: 'ETH',
      fromAmount: 0.1,
      toAmount: 1.632,
      rate: 16.32,
      fee: 0.0001,
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      fromCurrency: 'ETH',
      toCurrency: 'USDT',
      fromAmount: 2.0,
      toAmount: 5298.0,
      rate: 2649,
      fee: 0.002,
      status: 'completed',
      timestamp: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      fromCurrency: 'USDT',
      toCurrency: 'BTC',
      fromAmount: 5000,
      toAmount: 0.1156,
      rate: 0.00002312,
      fee: 5.0,
      status: 'pending',
      timestamp: '2024-01-15T08:45:00Z'
    }
  ];

  const getCurrentRate = () => {
    const rate = conversionRates.find(r => 
      r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
    );
    return rate || { rate: 0, fee: 0.001, minAmount: 0, maxAmount: 1000000 };
  };

  const currentRate = getCurrentRate();
  const fromBalance = availableCurrencies.find(c => c.symbol === fromCurrency)?.balance || 0;

  useEffect(() => {
    if (fromAmount && currentRate.rate > 0) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const amount = parseFloat(fromAmount);
        const converted = amount * currentRate.rate * (1 - currentRate.fee);
        setToAmount(converted.toFixed(8));
        setIsCalculating(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency, currentRate]);

  const swapCurrencies = () => {
    const tempFrom = fromCurrency;
    const tempFromAmount = fromAmount;
    setFromCurrency(toCurrency);
    setToCurrency(tempFrom);
    setFromAmount(toAmount);
    setToAmount(tempFromAmount);
  };

  const handleConvert = async () => {
    if (!fromAmount || !toAmount) return;
    
    try {
      // In real implementation, this would call the conversion API
      console.log('Converting:', {
        from: fromCurrency,
        to: toCurrency,
        amount: fromAmount,
        expectedReceive: toAmount
      });
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  const setMaxAmount = () => {
    setFromAmount(fromBalance.toString());
  };

  const setPercentageAmount = (percentage: number) => {
    const amount = (fromBalance * percentage / 100).toFixed(8);
    setFromAmount(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-2">
            <RefreshCw className="h-8 w-8 text-[#0033a0]" />
            <span>Convert Assets</span>
          </h1>
          <p className="text-gray-600">Exchange your cryptocurrencies instantly with zero trading fees</p>
        </div>

        {/* Conversion Interface */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Asset Conversion</span>
              <Badge className="bg-green-100 text-green-800">0% Trading Fee</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">From</label>
              <div className="flex space-x-3">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map(currency => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        {currency.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="text-lg font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Balance: {fromBalance} {fromCurrency}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setPercentageAmount(25)}
                  >
                    25%
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setPercentageAmount(50)}
                  >
                    50%
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setPercentageAmount(75)}
                  >
                    75%
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={setMaxAmount}
                  >
                    Max
                  </Button>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapCurrencies}
                className="rounded-full p-2"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">To</label>
              <div className="flex space-x-3">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map(currency => (
                      <SelectItem key={currency.symbol} value={currency.symbol}>
                        {currency.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={isCalculating ? 'Calculating...' : toAmount}
                    readOnly
                    className="text-lg font-mono bg-gray-50"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Balance: {availableCurrencies.find(c => c.symbol === toCurrency)?.balance || 0} {toCurrency}
              </div>
            </div>

            {/* Rate Information */}
            {currentRate.rate > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exchange Rate:</span>
                  <span className="font-mono">1 {fromCurrency} = {currentRate.rate.toFixed(8)} {toCurrency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Fee:</span>
                  <span className="font-mono">{(currentRate.fee * 100).toFixed(2)}%</span>
                </div>
                {fromAmount && toAmount && (
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">You'll Receive:</span>
                    <span className="font-mono font-medium">{toAmount} {toCurrency}</span>
                  </div>
                )}
              </div>
            )}

            {/* Convert Button */}
            <Button
              className="w-full"
              onClick={handleConvert}
              disabled={!fromAmount || !toAmount || parseFloat(fromAmount) > fromBalance || parseFloat(fromAmount) < currentRate.minAmount}
            >
              <Zap className="h-4 w-4 mr-2" />
              Convert {fromCurrency} to {toCurrency}
            </Button>

            {/* Limits */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Minimum conversion: {currentRate.minAmount} {fromCurrency}</p>
              <p>• Maximum conversion: {currentRate.maxAmount} {fromCurrency}</p>
              <p>• Conversions are processed instantly</p>
            </div>
          </CardContent>
        </Card>

        {/* Popular Conversions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Popular Conversions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { from: 'BTC', to: 'ETH', rate: '16.32' },
                { from: 'ETH', to: 'USDT', rate: '2,650' },
                { from: 'BTC', to: 'USDT', rate: '43,250' },
                { from: 'USDT', to: 'BNB', rate: '0.00317' },
                { from: 'SOL', to: 'USDT', rate: '98.50' },
                { from: 'ADA', to: 'USDT', rate: '0.45' }
              ].map((conversion, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setFromCurrency(conversion.from);
                    setToCurrency(conversion.to);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{conversion.from}</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{conversion.to}</span>
                    </div>
                    <span className="text-sm font-mono">{conversion.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Conversion History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionHistory.map((conversion) => (
                <div key={conversion.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{conversion.fromAmount} {conversion.fromCurrency}</span>
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{conversion.toAmount} {conversion.toCurrency}</span>
                        <Badge variant={conversion.status === 'completed' ? 'default' : conversion.status === 'pending' ? 'secondary' : 'destructive'}>
                          {conversion.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        Rate: 1 {conversion.fromCurrency} = {conversion.rate} {conversion.toCurrency} • 
                        Fee: {(conversion.fee * 100).toFixed(3)}%
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(conversion.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}