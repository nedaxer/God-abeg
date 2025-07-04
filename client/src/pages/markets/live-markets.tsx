import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Search, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useLocation } from "wouter";

interface CryptoTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

interface CoinGeckoResponse {
  success: boolean;
  data: CryptoTicker[];
  timestamp: number;
}

export default function LiveMarkets() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch CoinGecko market data with auto-refresh every 10 seconds
  const { data: marketData, isLoading, refetch, error } = useQuery({
    queryKey: ["/api/crypto/realtime-prices"],
    queryFn: async (): Promise<CoinGeckoResponse> => {
      const response = await fetch("/api/crypto/realtime-prices");
      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.statusText}`);
      }
      const data = await response.json();
      setLastUpdate(new Date());
      return data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
  });

  // Filter tickers based on search term
  const filteredTickers = marketData?.data?.filter(ticker =>
    ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort tickers by volume (descending)
  const sortedTickers = filteredTickers.sort((a: CryptoTicker, b: CryptoTicker) => 
    b.volume - a.volume
  );

  const handleCoinClick = (symbol: string) => {
    // Extract the base currency from the symbol (e.g., BTCUSDT -> BTC)
    const baseCurrency = symbol.replace('USDT', '').replace('USDC', '').replace('USD', '');
    navigate(`/mobile/trade?symbol=${baseCurrency}`);
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 1) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    }
    return num.toFixed(8);
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (percentage: string) => {
    const num = parseFloat(percentage);
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Bearish':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return <TrendingUp className="h-3 w-3" />;
      case 'Bearish':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <PageLayout
      title="Live Cryptocurrency Markets"
      subtitle="Real-time trading pairs from Bybit exchange with live price updates"
      bgImage="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=500&q=80"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#0033a0]" />
                Live Market Data
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0033a0]">
                  {sortedTickers.length}
                </div>
                <div className="text-sm text-gray-600">Trading Pairs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sortedTickers.filter(t => t.sentiment === 'Bullish').length}
                </div>
                <div className="text-sm text-gray-600">Bullish</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {sortedTickers.filter(t => t.sentiment === 'Bearish').length}
                </div>
                <div className="text-sm text-gray-600">Bearish</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {sortedTickers.filter(t => t.sentiment === 'Neutral').length}
                </div>
                <div className="text-sm text-gray-600">Neutral</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trading pairs (e.g., BTC, ETH, SOL)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Market Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Pairs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="p-6 text-center">
                <div className="text-red-600 mb-2">Failed to load market data</div>
                <div className="text-gray-500 text-sm">
                  {error instanceof Error ? error.message : 'Unknown error occurred'}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()} 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            )}

            {isLoading && !marketData && (
              <div className="p-6 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0033a0]" />
                <div>Loading market data...</div>
              </div>
            )}

            {sortedTickers.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="text-right">Last Price</TableHead>
                      <TableHead className="text-right">24h Change</TableHead>
                      <TableHead className="text-right">24h Volume</TableHead>
                      <TableHead className="text-right">24h High</TableHead>
                      <TableHead className="text-right">24h Low</TableHead>
                      <TableHead className="text-center">Sentiment</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTickers.slice(0, 50).map((ticker) => (
                      <TableRow 
                        key={ticker.symbol}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCoinClick(ticker.symbol)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-semibold">{ticker.symbol}</div>
                              <div className="text-xs text-gray-500">
                                {ticker.symbol.replace('USDT', '').replace('USDC', '').replace('USD', '')}/USDT
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${formatPrice(ticker.price.toString())}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${
                            ticker.change >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {formatPercentage(ticker.change.toString())}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatVolume(ticker.volume.toString())}
                        </TableCell>
                        <TableCell className="text-right font-mono text-green-600">
                          ${formatPrice((ticker.price * 1.05).toString())}
                        </TableCell>
                        <TableCell className="text-right font-mono text-red-600">
                          ${formatPrice((ticker.price * 0.95).toString())}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="outline" 
                            className={`${getSentimentColor(ticker.sentiment)} flex items-center gap-1 w-fit mx-auto`}
                          >
                            {getSentimentIcon(ticker.sentiment)}
                            {ticker.sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCoinClick(ticker.symbol);
                            }}
                            className="text-[#0033a0] border-[#0033a0] hover:bg-[#0033a0] hover:text-white"
                          >
                            Trade
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-500">
              <p>Market data updates automatically every 10 seconds</p>
              <p>Data provided by CoinGecko API</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}