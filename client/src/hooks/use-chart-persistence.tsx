import { useState, useEffect, useCallback } from 'react';
import { chartPersistence, type ChartState, type TradingPreferences } from '@/lib/chart-persistence';

/**
 * Hook for managing persistent chart state across page navigations
 */
export function useChartPersistence() {
  const [chartState, setChartState] = useState<ChartState>(() => 
    chartPersistence.getChartState()
  );
  
  const [preferences, setPreferences] = useState<TradingPreferences>(() =>
    chartPersistence.getTradingPreferences()
  );

  // Subscribe to chart state changes
  useEffect(() => {
    const unsubscribe = chartPersistence.subscribe((newState) => {
      setChartState(newState);
    });

    return unsubscribe;
  }, []);

  // Update chart state
  const updateChartState = useCallback((updates: Partial<ChartState>) => {
    chartPersistence.saveChartState(updates);
  }, []);

  // Update trading preferences
  const updatePreferences = useCallback((updates: Partial<TradingPreferences>) => {
    chartPersistence.saveTradingPreferences(updates);
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  // Set selected trading pair
  const setSelectedPair = useCallback((pair: string, tradingViewSymbol: string) => {
    chartPersistence.setSelectedPair(pair, tradingViewSymbol);
  }, []);

  // Get last selected pair
  const getLastSelectedPair = useCallback(() => {
    return chartPersistence.getLastSelectedPair();
  }, []);

  return {
    chartState,
    preferences,
    updateChartState,
    updatePreferences,
    setSelectedPair,
    getLastSelectedPair
  };
}

/**
 * Hook for components that need to trigger chart navigation
 */
export function useChartNavigation() {
  const setSelectedPair = useCallback((symbol: string, tradingViewSymbol?: string) => {
    // Auto-generate TradingView symbol if not provided
    const tvSymbol = tradingViewSymbol || `BINANCE:${symbol.toUpperCase()}`;
    
    chartPersistence.setSelectedPair(symbol, tvSymbol);
    
    // Store in sessionStorage for immediate navigation
    sessionStorage.setItem('selectedSymbol', symbol);
    sessionStorage.setItem('selectedTab', 'Charts');
  }, []);

  const navigateToChart = useCallback((symbol: string, tradingViewSymbol?: string) => {
    setSelectedPair(symbol, tradingViewSymbol);
    
    // Navigate to trade page
    window.location.hash = '#/mobile/trade';
  }, [setSelectedPair]);

  return {
    setSelectedPair,
    navigateToChart
  };
}