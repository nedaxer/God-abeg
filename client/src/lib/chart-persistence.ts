/**
 * Chart Persistence Manager
 * Handles real-time saving and restoring of chart state and trading pairs
 */

interface ChartState {
  selectedPair: string;
  tradingViewSymbol: string;
  timeframe: string;
  lastUpdated: number;
  userId?: string;
}

interface TradingPreferences {
  lastSelectedPair: string;
  lastSelectedTab: string;
  lastTimeframe: string;
  chartSettings: any;
}

class ChartPersistenceManager {
  private static instance: ChartPersistenceManager;
  private storageKey = 'nedaxer_chart_state';
  private preferencesKey = 'nedaxer_trading_preferences';
  private listeners: Set<(state: ChartState) => void> = new Set();
  private saveTimeoutId: NodeJS.Timeout | null = null;

  static getInstance(): ChartPersistenceManager {
    if (!ChartPersistenceManager.instance) {
      ChartPersistenceManager.instance = new ChartPersistenceManager();
    }
    return ChartPersistenceManager.instance;
  }

  private constructor() {
    // Listen for storage changes from other tabs/windows
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this));
      
      // Periodically sync with server for authenticated users
      setInterval(() => {
        this.syncWithServer();
      }, 30000); // Sync every 30 seconds
    }
  }

  /**
   * Save chart state to localStorage and optionally to server
   */
  saveChartState(state: Partial<ChartState>): void {
    const currentState = this.getChartState();
    const newState: ChartState = {
      ...currentState,
      ...state,
      lastUpdated: Date.now()
    };

    // Save to localStorage immediately
    localStorage.setItem(this.storageKey, JSON.stringify(newState));
    
    // Debounce server sync
    if (this.saveTimeoutId) {
      clearTimeout(this.saveTimeoutId);
    }
    
    this.saveTimeoutId = setTimeout(() => {
      this.syncToServer(newState);
    }, 1000);

    // Notify listeners
    this.notifyListeners(newState);
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
      selectedPair: 'BTCUSDT',
      tradingViewSymbol: 'BINANCE:BTCUSDT',
      timeframe: '15m',
      lastUpdated: Date.now()
    };
  }

  /**
   * Save trading preferences
   */
  saveTradingPreferences(preferences: Partial<TradingPreferences>): void {
    const current = this.getTradingPreferences();
    const updated = { ...current, ...preferences };
    
    localStorage.setItem(this.preferencesKey, JSON.stringify(updated));
    
    // Also sync to server
    this.syncPreferencesToServer(updated);
  }

  /**
   * Get trading preferences
   */
  getTradingPreferences(): TradingPreferences {
    try {
      const stored = localStorage.getItem(this.preferencesKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to parse trading preferences:', error);
    }

    return {
      lastSelectedPair: 'BTCUSDT',
      lastSelectedTab: 'Charts',
      lastTimeframe: '15m',
      chartSettings: {}
    };
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
   * Handle storage events from other tabs
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
   * Sync chart state to MongoDB for authenticated users
   */
  private async syncToServer(state: ChartState): Promise<void> {
    try {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lastSelectedPair: state.selectedPair,
          lastSelectedTab: 'Charts',
          lastSelectedCrypto: state.selectedPair,
          chartSettings: {
            timeframe: state.timeframe,
            tradingViewSymbol: state.tradingViewSymbol,
            lastUpdated: state.lastUpdated
          }
        })
      });

      if (response.ok) {
        console.log('Chart state synced to MongoDB successfully');
      } else {
        console.warn('Failed to sync chart state to MongoDB');
      }
    } catch (error) {
      console.warn('Error syncing chart state to MongoDB:', error);
    }
  }

  /**
   * Sync trading preferences to server
   */
  private async syncPreferencesToServer(preferences: TradingPreferences): Promise<void> {
    try {
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lastSelectedPair: preferences.lastSelectedPair,
          lastSelectedTab: preferences.lastSelectedTab,
          chartSettings: preferences.chartSettings
        })
      });
    } catch (error) {
      console.warn('Error syncing preferences to server:', error);
    }
  }

  /**
   * Load state from MongoDB and merge with local state
   */
  private async syncWithServer(): Promise<void> {
    try {
      const response = await fetch('/api/preferences');
      if (response.ok) {
        const serverPreferences = await response.json();
        const localState = this.getChartState();
        
        console.log('Syncing chart state from MongoDB:', serverPreferences);
        
        // Only update if server state is newer or local state is missing
        if (serverPreferences.lastSelectedPair && 
            (!localState.lastUpdated || 
             (serverPreferences.chartSettings?.lastUpdated && 
              serverPreferences.chartSettings.lastUpdated > localState.lastUpdated))) {
          
          const updatedState: ChartState = {
            selectedPair: serverPreferences.lastSelectedPair || localState.selectedPair,
            tradingViewSymbol: serverPreferences.chartSettings?.tradingViewSymbol || localState.tradingViewSymbol,
            timeframe: serverPreferences.chartSettings?.timeframe || localState.timeframe,
            lastUpdated: serverPreferences.chartSettings?.lastUpdated || Date.now(),
            userId: serverPreferences.userId
          };

          localStorage.setItem(this.storageKey, JSON.stringify(updatedState));
          this.notifyListeners(updatedState);
          console.log('Chart state updated from MongoDB:', updatedState);
        }
      }
    } catch (error) {
      // Silently fail - user might not be authenticated
      console.debug('Chart sync failed (user may not be authenticated):', error);
    }
  }

  /**
   * Clear all stored state
   */
  clear(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.preferencesKey);
  }

  /**
   * Get last selected pair for quick access
   */
  getLastSelectedPair(): string {
    const state = this.getChartState();
    return state.selectedPair;
  }

  /**
   * Set selected pair and auto-save
   */
  setSelectedPair(pair: string, tradingViewSymbol: string): void {
    this.saveChartState({
      selectedPair: pair,
      tradingViewSymbol: tradingViewSymbol
    });

    this.saveTradingPreferences({
      lastSelectedPair: pair
    });
  }
}

export const chartPersistence = ChartPersistenceManager.getInstance();
export type { ChartState, TradingPreferences };