import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  ArrowUpDown,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  change7d: number;
  marketCap: number;
  volume: number;
  rank: number;
  high24h: number;
  low24h: number;
  lastUpdated: string;
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    price_btc: number;
  };
}

interface GlobalMarketData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

export function RealTimeMarketDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof MarketData>("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [favoriteCoins, setFavoriteCoins] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteCoins');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Fetch market data with auto-refresh
  const { data: marketData, isLoading: marketLoading, refetch: refetchMarket } = useQuery({
    queryKey: ['/api/markets'],
    queryFn: async () => {
      const response = await fetch('/api/markets?limit=50');
      if (!response.ok) throw new Error('Failed to fetch market data');
      return response.json() as Promise<MarketData[]>;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch trending coins
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/trending'],
    queryFn: async () => {
      const response = await fetch('/api/trending');
      if (!response.ok) throw new Error('Failed to fetch trending data');
      return response.json() as Promise<TrendingCoin[]>;
    },
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Fetch global market data
  const { data: globalData, isLoading: globalLoading } = useQuery({
    queryKey: ['/api/global'],
    queryFn: async () => {
      const response = await fetch('/api/global');
      if (!response.ok) throw new Error('Failed to fetch global data');
      return response.json() as Promise<GlobalMarketData>;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
  }, [favoriteCoins]);

  const toggleFavorite = (coinId: string) => {
    setFavoriteCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const handleSort = (column: keyof MarketData) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedData = marketData
    ?.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return sortDirection === "asc" 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const PriceChangeCell = ({ change }: { change: number }) => (
    <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      <span className="font-medium">
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </span>
    </div>
  );

  const SortableHeader = ({ column, children }: { column: keyof MarketData; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3 text-gray-400" />
      </div>
    </TableHead>
  );

  if (marketLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#0033a0] mx-auto mb-2" />
            <p className="text-gray-600">Loading real-time market data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Market Stats */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Market Cap</p>
                  <p className="text-lg font-bold text-[#0033a0]">
                    {formatMarketCap(globalData.total_market_cap.usd)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-[#ff5900]" />
              </div>
              <div className="mt-2">
                <PriceChangeCell change={globalData.market_cap_change_percentage_24h_usd} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">24h Volume</p>
                  <p className="text-lg font-bold text-[#0033a0]">
                    {formatVolume(globalData.total_volume.usd)}
                  </p>
                </div>
                <Volume2 className="h-8 w-8 text-[#ff5900]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">BTC Dominance</p>
                  <p className="text-lg font-bold text-[#0033a0]">
                    {globalData.market_cap_percentage.btc.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <Progress value={globalData.market_cap_percentage.btc} className="w-16 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ETH Dominance</p>
                  <p className="text-lg font-bold text-[#0033a0]">
                    {globalData.market_cap_percentage.eth.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <Progress value={globalData.market_cap_percentage.eth} className="w-16 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Market Data */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-[#0033a0] flex items-center gap-2">
                Live Cryptocurrency Prices
                <Badge variant="outline" className="text-xs">
                  Real-time
                </Badge>
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Updated every 30 seconds with live market data
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchMarket()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0033a0]">
                All Coins
              </TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0033a0]">
                Favorites ({favoriteCoins.length})
              </TabsTrigger>
              <TabsTrigger value="trending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0033a0]">
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <SortableHeader column="rank">#</SortableHeader>
                      <SortableHeader column="name">Name</SortableHeader>
                      <SortableHeader column="price">Price</SortableHeader>
                      <SortableHeader column="change">24h %</SortableHeader>
                      <SortableHeader column="change7d">7d %</SortableHeader>
                      <SortableHeader column="marketCap">Market Cap</SortableHeader>
                      <SortableHeader column="volume">Volume (24h)</SortableHeader>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedData?.map((coin) => (
                      <TableRow key={coin.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(coin.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Star 
                              className={`h-3 w-3 ${
                                favoriteCoins.includes(coin.id) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-400'
                              }`} 
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{coin.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">{coin.symbol.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {formatPrice(coin.price)}
                        </TableCell>
                        <TableCell>
                          <PriceChangeCell change={coin.change} />
                        </TableCell>
                        <TableCell>
                          <PriceChangeCell change={coin.change7d} />
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatMarketCap(coin.marketCap)}
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatVolume(coin.volume)}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <div className="p-4">
                {favoriteCoins.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No favorite coins selected</p>
                    <p className="text-sm text-gray-500">Click the star icon next to any coin to add it to favorites</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>24h %</TableHead>
                          <TableHead>Market Cap</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedData
                          ?.filter(coin => favoriteCoins.includes(coin.id))
                          ?.map((coin) => (
                            <TableRow key={coin.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">{coin.symbol.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{coin.name}</div>
                                    <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono font-medium">
                                {formatPrice(coin.price)}
                              </TableCell>
                              <TableCell>
                                <PriceChangeCell change={coin.change} />
                              </TableCell>
                              <TableCell className="font-mono">
                                {formatMarketCap(coin.marketCap)}
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <div className="p-4">
                {trendingLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#0033a0]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingData?.slice(0, 9).map((trending, index) => (
                      <Card key={trending.item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <span className="font-medium">{trending.item.name}</span>
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-sm text-gray-600">
                            {trending.item.symbol.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Rank #{trending.item.market_cap_rank}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}