// Simple chart cache utility without complex dependencies
export interface ChartCacheData {
  symbol: string;
  lastLoaded: number;
  isReady: boolean;
  timeframe: string;
}

class SimpleChartCache {
  private static instance: SimpleChartCache;
  private cache: Map<string, ChartCacheData> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance() {
    if (!SimpleChartCache.instance) {
      SimpleChartCache.instance = new SimpleChartCache();
    }
    return SimpleChartCache.instance;
  }

  setCookie(name: string, value: string, days: number = 7) {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  setChartReady(symbol: string, timeframe: string = '15m') {
    const data: ChartCacheData = {
      symbol,
      lastLoaded: Date.now(),
      isReady: true,
      timeframe
    };
    
    this.cache.set(symbol, data);
    
    // Save to localStorage and cookies
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`chart_${symbol}`, JSON.stringify(data));
    }
    this.setCookie(`chart_${symbol}`, JSON.stringify(data));
  }

  isChartReady(symbol: string): boolean {
    // Check memory cache first
    let data = this.cache.get(symbol);
    
    // If not in memory, try localStorage
    if (!data && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(`chart_${symbol}`);
      if (stored) {
        try {
          data = JSON.parse(stored);
          if (data) this.cache.set(symbol, data);
        } catch (e) {
          console.warn('Failed to parse stored chart data');
        }
      }
    }
    
    // If still not found, try cookies
    if (!data) {
      const cookie = this.getCookie(`chart_${symbol}`);
      if (cookie) {
        try {
          data = JSON.parse(cookie);
          if (data) this.cache.set(symbol, data);
        } catch (e) {
          console.warn('Failed to parse cookie chart data');
        }
      }
    }
    
    if (!data) return false;
    
    // Check if cache is still valid
    const isValid = Date.now() - data.lastLoaded < this.CACHE_DURATION;
    return data.isReady && isValid;
  }

  clearCache(symbol?: string) {
    if (symbol) {
      this.cache.delete(symbol);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`chart_${symbol}`);
      }
      this.setCookie(`chart_${symbol}`, '', -1);
    } else {
      this.cache.clear();
      if (typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('chart_')) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  }

  saveLastSymbol(symbol: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('last_chart_symbol', symbol);
    }
    this.setCookie('last_chart_symbol', symbol);
  }

  getLastSymbol(): string | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('last_chart_symbol');
      if (stored) return stored;
    }
    return this.getCookie('last_chart_symbol');
  }
}

export const chartCache = SimpleChartCache.getInstance();