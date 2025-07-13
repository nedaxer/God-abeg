import { useState, useEffect } from 'react';

interface CryptoCacheData {
  data: any[];
  timestamp: number;
  expiry: number;
  offline: boolean;
}

const CACHE_KEY = 'nedaxer-crypto-offline-cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const OLD_CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

export function useOfflineCryptoCache() {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'expired' | 'offline' | 'none'>('none');

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('🌐 Connection restored, will fetch fresh data');
      fetchFreshData();
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('📱 Offline mode - using cached data');
      loadCachedData();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data to cache
  const saveToCache = (data: any[]) => {
    try {
      const now = Date.now();
      const cacheData: CryptoCacheData = {
        data,
        timestamp: now,
        expiry: now + CACHE_DURATION,
        offline: isOffline
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log(`💾 Crypto data cached offline (${data.length} coins)`);
    } catch (error) {
      console.error('❌ Failed to save offline cache:', error);
    }
  };

  // Load data from cache
  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        console.log('📭 No offline cache found');
        setCacheStatus('none');
        return null;
      }

      const cacheData: CryptoCacheData = JSON.parse(cached);
      const now = Date.now();
      const age = now - cacheData.timestamp;
      
      if (age <= CACHE_DURATION) {
        console.log(`📦 Using fresh offline cache (${Math.round(age / 1000)}s old)`);
        setCryptoData(cacheData.data);
        setCacheStatus('fresh');
        return cacheData.data;
      } else if (age <= OLD_CACHE_DURATION) {
        console.log(`🗄️ Using expired offline cache (${Math.round(age / 1000)}s old)`);
        setCryptoData(cacheData.data);
        setCacheStatus('expired');
        return cacheData.data;
      } else {
        console.log(`🗑️ Offline cache too old (${Math.round(age / 1000)}s)`);
        setCacheStatus('none');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to load offline cache:', error);
      setCacheStatus('none');
      return null;
    }
  };

  // Fetch fresh data from API
  const fetchFreshData = async () => {
    if (isOffline) {
      console.log('📱 Offline - skipping API call');
      return loadCachedData();
    }

    try {
      console.log('🔄 Fetching fresh crypto data...');
      setIsLoading(true);

      const response = await fetch('/api/crypto/realtime-prices');
      const result = await response.json();

      if (result.success && result.data) {
        console.log(`✅ Fresh data received (${result.data.length} coins)`);
        setCryptoData(result.data);
        saveToCache(result.data);
        setCacheStatus('fresh');
        setIsLoading(false);
        return result.data;
      } else {
        throw new Error('API returned invalid data');
      }
    } catch (error) {
      console.error('❌ Failed to fetch fresh data:', error);
      
      // Fallback to cached data
      const cachedData = loadCachedData();
      if (cachedData) {
        setCacheStatus('offline');
        console.log('⚠️ Using cached data due to API failure');
      } else {
        console.log('💀 No cached data available');
        setCacheStatus('none');
      }
      
      setIsLoading(false);
      return cachedData;
    }
  };

  // Force refresh - keep trying until successful
  const forceRefresh = async () => {
    let attempts = 0;
    const maxAttempts = 10;
    const baseDelay = 2000; // 2 seconds

    const attemptFetch = async (): Promise<boolean> => {
      attempts++;
      console.log(`🎯 Force refresh attempt ${attempts}/${maxAttempts}`);

      try {
        const response = await fetch('/api/crypto/realtime-prices');
        const result = await response.json();

        if (result.success && result.data) {
          console.log(`✅ Force refresh successful on attempt ${attempts}`);
          setCryptoData(result.data);
          saveToCache(result.data);
          setCacheStatus('fresh');
          return true;
        }
        throw new Error('Invalid response');
      } catch (error) {
        console.error(`❌ Force refresh attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          console.log('💀 Force refresh failed after maximum attempts');
          return false;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempts - 1);
        console.log(`⏰ Waiting ${delay}ms before next attempt...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return attemptFetch();
      }
    };

    return attemptFetch();
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      // First try to load cached data for instant display
      const cachedData = loadCachedData();
      
      if (cachedData) {
        setIsLoading(false);
      }

      // Then try to fetch fresh data if online
      if (!isOffline) {
        await fetchFreshData();
      } else {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Auto-refresh every 5 minutes when online
  useEffect(() => {
    if (isOffline) return;

    const refreshInterval = setInterval(() => {
      console.log('⏰ Auto-refresh triggered');
      fetchFreshData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [isOffline]);

  return {
    cryptoData,
    isLoading,
    isOffline,
    cacheStatus,
    fetchFreshData,
    forceRefresh,
    loadCachedData
  };
}