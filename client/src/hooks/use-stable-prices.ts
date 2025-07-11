// Centralized hook for stable cryptocurrency price data
// Prevents flickering by having a single source of truth for price data
import { useQuery } from '@tanstack/react-query';

interface CryptoTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

interface PriceResponse {
  success: boolean;
  data: CryptoTicker[];
  cached?: boolean;
}

// UNIFIED stable query for all crypto price data - no more conflicts
export function useStablePrices() {
  return useQuery<PriceResponse>({
    queryKey: ['/api/coins'],
    queryFn: async () => {
      const response = await fetch('/api/coins');
      if (!response.ok) {
        throw new Error(`Failed to fetch crypto prices: ${response.statusText}`);
      }
      return response.json();
    },
    refetchInterval: 60000, // 60 seconds - SINGLE stable interval across entire app
    staleTime: 45000, // 45 seconds - long cache time 
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnReconnect: false, // Prevent reconnection refetches
    retry: 1, // Reduced retries to prevent spam
    retryDelay: 3000,
  });
}

// Helper to get specific coin data from the stable price data
export function useStableCoinPrice(symbol: string) {
  const { data: priceData, isLoading, error } = useStablePrices();
  
  const coinData = priceData?.data?.find(ticker => ticker.symbol === symbol);
  
  return {
    data: coinData,
    isLoading,
    error,
    price: coinData?.price || 0,
    change: coinData?.change || 0,
    isPositive: (coinData?.change || 0) >= 0,
  };
}