import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Zap, AlertTriangle, Calculator } from 'lucide-react';

interface FuturesPosition {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  leverage: number;
  liquidationPrice: number;
  fundingFee: number;
}

interface FuturesOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'take_profit';
  size: number;
  price?: number;
  stopPrice?: number;
  leverage: number;
  status: 'pending' | 'filled' | 'cancelled';
  time: string;
}

export default function FuturesTrading() {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [orderType, setOrderType] = useState('limit');
  const [leverage, setLeverage] = useState(10);
  const [longSize, setLongSize] = useState('');
  const [longPrice, setLongPrice] = useState('');
  const [shortSize, setShortSize] = useState('');
  const [shortPrice, setShortPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  // Mock current price data
  const currentPrice = 43250;
  const priceChange24h = 2.5;

  // Mock futures positions
  const positions: FuturesPosition[] = [
    {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'long',
      size: 1.5,
      entryPrice: 42800,
      markPrice: 43250,
      pnl: 675,
      pnlPercent: 10.5,
      margin: 6420,
      leverage: 10,
      liquidationPrice: 36652,
      fundingFee: 0.125
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      side: 'short',
      size: 10,
      entryPrice: 2680,
      markPrice: 2650,
      pnl: 300,
      pnlPercent: 5.6,
      margin: 2650,
      leverage: 5,
      liquidationPrice: 3180,
      fundingFee: -0.075
    }
  ];

  // Mock open orders
  const openOrders: FuturesOrder[] = [
    {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'buy',
      type: 'limit',
      size: 0.5,
      price: 42500,
      leverage: 20,
      status: 'pending',
      time: '14:30:15'
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      side: 'sell',
      type: 'stop',
      size: 2.0,
      stopPrice: 2600,
      leverage: 15,
      status: 'pending',
      time: '14:25:30'
    }
  ];

  const futuresPairs = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
    'DOTUSDT', 'MATICUSDT', 'AVAXUSDT', 'XRPUSDT', 'DOGEUSDT'
  ];

  const leverageOptions = [1, 2, 3, 5, 10, 15, 20, 25, 50, 75, 100];

  const calculateMargin = (size: number, price: number, leverage: number) => {
    return (size * price) / leverage;
  };

  const calculateLiquidationPrice = (entryPrice: number, leverage: number, side: 'long' | 'short') => {
    const maintenanceMargin = 0.005; // 0.5% maintenance margin
    if (side === 'long') {
      return entryPrice * (1 - (1 / leverage) + maintenanceMargin);
    } else {
      return entryPrice * (1 + (1 / leverage) - maintenanceMargin);
    }
  };

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalMargin = positions.reduce((sum, pos) => sum + pos.margin, 0);
  const accountBalance = 50000; // Mock account balance
  const availableMargin = accountBalance - totalMargin;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Zap className="h-8 w-8 text-[#0033a0]" />
              <span>Futures Trading</span>
            </h1>
            <p className="text-gray-600">Trade crypto futures with up to 100x leverage</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {futuresPairs.map(pair => (
                  <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-right">
              <p className="text-lg font-bold">${currentPrice.toLocaleString()}</p>
              <p className={`text-sm ${priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange24h >= 0 ? '+' : ''}{priceChange24h}%
              </p>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Account Balance</p>
                  <p className="text-lg font-bold">${accountBalance.toLocaleString()}</p>
                </div>
                <DollarSign className="h-6 w-6 text-[#0033a0]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unrealized PnL</p>
                  <p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
                  </p>
                </div>
                {totalPnL >= 0 ? 
                  <TrendingUp className="h-6 w-6 text-green-600" /> : 
                  <TrendingDown className="h-6 w-6 text-red-600" />
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Used Margin</p>
                  <p className="text-lg font-bold">${totalMargin.toFixed(2)}</p>
                </div>
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Margin</p>
                  <p className="text-lg font-bold">${availableMargin.toFixed(2)}</p>
                </div>
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open Positions</p>
                  <p className="text-lg font-bold">{positions.length}</p>
                </div>
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{selectedPair} Futures Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-[#0033a0] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Advanced Futures Chart</h3>
                    <p className="text-gray-500 mb-4">Real-time price data with leverage indicators</p>
                    <div className="flex justify-center space-x-4 text-sm text-gray-600">
                      <span>• Funding Rate</span>
                      <span>• Open Interest</span>
                      <span>• Long/Short Ratio</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Positions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-2">Symbol</th>
                        <th className="pb-2">Side</th>
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Entry Price</th>
                        <th className="pb-2">Mark Price</th>
                        <th className="pb-2">PnL</th>
                        <th className="pb-2">Margin</th>
                        <th className="pb-2">Leverage</th>
                        <th className="pb-2">Liq. Price</th>
                        <th className="pb-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map(position => (
                        <tr key={position.id} className="border-b">
                          <td className="py-3 font-medium">{position.symbol}</td>
                          <td className="py-3">
                            <Badge variant={position.side === 'long' ? 'default' : 'destructive'}>
                              {position.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 font-mono">{position.size}</td>
                          <td className="py-3 font-mono">${position.entryPrice.toLocaleString()}</td>
                          <td className="py-3 font-mono">${position.markPrice.toLocaleString()}</td>
                          <td className="py-3">
                            <div className={`font-mono ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                              <div className="text-xs">
                                ({position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-mono">${position.margin.toFixed(2)}</td>
                          <td className="py-3">{position.leverage}x</td>
                          <td className="py-3 font-mono text-red-600">${position.liquidationPrice.toLocaleString()}</td>
                          <td className="py-3">
                            <Button variant="outline" size="sm">Close</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Open Orders */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Open Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-2">Symbol</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Side</th>
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Price</th>
                        <th className="pb-2">Leverage</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Time</th>
                        <th className="pb-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openOrders.map(order => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3 font-medium">{order.symbol}</td>
                          <td className="py-3 capitalize">{order.type}</td>
                          <td className="py-3">
                            <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                              {order.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 font-mono">{order.size}</td>
                          <td className="py-3 font-mono">
                            {order.price ? `$${order.price.toLocaleString()}` : 'Market'}
                          </td>
                          <td className="py-3">{order.leverage}x</td>
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

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Leverage Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Leverage: {leverage}x</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    value={[leverage]}
                    onValueChange={(value) => setLeverage(value[0])}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 5, 10, 20, 50, 100].map(lev => (
                      <Button
                        key={lev}
                        variant={leverage === lev ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLeverage(lev)}
                      >
                        {lev}x
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Type */}
            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={orderType} onValueChange={setOrderType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Long/Short Orders */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="long" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="long" className="text-green-600">Long</TabsTrigger>
                    <TabsTrigger value="short" className="text-red-600">Short</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="long" className="p-4 space-y-4">
                    {orderType !== 'market' && (
                      <div>
                        <label className="text-sm text-gray-600">Price (USDT)</label>
                        <Input
                          type="number"
                          value={longPrice}
                          onChange={(e) => setLongPrice(e.target.value)}
                          placeholder={currentPrice.toString()}
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-600">Size (USDT)</label>
                      <Input
                        type="number"
                        value={longSize}
                        onChange={(e) => setLongSize(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    {longSize && (
                      <div className="p-3 bg-green-50 rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Margin Required:</span>
                          <span>${calculateMargin(parseFloat(longSize), parseFloat(longPrice) || currentPrice, leverage).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Contracts:</span>
                          <span>{(parseFloat(longSize) / (parseFloat(longPrice) || currentPrice)).toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Liq. Price:</span>
                          <span className="text-red-600">
                            ${calculateLiquidationPrice(parseFloat(longPrice) || currentPrice, leverage, 'long').toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Stop Loss</label>
                        <Input
                          type="number"
                          value={stopLoss}
                          onChange={(e) => setStopLoss(e.target.value)}
                          placeholder="Optional"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Take Profit</label>
                        <Input
                          type="number"
                          value={takeProfit}
                          onChange={(e) => setTakeProfit(e.target.value)}
                          placeholder="Optional"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Long {selectedPair}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="short" className="p-4 space-y-4">
                    {orderType !== 'market' && (
                      <div>
                        <label className="text-sm text-gray-600">Price (USDT)</label>
                        <Input
                          type="number"
                          value={shortPrice}
                          onChange={(e) => setShortPrice(e.target.value)}
                          placeholder={currentPrice.toString()}
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-600">Size (USDT)</label>
                      <Input
                        type="number"
                        value={shortSize}
                        onChange={(e) => setShortSize(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    {shortSize && (
                      <div className="p-3 bg-red-50 rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Margin Required:</span>
                          <span>${calculateMargin(parseFloat(shortSize), parseFloat(shortPrice) || currentPrice, leverage).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Contracts:</span>
                          <span>{(parseFloat(shortSize) / (parseFloat(shortPrice) || currentPrice)).toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Liq. Price:</span>
                          <span className="text-red-600">
                            ${calculateLiquidationPrice(parseFloat(shortPrice) || currentPrice, leverage, 'short').toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Stop Loss</label>
                        <Input
                          type="number"
                          value={stopLoss}
                          onChange={(e) => setStopLoss(e.target.value)}
                          placeholder="Optional"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Take Profit</label>
                        <Input
                          type="number"
                          value={takeProfit}
                          onChange={(e) => setTakeProfit(e.target.value)}
                          placeholder="Optional"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Short {selectedPair}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Risk Warning */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-700 mb-1">High Risk Warning</p>
                    <p className="text-orange-600">
                      Futures trading involves substantial risk. You may lose your entire investment. 
                      Trade responsibly and never invest more than you can afford to lose.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}