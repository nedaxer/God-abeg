import MobileLayout from '@/components/mobile-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star,
  TrendingUp,
  TrendingDown,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { hapticLight } from '@/lib/haptics';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { CRYPTO_PAIRS, CryptoPair, getPairDisplayName } from '@/lib/crypto-pairs';

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

// Helper functions - defined outside component to avoid initialization issues
const formatPrice = (price: number) => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }
  return price.toFixed(8);
};

const formatVolume = (volume: number) => {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`;
  }
  if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`;
  }
  if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`;
  }
  return `$${volume.toFixed(2)}`;
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Bullish':
      return 'bg-green-600 text-white';
    case 'Bearish':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-600 text-white';
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

export default function MobileMarkets() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { getBackgroundClass, getTextClass, getCardClass, getBorderClass } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteCoins, setFavoriteCoins] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('Hot');
  const [activeMarketType, setActiveMarketType] = useState('Spot');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCoins');
    if (savedFavorites) {
      setFavoriteCoins(JSON.parse(savedFavorites));
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = (symbol: string) => {
    hapticLight();
    const newFavorites = favoriteCoins.includes(symbol)
      ? favoriteCoins.filter(id => id !== symbol)
      : [...favoriteCoins, symbol];
    
    setFavoriteCoins(newFavorites);
    localStorage.setItem('favoriteCoins', JSON.stringify(newFavorites));
  };

  // Fetch live market data from CoinGecko API (10-second auto-refresh)
  const { data: marketData, isLoading, refetch, error } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    queryFn: async (): Promise<CoinGeckoResponse> => {
      const response = await fetch('/api/crypto/realtime-prices');
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

  // Process comprehensive crypto pairs with live price data
  const processedMarkets = CRYPTO_PAIRS.map((pair: CryptoPair) => {
    // Find matching ticker data from API by base asset (e.g., BTC for BTCUSDT)
    const ticker = marketData?.data?.find((t: CryptoTicker) => t.symbol === pair.baseAsset);
    
    if (ticker) {
      const price = ticker.price;
      const change = ticker.change;
      const volume = ticker.volume;
      const marketCap = ticker.marketCap;
      
      // Determine sentiment based on price change
      let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
      if (change > 2) sentiment = 'Bullish';
      else if (change < -2) sentiment = 'Bearish';
      
      return {
        symbol: pair.baseAsset,
        pair: pair.symbol,
        displayPair: getPairDisplayName(pair),
        price: formatPrice(price),
        priceValue: price,
        change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        changeValue: change,
        isPositive: change >= 0,
        volume: formatVolume(volume),
        volumeValue: volume,
        high24h: '--',
        low24h: '--',
        sentiment: sentiment,
        favorite: favoriteCoins.includes(pair.symbol),
        cryptoPair: pair
      };
    } else {
      // Return pair with placeholder data for pairs not in live data
      return {
        symbol: pair.baseAsset,
        pair: pair.symbol,
        displayPair: getPairDisplayName(pair),
        price: '0.00',
        priceValue: 0,
        change: '0.00%',
        changeValue: 0,
        isPositive: true,
        volume: '$0',
        volumeValue: 0,
        high24h: '--',
        low24h: '--',
        sentiment: 'Neutral' as const,
        favorite: favoriteCoins.includes(pair.symbol),
        cryptoPair: pair
      };
    }
  });

  // Filter markets based on search query
  const searchFilteredMarkets = processedMarkets.filter(market =>
    market.displayPair.toLowerCase().includes(searchQuery.toLowerCase()) ||
    market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter markets based on active tab
  const getFilteredMarkets = () => {
    let filtered = searchFilteredMarkets;
    
    switch (activeTab) {
      case 'Favorites':
        filtered = filtered.filter(market => market.favorite);
        break;
      case 'Gainers':
        // Filter for positive price changes and sort by highest gains - SHOW ALL
        filtered = filtered.filter(market => market.changeValue > 0)
                          .sort((a, b) => b.changeValue - a.changeValue);
        console.log(`Gainers found: ${filtered.length} out of ${searchFilteredMarkets.length} total markets`);
        break;
      case 'Losers':
        // Filter for negative price changes and sort by biggest losses - SHOW ALL
        filtered = filtered.filter(market => market.changeValue < 0)
                          .sort((a, b) => a.changeValue - b.changeValue);
        break;
      case 'Hot':
        // Sort by volume for hot markets - SHOW ALL
        filtered = filtered.sort((a, b) => b.volumeValue - a.volumeValue);
        break;
      case 'New':
        // Sort by price change for new/trending - top 30
        filtered = filtered.sort((a, b) => Math.abs(b.changeValue) - Math.abs(a.changeValue)).slice(0, 30);
        break;
      default:
        filtered = filtered.sort((a, b) => b.volumeValue - a.volumeValue);
    }
    
    return filtered;
  };

  const sortedMarkets = getFilteredMarkets();

  const handleCoinClick = (market: any) => {
    hapticLight();
    console.log('Market pair clicked:', market.pair);
    
    // For hash-based routing, we need to pass parameters differently
    const symbol = market.pair; // Use the full trading pair symbol like BTCUSDT
    
    // Store the symbol and tab in sessionStorage for the trade page to pick up
    sessionStorage.setItem('selectedSymbol', symbol);
    sessionStorage.setItem('selectedTab', 'Charts');
    
    console.log('Navigating to trade page with symbol:', symbol);
    
    // Navigate to trade page - hash routing will handle the base path
    navigate('/mobile/trade');
  };

  return (
    <MobileLayout>
      {/* Search Bar */}
      <div className="p-4 bg-[#0a0a2e]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="BDXN/USDT"
            className="pl-10 bg-[#0b0b30] border-[#1a1a40] text-white placeholder-gray-400 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Top Tabs */}
      <div className="px-4 pb-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {['Favorites', 'Hot', 'New', 'Gainers', 'Losers'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                hapticLight();
                setActiveTab(tab);
              }}
              onTouchStart={() => hapticLight()}
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-yellow-500 pb-2' 
                  : 'text-gray-400 hover:text-white pb-2'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>



      {/* Market List */}
      <div className="px-4 space-y-0 pb-20">
        {isLoading && !marketData ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-400">Loading live market data...</p>
          </div>
        ) : sortedMarkets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No markets found.</p>
          </div>
        ) : (
          sortedMarkets.map((market, index) => (
            <div 
              key={`${market.pair}-${index}`} 
              className="flex items-center justify-between py-4 border-b border-blue-800 hover:bg-blue-900/30 cursor-pointer transition-colors"
              onClick={() => handleCoinClick(market)}
              onTouchStart={() => hapticLight()}
            >
              <div className="flex items-center space-x-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(market.pair);
                  }}
                  className="text-gray-400 hover:text-yellow-500"
                >
                  <Star 
                    className={`w-4 h-4 ${market.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                  />
                </button>
                <div>
                  <div className="text-white font-medium text-base">{market.displayPair}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {market.volume}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-medium">
                    {market.priceValue > 0 ? `$${market.price}` : '$0.00'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Vol: {market.volume}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <div className={`text-right min-w-[80px] px-2 py-1 rounded ${
                    market.isPositive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    <div className="font-medium text-sm">{market.change}</div>
                  </div>
                  
                  {/* Sentiment Badge */}
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getSentimentColor(market.sentiment)}`}>
                    {getSentimentIcon(market.sentiment)}
                    <span>{market.sentiment}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </MobileLayout>
  );
}