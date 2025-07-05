import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CryptoPriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  image: string;
}

interface CryptoPriceTickerProps {
  selectedSymbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export default function CryptoPriceTicker({ selectedSymbol = 'bitcoin', onSymbolChange }: CryptoPriceTickerProps) {
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [displayChange, setDisplayChange] = useState<number>(0);

  const { data: cryptoData, isLoading, error } = useQuery<CryptoPriceData[]>({
    queryKey: ['/api/crypto/prices'],
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
    retryDelay: 1000
  });

  const { data: selectedCrypto } = useQuery<CryptoPriceData>({
    queryKey: ['/api/crypto/detail', selectedSymbol],
    refetchInterval: 1000, // Refresh every second for selected crypto
    enabled: !!selectedSymbol,
    retry: 3,
    retryDelay: 500
  });

  useEffect(() => {
    if (selectedCrypto && selectedCrypto.current_price !== undefined) {
      // Animate price changes
      const targetPrice = selectedCrypto.current_price;
      const targetChange = selectedCrypto.price_change_percentage_24h;
      
      const animatePrice = () => {
        setDisplayPrice(prev => {
          const diff = targetPrice - prev;
          return prev + diff * 0.1;
        });
      };

      const animateChange = () => {
        setDisplayChange(prev => {
          const diff = targetChange - prev;
          return prev + diff * 0.1;
        });
      };

      const interval = setInterval(() => {
        animatePrice();
        animateChange();
      }, 50);

      return () => clearInterval(interval);
    }
  }, [selectedCrypto]);

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-8 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <div className="text-red-400 text-sm">
          Unable to fetch crypto data. Please check your connection.
        </div>
      </div>
    );
  }

  const currentCrypto = selectedCrypto || (cryptoData && cryptoData.length > 0 ? cryptoData[0] : null);
  
  if (!currentCrypto) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  const isPositive = displayChange >= 0;
  const formattedPrice = displayPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: displayPrice < 1 ? 6 : 2
  });

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {currentCrypto.image && (
            <img 
              src={currentCrypto.image} 
              alt={currentCrypto.name}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <span className="text-white text-lg font-bold">
            {currentCrypto.symbol?.toUpperCase()}/USDT
          </span>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className={`text-xs px-2 py-1 rounded ${
          isPositive 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? '+' : ''}{displayChange.toFixed(2)}%
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-white text-2xl font-bold">
            {formattedPrice}
          </div>
          <div className="text-gray-400 text-sm">
            Vol: {currentCrypto.volume_24h ? 
              (currentCrypto.volume_24h / 1000000).toFixed(2) + 'M' : 
              'N/A'
            }
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="text-gray-400">
            Market Cap: <span className="text-white">
              {currentCrypto.market_cap ? 
                '$' + (currentCrypto.market_cap / 1000000000).toFixed(2) + 'B' : 
                'N/A'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Top Cryptocurrencies List */}
      {cryptoData && cryptoData.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm mb-2">Top Cryptocurrencies</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cryptoData.slice(0, 8).map((crypto) => (
              <div 
                key={crypto.id}
                className={`flex items-center justify-between py-2 px-2 rounded cursor-pointer transition-colors ${
                  selectedSymbol === crypto.id ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
                onClick={() => onSymbolChange?.(crypto.id)}
              >
                <div className="flex items-center space-x-2">
                  {crypto.image && (
                    <img 
                      src={crypto.image} 
                      alt={crypto.name}
                      className="w-4 h-4 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="text-white text-sm">{crypto.symbol?.toUpperCase()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">
                    ${crypto.current_price?.toFixed(crypto.current_price < 1 ? 4 : 2)}
                  </span>
                  <span className={`text-xs ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}