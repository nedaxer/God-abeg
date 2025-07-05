/**
 * Chart Cache Manager - Handles persistent chart state and caching
 */

export interface ChartState {
  symbol: string;
  timeframe: string;
  chartType: string;
  indicators: Record<string, boolean>;
  lastUpdate: number;
  isReady: boolean;
}

export interface ChartData {
  symbol: string;
  data: any[];
  timestamp: number;
}

export class ChartCacheManager {
  private static instance: ChartCacheManager;
  private chartState: ChartState | null = null;
  private chartDataCache: Map<string, ChartData> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadStateFromStorage();
    }
  }

  static getInstance(): ChartCacheManager {
    if (!ChartCacheManager.instance) {
      ChartCacheManager.instance = new ChartCacheManager();
    }
    return ChartCacheManager.instance;
  }

  // Cookie utilities
  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  // Load chart state from cookies and localStorage
  private loadStateFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      // Try to load from localStorage first (more reliable)
      const storedState = localStorage.getItem('nedaxer_chart_state');
      if (storedState) {
        this.chartState = JSON.parse(storedState);
      } else {
        // Fallback to cookies
        const cookieState = this.getCookie('nedaxer_chart_state');
        if (cookieState) {
          this.chartState = JSON.parse(cookieState);
        }
      }

      // Load chart data cache
      const cachedData = localStorage.getItem('nedaxer_chart_data');
      if (cachedData) {
        const dataObject = JSON.parse(cachedData) as Record<string, ChartData>;
        this.chartDataCache = new Map();
        Object.entries(dataObject).forEach(([key, value]) => {
          this.chartDataCache.set(key, value);
        });
      }
    } catch (error) {
      console.warn('Failed to load chart state from storage:', error);
      this.chartState = null;
    }
  }

  // Save chart state to both localStorage and cookies
  private saveStateToStorage() {
    if (!this.chartState) return;

    try {
      const stateJson = JSON.stringify(this.chartState);
      
      // Save to localStorage (primary)
      localStorage.setItem('nedaxer_chart_state', stateJson);
      
      // Save to cookies (backup)
      this.setCookie('nedaxer_chart_state', stateJson, 7);

      // Save chart data cache
      const dataObject = Object.fromEntries(this.chartDataCache);
      localStorage.setItem('nedaxer_chart_data', JSON.stringify(dataObject));
    } catch (error) {
      console.warn('Failed to save chart state to storage:', error);
    }
  }

  // Get current chart state
  getChartState(): ChartState | null {
    return this.chartState;
  }

  // Update chart state
  updateChartState(updates: Partial<ChartState>) {
    this.chartState = {
      ...this.chartState,
      ...updates,
      lastUpdate: Date.now()
    } as ChartState;
    
    this.saveStateToStorage();
  }

  // Set chart as ready and initialized
  setChartReady(symbol: string, timeframe: string = '1D') {
    this.updateChartState({
      symbol,
      timeframe,
      chartType: 'candlestick',
      indicators: {
        volume: true,
        ma20: true,
        ma50: false,
        rsi: false,
        macd: false
      },
      isReady: true
    });
  }

  // Check if chart is ready for symbol
  isChartReady(symbol: string): boolean {
    if (!this.chartState) return false;
    
    const isRecentlyUpdated = Date.now() - this.chartState.lastUpdate < this.CACHE_DURATION;
    return this.chartState.isReady && this.chartState.symbol === symbol && isRecentlyUpdated;
  }

  // Cache chart data
  cacheChartData(symbol: string, data: any[]) {
    this.chartDataCache.set(symbol, {
      symbol,
      data,
      timestamp: Date.now()
    });
    
    // Clean old cache entries
    this.cleanOldCache();
    this.saveStateToStorage();
  }

  // Get cached chart data
  getCachedChartData(symbol: string): any[] | null {
    const cached = this.chartDataCache.get(symbol);
    if (!cached) return null;
    
    // Check if cache is still valid
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.chartDataCache.delete(symbol);
      return null;
    }
    
    return cached.data;
  }

  // Clean old cache entries
  private cleanOldCache() {
    const now = Date.now();
    const entries = Array.from(this.chartDataCache.entries());
    entries.forEach(([symbol, data]) => {
      if (now - data.timestamp > this.CACHE_DURATION) {
        this.chartDataCache.delete(symbol);
      }
    });
  }

  // Clear all cache
  clearCache() {
    this.chartState = null;
    this.chartDataCache.clear();
    localStorage.removeItem('nedaxer_chart_state');
    localStorage.removeItem('nedaxer_chart_data');
    this.setCookie('nedaxer_chart_state', '', -1); // Delete cookie
  }

  // Get cached symbols
  getCachedSymbols(): string[] {
    return Array.from(this.chartDataCache.keys());
  }

  // Check if we should reload chart
  shouldReloadChart(currentSymbol: string): boolean {
    if (!this.chartState) return true;
    
    const timeSinceUpdate = Date.now() - this.chartState.lastUpdate;
    const symbolChanged = this.chartState.symbol !== currentSymbol;
    const cacheExpired = timeSinceUpdate > this.CACHE_DURATION;
    
    return symbolChanged || cacheExpired || !this.chartState.isReady;
  }

  // Preload chart data for symbol
  async preloadChartData(symbol: string): Promise<any[] | null> {
    const cached = this.getCachedChartData(symbol);
    if (cached) return cached;
    
    try {
      const response = await fetch(`/api/markets/${symbol.toLowerCase()}/chart?days=30`);
      if (!response.ok) throw new Error('Failed to fetch chart data');
      
      const data = await response.json();
      this.cacheChartData(symbol, data);
      return data;
    } catch (error) {
      console.warn('Failed to preload chart data:', error);
      return null;
    }
  }
}

export const chartCacheManager = ChartCacheManager.getInstance();