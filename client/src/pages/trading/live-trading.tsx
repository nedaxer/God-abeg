import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/page-layout";
import { RealTimeMarketDashboard } from "@/components/real-time-market-dashboard";
import { AdvancedTradingChart } from "@/components/advanced-trading-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet,
  BarChart3,
  Activity,
  Zap,
  Target
} from "lucide-react";

export default function LiveTrading() {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  // Fetch market data
  const { data: marketData } = useQuery({
    queryKey: ['/api/markets'],
    refetchInterval: 30000
  });

  // Fetch selected coin data
  const { data: coinData } = useQuery({
    queryKey: [`/api/markets/${selectedCoin}`],
    refetchInterval: 10000
  });

  // Mock user balances
  const userBalances = {
    USD: 10000,
    BTC: 0.25,
    ETH: 2.5,
    BNB: 10,
    XRP: 500
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatBalance = (amount: number, symbol: string) => {
    if (symbol === 'USD') return formatPrice(amount);
    return `${amount.toFixed(4)} ${symbol}`;
  };

  const calculateOrderValue = () => {
    const amountNum = parseFloat(amount);
    const priceNum = orderType === "market" 
      ? ((coinData as any)?.price || 0)
      : parseFloat(price);
    
    if (isNaN(amountNum) || isNaN(priceNum)) return 0;
    return amountNum * priceNum;
  };

  const handlePlaceOrder = () => {
    const orderValue = calculateOrderValue();
    const coinSymbol = (coinData as any)?.symbol || '';
    
    console.log("Placing order:", {
      side,
      orderType,
      coin: selectedCoin,
      amount: parseFloat(amount),
      price: orderType === "limit" ? parseFloat(price) : (coinData as any)?.price,
      value: orderValue
    });
    
    alert(`${side.toUpperCase()} order placed for ${amount} ${coinSymbol} at ${formatPrice(orderValue)}`);
    
    setAmount("");
    setPrice("");
  };

  const topCoins = Array.isArray(marketData) ? marketData.slice(0, 6) : [];

  return (
    <PageLayout
      title="Live Cryptocurrency Trading"
      subtitle="Real-time trading with live market data and advanced charting"
    >
      <div className="space-y-6">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Portfolio Value</p>
                  <p className="text-lg font-bold text-[#0033a0]">$25,847.32</p>
                </div>
                <Wallet className="h-6 w-6 text-[#ff5900]" />
              </div>
              <div className="mt-1">
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% (24h)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-lg font-bold text-[#0033a0]">7</p>
                </div>
                <Target className="h-6 w-6 text-[#ff5900]" />
              </div>
              <div className="mt-1">
                <span className="text-gray-500 text-sm">3 Buy, 4 Sell</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's P&L</p>
                  <p className="text-lg font-bold text-green-600">+$432.18</p>
                </div>
                <Activity className="h-6 w-6 text-[#ff5900]" />
              </div>
              <div className="mt-1">
                <span className="text-green-600 text-sm font-medium">+1.67%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Cash</p>
                  <p className="text-lg font-bold text-[#0033a0]">{formatPrice(userBalances.USD)}</p>
                </div>
                <DollarSign className="h-6 w-6 text-[#ff5900]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Trading Chart */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-[#0033a0]">
                    Advanced Trading Chart
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {topCoins.map((coin: any) => (
                          <SelectItem key={coin.id} value={coin.id}>
                            {coin.symbol} - {coin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline">
                      <Zap className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <AdvancedTradingChart
                  coinId={selectedCoin}
                  coinSymbol={(coinData as any)?.symbol || 'BTC'}
                  coinName={(coinData as any)?.name || 'Bitcoin'}
                />
              </CardContent>
            </Card>
          </div>

          {/* Trading Panel */}
          <div className="space-y-4">
            {/* Current Price */}
            {coinData && (
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">{(coinData as any).symbol.toUpperCase()}</h3>
                    <div className="text-2xl font-bold text-[#0033a0] my-2">
                      {formatPrice((coinData as any).price)}
                    </div>
                    <div className={`flex items-center justify-center gap-1 ${
                      (coinData as any).change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(coinData as any).change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium">
                        {(coinData as any).change >= 0 ? '+' : ''}{(coinData as any).change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Buy/Sell Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={side === "buy" ? "default" : "outline"}
                    onClick={() => setSide("buy")}
                    className={side === "buy" ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600"}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={side === "sell" ? "default" : "outline"}
                    onClick={() => setSide("sell")}
                    className={side === "sell" ? "bg-red-600 hover:bg-red-700" : "border-red-600 text-red-600"}
                  >
                    Sell
                  </Button>
                </div>

                {/* Order Type */}
                <div>
                  <label className="text-sm font-medium">Order Type</label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Order</SelectItem>
                      <SelectItem value="limit">Limit Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-medium">Amount ({(coinData as any)?.symbol.toUpperCase() || 'BTC'})</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.0001"
                  />
                </div>

                {/* Price (for limit orders) */}
                {orderType === "limit" && (
                  <div>
                    <label className="text-sm font-medium">Price (USD)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      step="0.01"
                    />
                  </div>
                )}

                {/* Order Summary */}
                {amount && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Total Value:</span>
                      <span className="font-semibold">{formatPrice(calculateOrderValue())}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Fee (0.1%):</span>
                      <span>{formatPrice(calculateOrderValue() * 0.001)}</span>
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={!amount || (orderType === "limit" && !price)}
                  className={`w-full ${
                    side === "buy" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {side === "buy" ? "Buy" : "Sell"} {(coinData as any)?.symbol.toUpperCase() || 'BTC'}
                </Button>
              </CardContent>
            </Card>

            {/* Account Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(userBalances).map(([symbol, balance]) => (
                    <div key={symbol} className="flex justify-between items-center">
                      <span className="font-medium">{symbol}</span>
                      <span className="text-sm">{formatBalance(balance, symbol)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0033a0] flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Real-Time Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RealTimeMarketDashboard />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}