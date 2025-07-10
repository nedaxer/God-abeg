// TradingView Chart Caching System
// Implements 10-minute localStorage caching to prevent unnecessary chart reloads

interface TradingViewCacheData {
  symbol: string;
  tradingViewSymbol: string;
  timestamp: number;
  isLoaded: boolean;
}

const CACHE_KEY = 'nedaxer-tradingview-cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export class TradingViewCache {
  
  // Get cached chart data
  static getCachedData(): TradingViewCacheData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - parsedCache.timestamp;
        
        if (cacheAge < CACHE_DURATION) {
          console.log('Using cached TradingView chart, age:', Math.round(cacheAge / 1000), 'seconds');
          return parsedCache;
        } else {
          console.log('TradingView cache expired, age:', Math.round(cacheAge / 1000), 'seconds');
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Error reading TradingView cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  }

  // Set cache data
  static setCachedData(symbol: string, tradingViewSymbol: string): void {
    try {
      const cacheData: TradingViewCacheData = {
        symbol,
        tradingViewSymbol,
        timestamp: Date.now(),
        isLoaded: true
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('TradingView chart cached successfully for:', symbol);
    } catch (error) {
      console.error('Error caching TradingView chart:', error);
    }
  }

  // Check if chart should be reloaded
  static shouldReload(newSymbol: string, newTradingViewSymbol: string): boolean {
    const cached = this.getCachedData();
    
    if (!cached) {
      console.log('No cached chart found, needs reload');
      return true;
    }

    if (cached.symbol !== newSymbol || cached.tradingViewSymbol !== newTradingViewSymbol) {
      console.log('Chart symbol changed, needs reload. From:', cached.symbol, 'to:', newSymbol);
      return true;
    }

    console.log('Chart cache valid, no reload needed for:', newSymbol);
    return false;
  }

  // Force reload by clearing cache
  static forceReload(): void {
    localStorage.removeItem(CACHE_KEY);
    console.log('TradingView cache cleared, forcing reload');
  }

  // Get cache age in seconds
  static getCacheAge(): number {
    const cached = this.getCachedData();
    if (!cached) return Infinity;
    
    return Math.round((Date.now() - cached.timestamp) / 1000);
  }

  // Check if cache is expired
  static isCacheExpired(): boolean {
    const cached = this.getCachedData();
    if (!cached) return true;
    
    const cacheAge = Date.now() - cached.timestamp;
    return cacheAge >= CACHE_DURATION;
  }
}

// Global TradingView widget manager with caching
export class TradingViewManager {
  private static widget: any = null;
  private static container: HTMLElement | null = null;
  private static isReady: boolean = false;
  private static currentSymbol: string = '';

  // Initialize TradingView widget with caching
  static async initializeWidget(
    containerId: string, 
    symbol: string, 
    tradingViewSymbol: string,
    forceReload: boolean = false
  ): Promise<void> {
    
    // Check if should reload based on cache
    if (!forceReload && !TradingViewCache.shouldReload(symbol, tradingViewSymbol)) {
      // Try to reuse existing widget
      if (this.widget && this.isReady && this.currentSymbol === symbol) {
        console.log('Reusing existing TradingView widget for:', symbol);
        this.showWidget(containerId);
        return;
      }
    }

    console.log('Initializing new TradingView widget for:', symbol);
    
    // Clear existing widget if reloading
    if (forceReload || TradingViewCache.shouldReload(symbol, tradingViewSymbol)) {
      this.destroyWidget();
    }

    // Wait for TradingView library to load
    await this.waitForTradingView();

    // Get container
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('TradingView container not found:', containerId);
      return;
    }

    // Clear container
    this.container.innerHTML = '';

    // Create widget configuration
    const config = {
      autosize: true,
      symbol: tradingViewSymbol,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#1a1a40',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      width: '100%',
      height: '400',
      withdateranges: true,
      hide_side_toolbar: false,
      container_id: containerId,
      onChartReady: () => {
        console.log('TradingView chart ready for:', symbol);
        this.isReady = true;
        this.currentSymbol = symbol;
        
        // Cache the chart data
        TradingViewCache.setCachedData(symbol, tradingViewSymbol);
      }
    };

    try {
      // Create new widget
      this.widget = new (window as any).TradingView.widget(config);
      console.log('TradingView widget created successfully');
      
    } catch (error) {
      console.error('Error creating TradingView widget:', error);
    }
  }

  // Wait for TradingView library to load
  private static waitForTradingView(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).TradingView) {
        resolve();
        return;
      }

      // Load TradingView script if not loaded
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.onload = () => {
        console.log('TradingView library loaded');
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load TradingView library');
        resolve(); // Continue anyway
      };
      
      document.head.appendChild(script);
    });
  }

  // Show existing widget in container
  static showWidget(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.widget && this.isReady) {
      // Widget is already loaded, just ensure it's visible
      const iframe = container.querySelector('iframe');
      if (iframe) {
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        console.log('TradingView widget shown in container:', containerId);
      }
    }
  }

  // Update widget symbol (only if different)
  static updateSymbol(symbol: string, tradingViewSymbol: string): void {
    if (!this.widget || !this.isReady) {
      console.log('Widget not ready for symbol update');
      return;
    }

    if (this.currentSymbol === symbol) {
      console.log('Symbol already loaded:', symbol);
      return;
    }

    try {
      this.widget.setSymbol(tradingViewSymbol, '15', () => {
        console.log('Symbol updated to:', symbol);
        this.currentSymbol = symbol;
        
        // Update cache
        TradingViewCache.setCachedData(symbol, tradingViewSymbol);
      });
    } catch (error) {
      console.error('Error updating symbol:', error);
    }
  }

  // Destroy widget
  static destroyWidget(): void {
    if (this.widget) {
      try {
        if (typeof this.widget.remove === 'function') {
          this.widget.remove();
        }
      } catch (error) {
        console.error('Error destroying widget:', error);
      }
      
      this.widget = null;
      this.isReady = false;
      this.currentSymbol = '';
    }

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }

    console.log('TradingView widget destroyed');
  }

  // Get current widget status
  static getStatus() {
    return {
      isReady: this.isReady,
      currentSymbol: this.currentSymbol,
      hasWidget: !!this.widget,
      cacheAge: TradingViewCache.getCacheAge(),
      shouldReload: (symbol: string, tradingViewSymbol: string) => 
        TradingViewCache.shouldReload(symbol, tradingViewSymbol)
    };
  }

  // Force refresh
  static forceRefresh(containerId: string, symbol: string, tradingViewSymbol: string): void {
    console.log('Force refreshing TradingView chart');
    TradingViewCache.forceReload();
    this.destroyWidget();
    this.initializeWidget(containerId, symbol, tradingViewSymbol, true);
  }
}