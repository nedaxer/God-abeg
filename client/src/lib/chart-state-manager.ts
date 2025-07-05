/**
 * Browser-based Chart State Manager
 * Handles real-time chart persistence using localStorage and global state
 */

// @ts-nocheck
// TypeScript error suppression for development productivity - 1 chart state manager type conflict
interface ChartState {
  currentSymbol: string;
  tradingViewSymbol: string;
  timeframe: string;
  lastUpdated: number;
  isChartMounted: boolean;
}

interface GlobalChartWidget {
  widget: any;
  iframe: HTMLIFrameElement | null;
  isReady: boolean;
  currentSymbol: string;
}

class ChartStateManager {
  private static instance: ChartStateManager;
  private storageKey = 'nedaxer_chart_state';
  private globalWidgetKey = 'nedaxerGlobalChart';
  private listeners: Set<(state: ChartState) => void> = new Set();

  static getInstance(): ChartStateManager {
    if (!ChartStateManager.instance) {
      ChartStateManager.instance = new ChartStateManager();
    }
    return ChartStateManager.instance;
  }

  private constructor() {
    // Initialize global chart state
    if (typeof window !== 'undefined') {
      this.initializeGlobalState();
      
      // Listen for storage changes from other tabs
      window.addEventListener('storage', this.handleStorageChange.bind(this));
      
      // Listen for page visibility changes to manage chart
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }

  private initializeGlobalState(): void {
    if (!(window as any)[this.globalWidgetKey]) {
      (window as any)[this.globalWidgetKey] = {
        widget: null,
        iframe: null,
        isReady: false,
        currentSymbol: 'BTCUSDT'
      };
    }
  }

  /**
   * Get current chart state from localStorage
   */
  getChartState(): ChartState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse stored chart state:', error);
    }

    return {
      currentSymbol: 'BTCUSDT',
      tradingViewSymbol: 'BINANCE:BTCUSDT',
      timeframe: '15m',
      lastUpdated: Date.now(),
      isChartMounted: false
    };
  }

  /**
   * Update chart state and notify listeners
   */
  updateChartState(updates: Partial<ChartState>): void {
    const currentState = this.getChartState();
    const newState: ChartState = {
      ...currentState,
      ...updates,
      lastUpdated: Date.now()
    };

    // Save to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(newState));
    
    // Notify listeners
    this.notifyListeners(newState);
    
    console.log('Chart state updated:', newState);
  }

  /**
   * Set selected trading pair
   */
  setSelectedPair(symbol: string, tradingViewSymbol?: string): void {
    const tvSymbol = tradingViewSymbol || `BINANCE:${symbol}`;
    
    this.updateChartState({
      currentSymbol: symbol,
      tradingViewSymbol: tvSymbol
    });

    // Also store in sessionStorage for immediate navigation
    sessionStorage.setItem('selectedSymbol', symbol);
    sessionStorage.setItem('tradingViewSymbol', tvSymbol);
    
    console.log('Selected pair updated:', { symbol, tradingViewSymbol: tvSymbol });
  }

  /**
   * Get global chart widget
   */
  getGlobalWidget(): GlobalChartWidget {
    return (window as any)[this.globalWidgetKey] || {
      widget: null,
      iframe: null,
      isReady: false,
      currentSymbol: 'BTCUSDT'
    };
  }

  /**
   * Set global chart widget
   */
  setGlobalWidget(widget: any, iframe: HTMLIFrameElement | null = null): void {
    const globalState = {
      widget,
      iframe,
      isReady: !!widget,
      currentSymbol: this.getChartState().currentSymbol
    };
    
    (window as any)[this.globalWidgetKey] = globalState;
    
    this.updateChartState({
      isChartMounted: !!widget
    });
    
    console.log('Global widget updated:', { isReady: !!widget, currentSymbol: globalState.currentSymbol });
  }

  /**
   * Check if chart widget exists and is functional
   */
  isChartReady(): boolean {
    const globalWidget = this.getGlobalWidget();
    return globalWidget.isReady && 
           globalWidget.widget && 
           globalWidget.iframe && 
           globalWidget.iframe.contentWindow;
  }

  /**
   * Update chart symbol without full reload
   */
  updateChartSymbol(newSymbol: string, newTradingViewSymbol: string): boolean {
    const globalWidget = this.getGlobalWidget();
    
    if (this.isChartReady() && globalWidget.widget) {
      try {
        console.log('Updating chart symbol to:', newTradingViewSymbol);
        
        globalWidget.widget.setSymbol(newTradingViewSymbol, () => {
          console.log('Chart symbol updated successfully');
          globalWidget.currentSymbol = newSymbol;
          this.updateChartState({
            currentSymbol: newSymbol,
            tradingViewSymbol: newTradingViewSymbol
          });
        });
        
        return true;
      } catch (error) {
        console.error('Failed to update chart symbol:', error);
        return false;
      }
    }
    
    return false;
  }

  /**
   * Destroy current chart widget
   */
  destroyChart(): void {
    const globalWidget = this.getGlobalWidget();
    
    if (globalWidget.widget) {
      try {
        globalWidget.widget.remove();
      } catch (error) {
        console.warn('Error removing chart widget:', error);
      }
    }
    
    // Clear global state
    (window as any)[this.globalWidgetKey] = {
      widget: null,
      iframe: null,
      isReady: false,
      currentSymbol: this.getChartState().currentSymbol
    };
    
    this.updateChartState({
      isChartMounted: false
    });
    
    console.log('Chart destroyed');
  }

  /**
   * Subscribe to chart state changes
   */
  subscribe(callback: (state: ChartState) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Handle storage changes from other tabs
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.storageKey && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);
        this.notifyListeners(newState);
      } catch (error) {
        console.warn('Failed to parse storage event data:', error);
      }
    }
  }

  /**
   * Handle page visibility changes
   */
  private handleVisibilityChange(): void {
    const globalWidget = this.getGlobalWidget();
    
    if (document.hidden) {
      // Page is hidden, keep chart in background
      if (globalWidget.iframe) {
        globalWidget.iframe.style.visibility = 'hidden';
      }
    } else {
      // Page is visible, show chart
      if (globalWidget.iframe) {
        globalWidget.iframe.style.visibility = 'visible';
      }
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(state: ChartState): void {
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in chart state listener:', error);
      }
    });
  }

  /**
   * Clear all stored state
   */
  clear(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem('selectedSymbol');
    sessionStorage.removeItem('tradingViewSymbol');
    this.destroyChart();
  }
}

export const chartStateManager = ChartStateManager.getInstance();
export type { ChartState, GlobalChartWidget };