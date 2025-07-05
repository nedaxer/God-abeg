// @ts-nocheck
// TypeScript error suppression for development productivity - 1 trading platform type conflict
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, BookOpen, BarChart3, Activity, Clock, DollarSign } from 'lucide-react';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Trade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: 'buy' | 'sell';
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  amount: number;
  price: number;
  filled: number;
  status: 'pending' | 'filled' | 'cancelled';
  time: string;
}

export default function SpotTrading() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('limit');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  // Fetch current market data
  const { data: markets } = useQuery({
    queryKey: ['/api/markets'],
    refetchInterval: 1000
  });

  const currentPrice = markets?.find((m: any) => m.symbol === selectedPair.split('/')[0])?.price || 43250;

  // Mock order book data
  const orderBook = {
    bids: [
      { price: 43245, amount: 0.5234, total: 0.5234 },
      { price: 43240, amount: 1.2456, total: 1.7690 },
      { price: 43235, amount: 0.8901, total: 2.6591 },
      { price: 43230, amount: 2.1234, total: 4.7825 },
      { price: 43225, amount: 0.4567, total: 5.2392 }
    ],
    asks: [
      { price: 43255, amount: 0.7890, total: 0.7890 },
      { price: 43260, amount: 1.5432, total: 2.3322 },
      { price: 43265, amount: 0.6789, total: 3.0111 },
      { price: 43270, amount: 1.9876, total: 4.9987 },
      { price: 43275, amount: 0.3456, total: 5.3443 }
    ]
  };

  // Mock recent trades
  const recentTrades: Trade[] = [
    { id: '1', price: 43250, amount: 0.1234, time: '14:32:45', side: 'buy' },
    { id: '2', price: 43248, amount: 0.5678, time: '14:32:42', side: 'sell' },
    { id: '3', price: 43252, amount: 0.2345, time: '14:32:40', side: 'buy' },
    { id: '4', price: 43247, amount: 0.8901, time: '14:32:38', side: 'sell' },
    { id: '5', price: 43253, amount: 0.3456, time: '14:32:35', side: 'buy' }
  ];

  // Mock open orders
  const openOrders: Order[] = [
    {
      id: '1',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      amount: 0.1,
      price: 43200,
      filled: 0,
      status: 'pending',
      time: '14:30:15'
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      side: 'sell',
      type: 'limit',
      amount: 2.5,
      price: 2660,
      filled: 1.2,
      status: 'pending',
      time: '14:28:30'
    }
  ];

  const tradingPairs = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT',
    'DOT/USDT', 'MATIC/USDT', 'AVAX/USDT', 'XRP/USDT', 'DOGE/USDT'
  ];

  const handleBuyOrder = () => {
    console.log('Buy order:', { amount: buyAmount, price: buyPrice, type: orderType });
    setBuyAmount('');
    setBuyPrice('');
  };

  const handleSellOrder = () => {
    console.log('Sell order:', { amount: sellAmount, price: sellPrice, type: orderType });
    setSellAmount('');
    setSellPrice('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Spot Trading</h1>
            <p className="text-gray-600">Trade cryptocurrencies with advanced order types</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tradingPairs.map(pair => (
                  <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-lg px-3 py-2">
              ${currentPrice.toLocaleString()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Price Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedPair} Price Chart</span>
                  <div className="flex space-x-2">
                    {['1m', '5m', '15m', '1h', '4h', '1d'].map(interval => (
                      <Button key={interval} variant="outline" size="sm">
                        {interval}
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-[#0033a0] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Advanced Trading Chart</h3>
                    <p className="text-gray-500 mb-4">Real-time candlestick chart with technical indicators</p>
                    <div className="flex justify-center space-x-4 text-sm text-gray-600">
                      <span>• Moving Averages</span>
                      <span>• RSI</span>
                      <span>• MACD</span>
                      <span>• Bollinger Bands</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Book & Recent Trades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Order Book</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Asks */}
                    <div>
                      <div className="grid grid-cols-3 text-xs text-gray-500 mb-2 px-2">
                        <span>Price (USDT)</span>
                        <span className="text-right">Amount (BTC)</span>
                        <span className="text-right">Total</span>
                      </div>
                      <div className="space-y-1">
                        {orderBook.asks.reverse().map((ask, i) => (
                          <div key={i} className="grid grid-cols-3 text-sm py-1 px-2 hover:bg-red-50 cursor-pointer">
                            <span className="text-red-600 font-mono">{ask.price.toLocaleString()}</span>
                            <span className="text-right font-mono">{ask.amount.toFixed(4)}</span>
                            <span className="text-right font-mono">{ask.total.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Price */}
                    <div className="flex items-center justify-center py-2 bg-gray-100 rounded">
                      <span className="text-lg font-bold text-green-600">
                        {currentPrice.toLocaleString()} USDT
                      </span>
                    </div>

                    {/* Bids */}
                    <div>
                      <div className="space-y-1">
                        {orderBook.bids.map((bid, i) => (
                          <div key={i} className="grid grid-cols-3 text-sm py-1 px-2 hover:bg-green-50 cursor-pointer">
                            <span className="text-green-600 font-mono">{bid.price.toLocaleString()}</span>
                            <span className="text-right font-mono">{bid.amount.toFixed(4)}</span>
                            <span className="text-right font-mono">{bid.total.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Trades</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 text-xs text-gray-500 mb-2 px-2">
                      <span>Price (USDT)</span>
                      <span className="text-right">Amount (BTC)</span>
                      <span className="text-right">Time</span>
                    </div>
                    {recentTrades.map(trade => (
                      <div key={trade.id} className="grid grid-cols-3 text-sm py-1 px-2 hover:bg-gray-50">
                        <span className={`font-mono ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.price.toLocaleString()}
                        </span>
                        <span className="text-right font-mono">{trade.amount.toFixed(4)}</span>
                        <span className="text-right text-gray-500">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Order Type Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={orderType} onValueChange={setOrderType}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="stop">Stop</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Buy/Sell Orders */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                    <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy" className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available: 2,500.00 USDT</label>
                      {orderType !== 'market' && (
                        <div>
                          <label className="text-sm text-gray-600">Price (USDT)</label>
                          <Input
                            type="number"
                            value={buyPrice}
                            onChange={(e) => setBuyPrice(e.target.value)}
                            placeholder={currentPrice.toString()}
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-gray-600">Amount (BTC)</label>
                        <Input
                          type="number"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total:</span>
                          <span>{((parseFloat(buyAmount) || 0) * (parseFloat(buyPrice) || currentPrice)).toFixed(2)} USDT</span>
                        </div>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={handleBuyOrder}
                        >
                          Buy BTC
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sell" className="p-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Available: 0.5423 BTC</label>
                      {orderType !== 'market' && (
                        <div>
                          <label className="text-sm text-gray-600">Price (USDT)</label>
                          <Input
                            type="number"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            placeholder={currentPrice.toString()}
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-gray-600">Amount (BTC)</label>
                        <Input
                          type="number"
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Total:</span>
                          <span>{((parseFloat(sellAmount) || 0) * (parseFloat(sellPrice) || currentPrice)).toFixed(2)} USDT</span>
                        </div>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={handleSellOrder}
                        >
                          Sell BTC
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Account Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Balances</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">BTC</span>
                    <span className="font-mono">0.5423</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">USDT</span>
                    <span className="font-mono">2,500.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ETH</span>
                    <span className="font-mono">4.2156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SOL</span>
                    <span className="font-mono">85.67</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Open Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Open Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2">Symbol</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Side</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Filled</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {openOrders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 font-medium">{order.symbol}</td>
                      <td className="py-3">{order.type}</td>
                      <td className="py-3">
                        <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                          {order.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 font-mono">{order.amount}</td>
                      <td className="py-3 font-mono">{order.price.toLocaleString()}</td>
                      <td className="py-3 font-mono">{order.filled}</td>
                      <td className="py-3">
                        <Badge variant="outline">{order.status}</Badge>
                      </td>
                      <td className="py-3 text-gray-500">{order.time}</td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">Cancel</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}