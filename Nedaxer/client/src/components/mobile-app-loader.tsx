import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface MobileAppLoaderProps {
  children: React.ReactNode;
}

export const MobileAppLoader: React.FC<MobileAppLoaderProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isPreloading, setIsPreloading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState({
    auth: false,
    images: false,
    prices: false,
    wallet: false,
    balances: false,
    favorites: false,
    rates: false,
    complete: false
  });

  // Wait for auth to complete before starting data loading
  useEffect(() => {
    if (!authLoading) {
      setAuthCheckComplete(true);
      setLoadingSteps(prev => ({ ...prev, auth: true }));
      console.log('Auth check complete, user:', user ? 'authenticated' : 'not authenticated');
    }
  }, [authLoading, user]);

  // Preload critical images for faster mobile experience
  useEffect(() => {
    if (!authCheckComplete || !user) return;
    
    const preloadImages = async () => {
      const criticalImages = [
        // Critical mobile app images for faster loading
        '/logos/btc-logo.png',
        '/logos/eth-logo.png', 
        '/logos/usdt-logo.png',
        '/logos/bnb-logo.png',
        '/assets/nedaxer-logo.png',
        '/assets/refresh-logo.png',
        '/optimized/assets/nedaxer-logo.webp',
        '/optimized/logos/btc-logo.webp',
        // Add splash screen assets
        '/assets/20250618_001640_1750207793691.png',
        '/assets/20250618_042459_1750217238332.png'
      ];
      
      console.log('🖼️ Preloading critical images for mobile app...');
      
      const preloadPromises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false); // Don't fail on missing images
          img.src = src;
          // Add to cache if service worker is available
          if ('serviceWorker' in navigator && 'caches' in window) {
            caches.open('mobile-images-v1').then(cache => {
              cache.add(src).catch(() => {/* Silent fail */});
            });
          }
        });
      });
      
      await Promise.allSettled(preloadPromises);
      console.log('✅ Critical images preloaded');
      setLoadingSteps(prev => ({ ...prev, images: true }));
    };
    
    preloadImages();
  }, [authCheckComplete, user]);

  // Critical data queries with immediate execution and fast timeout for new users
  const { data: priceData, isSuccess: pricesLoaded, isError: pricesError } = useQuery({
    queryKey: ['/api/crypto/realtime-prices'],
    enabled: authCheckComplete && !!user && isPreloading,
    retry: 1,
    staleTime: 5000, // Reduced for real-time updates
    refetchInterval: 5000, // Auto-refresh during loading
  });

  const { data: walletData, isSuccess: walletLoaded, isError: walletError } = useQuery({
    queryKey: ['/api/wallet/summary'],
    enabled: authCheckComplete && !!user && isPreloading,
    retry: 1,
    staleTime: 30000,
  });

  const { data: balanceData, isSuccess: balancesLoaded, isError: balancesError } = useQuery({
    queryKey: ['/api/balances'],
    enabled: authCheckComplete && !!user && isPreloading,
    retry: 1,
    staleTime: 30000,
  });

  const { data: favoritesData, isSuccess: favoritesLoaded, isError: favoritesError } = useQuery({
    queryKey: ['/api/favorites'],
    enabled: authCheckComplete && !!user && isPreloading,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Preload exchange rates for currency conversion
  const { data: exchangeRates, isSuccess: ratesLoaded } = useQuery({
    queryKey: ['/api/market-data/conversion-rates'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/market-data/conversion-rates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return null; // Continue without rates if failed
      }
    },
    enabled: authCheckComplete && isPreloading,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update loading steps as data loads or fails
  useEffect(() => {
    setLoadingSteps(prev => ({
      ...prev,
      prices: pricesLoaded || pricesError,
      wallet: walletLoaded || walletError,
      balances: balancesLoaded || balancesError,
      favorites: favoritesLoaded || favoritesError,
      rates: ratesLoaded || true, // Don't block on rates failure
    }));
  }, [pricesLoaded, walletLoaded, balancesLoaded, favoritesLoaded, ratesLoaded, pricesError, walletError, balancesError, favoritesError]);

  // Check if all critical data is loaded or failed (for new users)
  useEffect(() => {
    const allDataReady = authCheckComplete && 
                        (pricesLoaded || pricesError) && 
                        (walletLoaded || walletError) && 
                        (balancesLoaded || balancesError) && 
                        (favoritesLoaded || favoritesError) && 
                        loadingSteps.rates;

    if (user && allDataReady) {
      // Add small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setLoadingSteps(prev => ({ ...prev, complete: true }));
        setIsPreloading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [user, authCheckComplete, pricesLoaded, walletLoaded, balancesLoaded, favoritesLoaded, loadingSteps.rates, pricesError, walletError, balancesError, favoritesError]);

  // Emergency timeout for new users - don't wait more than 4 seconds after auth completes
  useEffect(() => {
    if (authCheckComplete && user && isPreloading) {
      console.log('Starting emergency timeout for authenticated user');
      const emergencyTimer = setTimeout(() => {
        console.log('Emergency timeout triggered - proceeding with available data');
        setLoadingSteps(prev => ({ ...prev, complete: true }));
        setIsPreloading(false);
      }, 4000);

      return () => clearTimeout(emergencyTimer);
    }
  }, [authCheckComplete, user, isPreloading]);

  // Additional safety net - if user exists but loader is stuck, force completion
  useEffect(() => {
    if (user && !authLoading && isPreloading) {
      const safetyTimer = setTimeout(() => {
        console.log('Safety timeout - forcing loader completion for authenticated user');
        setLoadingSteps(prev => ({ ...prev, auth: true, complete: true }));
        setIsPreloading(false);
      }, 6000);

      return () => clearTimeout(safetyTimer);
    }
  }, [user, authLoading, isPreloading]);

  // If auth is still loading, show basic loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Nedaxer</h1>
        </div>
      </div>
    );
  }

  // If not authenticated, show children immediately
  if (!user) {
    return <>{children}</>;
  }

  // Skip all loading screens to avoid duplicate splash screen
  if (isPreloading || !loadingSteps.complete) {
    // Return children immediately to avoid any duplicate loading screens
    return <>{children}</>;
  }

  // All data loaded, show the mobile app
  return <>{children}</>;
};

interface LoadingStepProps {
  label: string;
  completed: boolean;
  active: boolean;
}

const LoadingStep: React.FC<LoadingStepProps> = ({ label, completed, active }) => {
  return (
    <div className="flex items-center space-x-3 text-sm">
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
        completed 
          ? 'bg-green-500 border-green-500' 
          : active 
            ? 'border-orange-500 animate-pulse' 
            : 'border-gray-600'
      }`}>
        {completed && (
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className={`transition-colors duration-300 ${
        completed 
          ? 'text-green-400' 
          : active 
            ? 'text-orange-400' 
            : 'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  );
};