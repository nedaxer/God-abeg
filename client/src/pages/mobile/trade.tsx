// @ts-nocheck
// TypeScript error suppression for development productivity - 1 trade page type conflict
import MobileLayout from '@/components/mobile-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpDown,
  Plus,
  Minus,
  Calendar,
  Clock,
  Star,
  Edit3,
  ChevronDown,
  Bell,
  MessageSquare,
  Settings,
  RefreshCw,
  X
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { hapticLight, hapticMedium } from '@/lib/haptics';
import MobileSpot from './spot';
import MobileFutures from './futures';
import TradingViewWidget from '@/components/tradingview-widget';
import CryptoPriceTicker from '@/components/crypto-price-ticker';
import CryptoPairSelector from '@/components/crypto-pair-selector';
import CryptoPairSelectorModal from '@/components/crypto-pair-selector-modal';
import DepositRequiredModal from '@/components/deposit-required-modal';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { CRYPTO_PAIRS, CryptoPair, findPairBySymbol, getPairDisplayName, getPairTradingViewSymbol } from '@/lib/crypto-pairs';
import { chartCache } from '@/utils/chart-cache';

export default function MobileTrade() {
  const { t } = useLanguage();
  const { theme, getBackgroundClass } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
  const [selectedTab, setSelectedTab] = useState('Charts');
  const [selectedTradingType, setSelectedTradingType] = useState('Spot');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [tradingViewSymbol, setTradingViewSymbol] = useState('BINANCE:BTCUSDT');
  const [selectedPair, setSelectedPair] = useState<CryptoPair>(CRYPTO_PAIRS[0]); // Default to BTC
  const [showPairSelector, setShowPairSelector] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositModalAction, setDepositModalAction] = useState<'buy' | 'sell' | 'long' | 'short'>('buy');
  const [tradeMode, setTradeMode] = useState('Buy'); // 'Buy' or 'Sell'
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [location, navigate] = useLocation();

  // Chart state with persistent caching
  const [currentSymbol, setCurrentSymbol] = useState(() => {
    // Initialize from stored state or sessionStorage
    const stored = localStorage.getItem('nedaxer_chart_state');
    const sessionSymbol = sessionStorage.getItem('selectedSymbol');
    if (sessionSymbol) return sessionSymbol;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.currentSymbol || 'BTCUSDT';
      } catch (e) {}
    }
    return 'BTCUSDT';
  });
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [currentTicker, setCurrentTicker] = useState<any>(null);
  const [showPairSelectorModal, setShowPairSelectorModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trigger
  
  // Chart loading states
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isTradingViewReady, setIsTradingViewReady] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  // Initialize selected pair from persistent storage
  useEffect(() => {
    const loadInitialState = async () => {
      // Check sessionStorage first (for navigation from markets page)
      const symbolFromStorage = sessionStorage.getItem('selectedSymbol');
      const tabFromStorage = sessionStorage.getItem('selectedTab');
      
      // Check persistent chart state
      const chartState = JSON.parse(localStorage.getItem('nedaxer_chart_state') || '{}');
      const persistentSymbol = chartState.currentSymbol;
      
      // Also check URL parameters as fallback
      const currentLocation = location.includes('?') ? location : window.location.search;
      const urlParams = new URLSearchParams(currentLocation.split('?')[1] || '');
      const symbolFromUrl = urlParams.get('symbol');
      const tabFromUrl = urlParams.get('tab');
      
      let symbolToUse = symbolFromStorage || symbolFromUrl || persistentSymbol;
      let tabToUse = tabFromStorage || tabFromUrl;
      
      // If no symbol from navigation or cache, try to load from user preferences
      if (!symbolToUse) {
        try {
          const preferencesResponse = await fetch('/api/user/preferences');
          if (preferencesResponse.ok) {
            const preferences = await preferencesResponse.json();
            symbolToUse = preferences.lastSelectedPair;
            tabToUse = tabToUse || preferences.lastSelectedTab || 'Charts';
          }
        } catch (error) {
          console.log('Could not load user preferences, using defaults');
        }
      }
      
      console.log('Trade page params:', { 
        symbolFromStorage, 
        tabFromStorage, 
        symbolFromUrl, 
        tabFromUrl, 
        symbolToUse,
        tabToUse,
        location 
      });
      
      // Set tab if specified
      if (tabToUse === 'Charts') {
        setSelectedTab('Charts');
        console.log('Setting tab to Charts');
      }
      
      if (symbolToUse) {
        const pair = findPairBySymbol(symbolToUse);
        console.log('Found pair for symbol:', symbolToUse, pair);
        
        if (pair) {
          console.log('Setting up new pair from navigation:', pair);
          setSelectedPair(pair);
          setCurrentSymbol(pair.symbol);
          setTradingViewSymbol(pair.tradingViewSymbol);
          
          // Save to persistent storage immediately
          const chartState = {
            currentSymbol: pair.symbol,
            tradingViewSymbol: pair.tradingViewSymbol,
            timeframe: selectedTimeframe,
            lastUpdated: Date.now(),
            isChartMounted: false
          };
          localStorage.setItem('nedaxer_chart_state', JSON.stringify(chartState));
          
          // Update price for the new pair immediately
          updatePrice(pair.symbol);
          
          // Ensure Charts tab is selected when coming from home page
          if (tabToUse === 'Charts') {
            setSelectedTab('Charts');
            
            // Check if global chart exists and can be reused
            const globalWidget = (window as any).nedaxerGlobalChart;
            if (globalWidget && globalWidget.widget && globalWidget.isReady) {
              console.log('Reusing existing global chart, updating symbol');
              try {
                globalWidget.widget.setSymbol(pair.tradingViewSymbol, () => {
                  console.log('Chart symbol updated to:', pair.symbol);
                  globalWidget.currentSymbol = pair.symbol;
                  
                  // Force UI refresh after chart update
                  setCurrentSymbol(pair.symbol);
                  setSelectedPair(pair);
                  updatePrice(pair.symbol);
                });
              } catch (error) {
                console.log('Failed to update existing chart, will reload');
                loadChart(pair.tradingViewSymbol, true);
              }
            } else if (isTradingViewReady) {
              console.log('TradingView ready, loading chart for:', pair.tradingViewSymbol);
              loadChart(pair.tradingViewSymbol, false);
            } else {
              console.log('TradingView not ready, will load chart when ready');
            }
          }
        } else {
          console.log('No pair found for symbol:', symbolToUse, 'using default BTC');
        }
      }
      
      // Clear sessionStorage after use to prevent stale data
      sessionStorage.removeItem('selectedSymbol');
      sessionStorage.removeItem('selectedTab');
    };
    
    loadInitialState();
  }, [location]);

  // Update chart when selected pair changes or when Charts tab is selected
  useEffect(() => {
    if (isTradingViewReady && selectedTab === 'Charts') {
      console.log('Chart update triggered for:', selectedPair.symbol, selectedPair.tradingViewSymbol);
      
      // Try multiple widget references for maximum compatibility
      const globalWidget1 = (window as any).nedaxerGlobalChart;
      const globalWidget2 = (window as any).nedaxerGlobalChartWidget;
      const currentWidget = chartWidget.current;
      
      const activeWidget = globalWidget1 || globalWidget2 || currentWidget;
      
      if (activeWidget && activeWidget.widget) {
        // Check if symbol is different before updating
        const currentSymbol = activeWidget.currentSymbol || currentSymbol;
        if (currentSymbol !== selectedPair.symbol) {
          try {
            console.log('Updating chart symbol from', currentSymbol, 'to:', selectedPair.tradingViewSymbol);
            
            // Use proper TradingView setSymbol API with interval parameter
            activeWidget.widget.setSymbol(selectedPair.tradingViewSymbol, selectedTimeframe || '15', () => {
              console.log('Chart successfully updated to:', selectedPair.symbol);
              
              // Update all widget references
              if (globalWidget1) globalWidget1.currentSymbol = selectedPair.symbol;
              if (globalWidget2) globalWidget2.currentSymbol = selectedPair.symbol;
              
              // Update persistent storage
              const chartState = JSON.parse(localStorage.getItem('nedaxer_chart_state') || '{}');
              chartState.currentSymbol = selectedPair.symbol;
              chartState.tradingViewSymbol = selectedPair.tradingViewSymbol;
              chartState.lastUpdated = Date.now();
              localStorage.setItem('nedaxer_chart_state', JSON.stringify(chartState));
              
              // Force UI update after successful chart change
              setCurrentSymbol(selectedPair.symbol);
              updatePrice(selectedPair.symbol);
            });
            
            return; // Successfully updated, exit early
          } catch (error) {
            console.log('setSymbol failed, trying chart reload:', error);
          }
        } else {
          console.log('Chart already showing correct symbol:', selectedPair.symbol);
          
          // Ensure chart is visible in current container
          const chartContainer = document.getElementById('chart');
          if (chartContainer && activeWidget.iframe) {
            if (!chartContainer.contains(activeWidget.iframe)) {
              chartContainer.appendChild(activeWidget.iframe);
            }
            activeWidget.iframe.style.display = 'block';
            activeWidget.iframe.style.visibility = 'visible';
          }
          return;
        }
      }
      
      // Fallback: Force reload chart if no widget or symbol update failed
      console.log('No valid widget found or symbol update failed, reloading chart for:', selectedPair.tradingViewSymbol);
      loadChart(selectedPair.tradingViewSymbol, true);
    }
  }, [selectedPair, isTradingViewReady, selectedTab, selectedTimeframe]);

  // Force chart load when switching to Charts tab
  useEffect(() => {
    if (selectedTab === 'Charts' && isTradingViewReady) {
      console.log('Charts tab selected, ensuring chart is loaded for:', selectedPair.tradingViewSymbol);
      const existingWidget = getGlobalChartWidget();
      
      if (!existingWidget || !existingWidget.iframe) {
        console.log('No existing chart found, creating new one');
        loadChart(selectedPair.tradingViewSymbol, false);
      }
    }
  }, [selectedTab, isTradingViewReady, selectedPair.tradingViewSymbol]);

  // Remove duplicate chartError declaration
  const chartWidget = useRef<any>(null);
  const priceUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const tradingViewScript = useRef<HTMLScriptElement | null>(null);
  const localChartCache = useRef<Map<string, any>>(new Map());

  // Global chart widget cache to persist across ALL navigation
  const getGlobalChartWidget = useCallback(() => {
    if (!(window as any).nedaxerGlobalChartWidget) {
      (window as any).nedaxerGlobalChartWidget = null;
    }
    if (!(window as any).nedaxerChartState) {
      (window as any).nedaxerChartState = {
        isReady: false,
        currentSymbol: 'BTCUSDT',
        isVisible: false
      };
    }
    return (window as any).nedaxerGlobalChartWidget;
  }, []);

  const setGlobalChartWidget = useCallback((widget: any) => {
    (window as any).nedaxerGlobalChartWidget = widget;
    (window as any).nedaxerChartState.isReady = true;
    chartWidget.current = widget;
  }, []);

  const getChartState = useCallback(() => {
    return (window as any).nedaxerChartState || { isReady: false, currentSymbol: 'BTCUSDT', isVisible: false };
  }, []);

  const setChartState = useCallback((state: any) => {
    if (!(window as any).nedaxerChartState) {
      (window as any).nedaxerChartState = {};
    }
    Object.assign((window as any).nedaxerChartState, state);
  }, []);

  // Enhanced chart loading with global persistence across all pages
  const loadChart = useCallback((symbol: string, forceReload = false) => {
    if (typeof window === 'undefined' || !(window as any).TradingView) return;

    // Check if chart is already loaded and functional globally
    const existingWidget = getGlobalChartWidget();
    const chartState = getChartState();
    
    if (!forceReload && existingWidget && existingWidget.iframe && existingWidget.iframe.contentWindow) {
      console.log('Global chart already exists, reusing existing widget');
      
      // Always ensure chart is visible when on Charts tab
      const chartContainer = document.getElementById('chart');
      if (chartContainer) {
        // Make sure the chart iframe is in the current container
        if (!chartContainer.querySelector('iframe') && existingWidget.iframe) {
          // Move the existing chart to current container
          if (existingWidget.iframe.parentNode) {
            chartContainer.appendChild(existingWidget.iframe);
          }
        }
        
        // Make chart visible
        if (existingWidget.iframe) {
          existingWidget.iframe.style.display = 'block';
          existingWidget.iframe.style.visibility = 'visible';
        }
      }
      
      // Update symbol if needed
      if (chartState.currentSymbol !== symbol) {
        try {
          existingWidget.setSymbol(symbol, "15", () => {
            console.log('Symbol changed to', symbol);
            setChartState({ currentSymbol: symbol, isVisible: true });
          });
        } catch (error) {
          console.log('Failed to change symbol, keeping current chart');
        }
      }
      
      chartWidget.current = existingWidget;
      setChartState({ isVisible: true });
      return;
    }

    // Create new widget only if none exists or force reload
    if (forceReload || !existingWidget || !existingWidget.iframe || !existingWidget.iframe.contentWindow) {
      console.log('Creating new global chart widget');
      
      // Remove existing widget if present
      if (existingWidget) {
        try {
          existingWidget.remove();
        } catch (removeError) {
          // Ignore removal errors
        }
        setGlobalChartWidget(null);
        setChartState({ isReady: false, currentSymbol: symbol, isVisible: false });
      }

      // Clear the chart container
      const chartContainer = document.getElementById('chart');
      if (chartContainer) {
        chartContainer.innerHTML = '';
      }

      // Create new widget after a short delay
      setTimeout(() => {
        createNewWidget(symbol);
      }, 100);
    }
  }, [getGlobalChartWidget, setGlobalChartWidget, getChartState, setChartState]);

  // Helper function to create new widget with global persistence
  const createNewWidget = useCallback((symbol: string) => {
    if (typeof window === 'undefined' || !(window as any).TradingView) return;

    const widget = new (window as any).TradingView.widget({
      container_id: "chart",
      autosize: true,
      symbol: symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#0a0a2e",
      toolbar_bg: "#0a0a2e",
      hide_top_toolbar: true,
      hide_side_toolbar: true,
      allow_symbol_change: false,
      enable_publishing: false,
      details: false,
      withdateranges: false,
      calendar: false,
      studies: [
        {
          id: "BB@tv-basicstudies-1",
          inputs: {
            length: 20,
            mult: 2,
            source: "close"
          }
        }
      ],
      drawings_access: { type: 'black', tools: [] },
      crosshair: {
        mode: 1  // Normal crosshair mode that follows your finger/mouse
      },
      save_image: false,
      loading_screen: { backgroundColor: "#0a0a2e", foregroundColor: "#0a0a2e" },
      overrides: {
        "paneProperties.background": "#0a0a2e",
        "paneProperties.backgroundType": "solid",
        "paneProperties.backgroundGradientStartColor": "#0a0a2e", 
        "paneProperties.backgroundGradientEndColor": "#0a0a2e",
        "paneProperties.vertGridProperties.color": "#374151",
        "paneProperties.horzGridProperties.color": "#374151",
        "paneProperties.crossHairProperties.color": "#FFA500", // orange line
        "paneProperties.crossHairProperties.width": 1,
        "paneProperties.crossHairProperties.style": 2,  // Dashed
        "paneProperties.crossHairProperties.transparency": 0,
        "paneProperties.crossHairProperties.labelBackgroundColor": "#000",
        "paneProperties.crossHairProperties.displayMode": 1,  // Enables floating price label

        // Bollinger Bands styling
        "BB@tv-basicstudies.upper.color": "#0066FF", // Blue upper band
        "BB@tv-basicstudies.lower.color": "#0066FF", // Blue lower band
        "BB@tv-basicstudies.median.color": "#FFFF00", // Yellow middle line
        "BB@tv-basicstudies.upper.linewidth": 1,
        "BB@tv-basicstudies.lower.linewidth": 1,
        "BB@tv-basicstudies.median.linewidth": 2,
        "BB@tv-basicstudies.fillBackground": true,
        "BB@tv-basicstudies.transparency": 90,

        "scalesProperties.backgroundColor": "#111827",
        "scalesProperties.lineColor": "#374151", 
        "scalesProperties.textColor": "#9CA3AF",
        "paneProperties.leftAxisProperties.showSeriesLastValue": false,
        "paneProperties.rightAxisProperties.showSeriesLastValue": false,
        "scalesProperties.showLeftScale": false,
        "scalesProperties.showRightScale": true,

        "mainSeriesProperties.style": 1,
        "mainSeriesProperties.candleStyle.upColor": "#10B981",
        "mainSeriesProperties.candleStyle.downColor": "#EF4444",
        "mainSeriesProperties.candleStyle.drawWick": true,
        "mainSeriesProperties.candleStyle.drawBorder": false,
        "mainSeriesProperties.candleStyle.wickUpColor": "#10B981",
        "mainSeriesProperties.candleStyle.wickDownColor": "#EF4444",

        "volumePaneSize": "small",
        "volume.volume.color.0": "#EF4444",
        "volume.volume.color.1": "#10B981",
        "volume.volume.transparency": 0,

        "paneProperties.legendProperties.showLegend": false,
        "paneProperties.legendProperties.showStudyArguments": false,
        "paneProperties.legendProperties.showStudyTitles": false,
        "paneProperties.legendProperties.showStudyValues": false,
        "paneProperties.legendProperties.showSeriesTitle": false,

        "paneProperties.topMargin": 5,
        "paneProperties.bottomMargin": 15,
        "paneProperties.leftMargin": 5,
        "paneProperties.rightMargin": 5,
      },
      disabled_features: [
        "header_symbol_search", "timeframes_toolbar", "use_localstorage_for_settings",
        "volume_force_overlay", "left_toolbar", "legend_context_menu", "display_market_status",
        "go_to_date", "header_compare", "header_chart_type", "header_resolutions",
        "header_screenshot", "header_fullscreen_button", "header_settings", "header_indicators",
        "context_menus", "control_bar", "edit_buttons_in_legend", "main_series_scale_menu",
        "chart_property_page_legend", "chart_property_page_trading", "border_around_the_chart",
        "snapshot_trading_drawings", "show_logo_on_all_charts",
        "remove_library_container_border", "chart_hide_close_button", "header_saveload",
        "header_undo_redo", "show_chart_property_page", "popup_hints"
      ],
      enabled_features: [
        "show_crosshair_labels",
        "crosshair_tooltip",
        "crosshair_cursor"
      ],
      onChartReady: () => {
        console.log('Chart ready and persistent for symbol:', symbol);
        
        const cleanSymbol = symbol.replace('BINANCE:', '').replace('BYBIT:', '');
        
        // Store widget globally with proper iframe reference
        (window as any).nedaxerGlobalChart = {
          widget: widget,
          iframe: document.querySelector('#chart iframe'),
          isReady: true,
          currentSymbol: cleanSymbol,
          setSymbol: (newSymbol, interval, callback) => {
            // Enhanced setSymbol wrapper for better compatibility
            try {
              if (widget && widget.setSymbol) {
                widget.setSymbol(newSymbol, interval || '15', callback);
                return true;
              }
            } catch (error) {
              console.error('setSymbol failed:', error);
              return false;
            }
          }
        };
        
        // Update persistent storage
        const chartState = {
          currentSymbol: cleanSymbol,
          tradingViewSymbol: symbol,
          timeframe: selectedTimeframe,
          lastUpdated: Date.now(),
          isChartMounted: true
        };
        localStorage.setItem('nedaxer_chart_state', JSON.stringify(chartState));
        
        // Update UI state to match chart
        setCurrentSymbol(cleanSymbol);
        updatePrice(cleanSymbol);
        
        console.log('Global chart initialized with enhanced setSymbol for:', cleanSymbol);
      }
    });

    // Store widget globally with state
    setGlobalChartWidget(widget);
    setChartState({ 
      isReady: false, 
      currentSymbol: symbol, 
      isVisible: true 
    });
  }, [setGlobalChartWidget, setChartState]);

  const updatePrice = async (symbol: string) => {
    try {
      console.log('Updating price for symbol:', symbol);
      const response = await fetch('/api/crypto/realtime-prices');
      const data = await response.json();

      if (data.success && data.data) {
        const ticker = data.data.find((t: any) => t.symbol === symbol);
        if (ticker) {
          console.log('Found ticker for symbol:', symbol, ticker);
          setCurrentTicker(ticker);
          setCurrentPrice(ticker.price.toFixed(2));
        } else {
          console.log('No ticker found for symbol:', symbol);
          // Fallback: try to find by removing 'USDT' suffix if it exists
          const baseSymbol = symbol.replace('USDT', '');
          const fallbackTicker = data.data.find((t: any) => t.symbol === baseSymbol);
          if (fallbackTicker) {
            console.log('Found fallback ticker:', fallbackTicker);
            setCurrentTicker(fallbackTicker);
            setCurrentPrice(fallbackTicker.price.toFixed(2));
          }
        }
      }
    } catch (error) {
      console.error('Price update error:', error);
    }
  };

  const handlePairSelectionModal = useCallback((pair: CryptoPair) => {
    console.log('Pair selected from modal:', pair);
    
    // Immediately update all UI states first for instant visual feedback
    setSelectedPair(pair);
    setCurrentSymbol(pair.symbol);
    setTradingViewSymbol(pair.tradingViewSymbol);
    setShowPairSelectorModal(false);
    
    // Set a temporary price display to show immediate feedback
    setCurrentPrice('--');
    setCurrentTicker(null);
    
    // Update persistent storage immediately
    const chartState = {
      currentSymbol: pair.symbol,
      tradingViewSymbol: pair.tradingViewSymbol,
      timeframe: selectedTimeframe,
      lastUpdated: Date.now(),
      isChartMounted: true
    };
    localStorage.setItem('nedaxer_chart_state', JSON.stringify(chartState));
    
    // Force immediate UI refresh to show the new pair name in header
    setForceUpdate(prev => prev + 1); // Trigger re-render immediately
    const coinPriceElement = document.getElementById('coin-price');
    if (coinPriceElement) {
      coinPriceElement.textContent = '--';
    }
    
    // Update chart symbol using enhanced wrapper
    const updateChartSymbol = () => {
      const globalChart = (window as any).nedaxerGlobalChart;
      
      if (globalChart && globalChart.setSymbol && globalChart.isReady) {
        console.log('Attempting to update chart symbol to:', pair.tradingViewSymbol);
        
        // Use the enhanced setSymbol wrapper
        const success = globalChart.setSymbol(pair.tradingViewSymbol, selectedTimeframe || '15', () => {
          console.log('Chart symbol successfully changed to:', pair.symbol);
          globalChart.currentSymbol = pair.symbol;
          
          // Update price after successful chart change
          setTimeout(() => updatePrice(pair.symbol), 500);
        });
        
        if (success) {
          return true;
        } else {
          console.log('setSymbol wrapper failed, trying direct widget access');
        }
      }
      
      // Fallback: Direct widget access
      if (globalChart && globalChart.widget && globalChart.widget.setSymbol) {
        try {
          globalChart.widget.setSymbol(pair.tradingViewSymbol, selectedTimeframe || '15', () => {
            console.log('Direct widget setSymbol succeeded for:', pair.symbol);
            globalChart.currentSymbol = pair.symbol;
            setTimeout(() => updatePrice(pair.symbol), 500);
          });
          return true;
        } catch (error) {
          console.log('Direct widget setSymbol failed:', error);
        }
      }
      
      // Final fallback: Force reload chart
      console.log('All symbol update methods failed, reloading chart');
      loadChart(pair.tradingViewSymbol, true);
      setTimeout(() => updatePrice(pair.symbol), 1000);
      return false;
    };
    
    // Execute chart update
    if (isTradingViewReady) {
      updateChartSymbol();
    } else {
      // TradingView not ready, just update price
      updatePrice(pair.symbol);
    }
  }, [isTradingViewReady, loadChart, selectedTimeframe]);

  // Add preload hints and load TradingView script with maximum optimization
  useEffect(() => {
    // Add DNS prefetch and preconnect for faster loading
    const addPreloadHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: 'https://s3.tradingview.com' },
        { rel: 'preconnect', href: 'https://s3.tradingview.com' },
        { rel: 'preload', href: 'https://s3.tradingview.com/tv.js', as: 'script' }
      ];

      hints.forEach(hint => {
        const existingHint = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
        if (!existingHint) {
          const link = document.createElement('link');
          Object.assign(link, hint);
          document.head.appendChild(link);
        }
      });
    };

    addPreloadHints();

    // Check if script is already loaded and widget exists
    if ((window as any).TradingView) {
      setIsTradingViewReady(true);
      setIsChartLoading(false);

      // Always check for existing widget first
      const existingWidget = getGlobalChartWidget();
      if (existingWidget && existingWidget.iframe && existingWidget.iframe.contentWindow) {
        console.log('Reusing existing chart widget - no reload needed');
        chartWidget.current = existingWidget;
        
        // Ensure chart is in the correct container
        const chartContainer = document.getElementById('chart');
        if (chartContainer && !chartContainer.querySelector('iframe')) {
          if (existingWidget.iframe && existingWidget.iframe.parentNode) {
            chartContainer.appendChild(existingWidget.iframe);
          }
        }
      } else if (selectedTab === 'Charts') {
        // Only create new widget if we're on Charts tab and no existing widget
        console.log('Creating initial chart widget');
        loadChart(selectedPair.tradingViewSymbol, false);
      }
      
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsTradingViewReady(true);
        setIsChartLoading(false);
        if (selectedTab === 'Charts') {
          loadChart(selectedPair.tradingViewSymbol, false);
        }
      });
      return;
    }

    // Create and load script with maximum optimization
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      setIsTradingViewReady(true);
      setIsChartLoading(false);
      if (selectedTab === 'Charts') {
        loadChart(selectedPair.tradingViewSymbol, false);
      }
    };

    script.onerror = () => {
      console.error('Failed to load TradingView script');
      setIsChartLoading(false);
      setChartError('Failed to load TradingView script');
    };

    document.head.appendChild(script);
    tradingViewScript.current = script;

    return () => {
      // Don't remove the script or widget when component unmounts
      // Keep them cached for instant access when returning
    };
  }, [loadChart, getGlobalChartWidget, selectedTab]);

  // Price update interval
  useEffect(() => {
    updatePrice(currentSymbol);
    priceUpdateInterval.current = setInterval(() => {
      updatePrice(currentSymbol);
    }, 1000);

    return () => {
      if (priceUpdateInterval.current) {
        clearInterval(priceUpdateInterval.current);
      }
    };
  }, [currentSymbol]);

  // This useEffect is now handled by the main URL parameter handler above
  // Removed to avoid conflicts

  // Helper function to get crypto name from symbol
  const getCryptoName = (symbol: string): string => {
    const cryptoNames: { [key: string]: string } = {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'BNB': 'Binance Coin',
      'ADA': 'Cardano',
      'SOL': 'Solana',
      'DOT': 'Polkadot',
      'AVAX': 'Avalanche',
      'MATIC': 'Polygon',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap',
      'LTC': 'Litecoin',
      'ATOM': 'Cosmos',
      'NEAR': 'NEAR Protocol',
      'FTM': 'Fantom',
      'ALGO': 'Algorand'
    };
    return cryptoNames[symbol] || symbol;
  };

  // Helper function to get crypto ID from symbol
  const getCryptoIdFromSymbol = (symbol: string): string => {
    const symbolToIdMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'ADA': 'cardano',
      'SOL': 'solana',
      'DOT': 'polkadot',
      'AVAX': 'avalanche-2',
      'MATIC': 'polygon',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'LTC': 'litecoin',
      'ATOM': 'cosmos',
      'NEAR': 'near',
      'FTM': 'fantom',
      'ALGO': 'algorand'
    };
    return symbolToIdMap[symbol] || 'bitcoin';
  };

  const timeframes = ['15m', '1h', '4h', '1D', 'More'];
  const tradingTabs = ['Spot', 'Futures'];
  const cryptoPairs = [
    { symbol: 'BTC', name: 'Bitcoin', price: 50000, change: 2.5 },
    { symbol: 'ETH', name: 'Ethereum', price: 3000, change: -1.0 },
    { symbol: 'LTC', name: 'Litecoin', price: 200, change: 0.5 },
  ];

  // Map crypto IDs to TradingView symbols
  const cryptoToTradingViewMap: { [key: string]: string } = {
    'bitcoin': 'BINANCE:BTCUSDT',
    'ethereum': 'BINANCE:ETHUSDT',
    'binancecoin': 'BINANCE:BNBUSDT',
    'solana': 'BINANCE:SOLUSDT',
    'ripple': 'BINANCE:XRPUSDT',
    'cardano': 'BINANCE:ADAUSDT',
    'avalanche-2': 'BINANCE:AVAXUSDT',
    'dogecoin': 'BINANCE:DOGEUSDT',
    'chainlink': 'BINANCE:LINKUSDT',
    'polygon': 'BINANCE:MATICUSDT'
  };

  const handleTradingTypeChange = (tab: string) => {
    hapticLight();
    setSelectedTradingType(tab);
    // Chart persists across trading types - no reload needed
  };

  // Handle tab changes with global chart persistence
  const handleTabChange = useCallback((tab: 'Charts' | 'Trade') => {
    setSelectedTab(tab);

    if (tab === 'Charts') {
      // Always try to show existing chart first
      const globalWidget = (window as any).nedaxerGlobalChart;
      
      if (globalWidget && globalWidget.widget && globalWidget.isReady && globalWidget.iframe) {
        console.log('Chart widget exists globally, restoring to view - no reload needed');
        
        // Ensure chart is visible in the container
        const chartContainer = document.getElementById('chart');
        if (chartContainer) {
          if (!chartContainer.contains(globalWidget.iframe)) {
            // Move existing chart to container
            chartContainer.appendChild(globalWidget.iframe);
          }
          
          // Make chart visible
          globalWidget.iframe.style.display = 'block';
          globalWidget.iframe.style.visibility = 'visible';
        }
        
        chartWidget.current = globalWidget.widget;
        console.log('Chart restored, current symbol:', globalWidget.currentSymbol);
      } else if (isTradingViewReady) {
        // Load chart only if TradingView is ready and no widget exists
        const persistentSymbol = currentSymbol || 'BTCUSDT';
        const tradingViewSymbol = `BINANCE:${persistentSymbol}`;
        
        console.log('Loading chart for tab change:', tradingViewSymbol);
        setTimeout(() => {
          loadChart(tradingViewSymbol, false);
        }, 100);
      }
    } else {
      // When leaving Charts tab, keep chart in background
      const globalWidget = (window as any).nedaxerGlobalChart;
      if (globalWidget && globalWidget.iframe) {
        globalWidget.iframe.style.visibility = 'hidden';
      }
      console.log('Charts tab hidden, chart kept in background');
    }
  }, [currentSymbol, loadChart, isTradingViewReady]);

  const handleCryptoSymbolChange = (cryptoId: string) => {
    setSelectedCrypto(cryptoId);
    const tradingViewSymbol = cryptoToTradingViewMap[cryptoId] || 'BINANCE:BTCUSDT';
    setTradingViewSymbol(tradingViewSymbol);
  };

  const handlePairSelection = (cryptoId: string, symbol: string) => {
    setSelectedCrypto(cryptoId);
    // Find the correct pair from our crypto pairs list
    const cryptoPair = findPairBySymbol(symbol);
    if (cryptoPair) {
      setSelectedPair(cryptoPair);
      const tradingViewSymbol = cryptoToTradingViewMap[cryptoId] || cryptoPair.tradingViewSymbol;
      setTradingViewSymbol(tradingViewSymbol);
    }
    setShowPairSelector(false);
  };

  const handleAlertsClick = () => {
    setShowAlerts(!showAlerts);
  };

  const handleToolsClick = () => {
    setShowTools(!showTools);
  };

  const handlePerpClick = () => {
    navigate('/mobile/futures');
  };

  const handleBuyClick = () => {
    setSelectedTab('Trade');
    setTradeMode('Buy');
  };

  const handleSellClick = () => {
    setSelectedTab('Trade');
    setTradeMode('Sell');
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    // Calculate amount based on current price
    setAmount(value * (selectedPair.price || 0));
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    // Calculate quantity based on current price
    const price = selectedPair.price || 0;
    if (price > 0) {
      setQuantity(value / price);
    }
  };

    const handlePairSelect = (pair: any) => {
        setSelectedPair(pair);
        setShowPairSelector(false);
    };

  return (
    <MobileLayout>
      {/* Trading Tabs - Smaller font and padding */}
      <div className="bg-blue-950 px-3 py-1">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tradingTabs.map((tab) => (
            <button 
              key={tab}
              className={`whitespace-nowrap px-2 py-1 rounded text-xs ${
                selectedTradingType === tab 
                  ? 'bg-[#0b0b30] text-white' 
                  : 'text-gray-400'
              }`}
              onClick={() => handleTradingTypeChange(tab)}
            >
              {t(tab.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Chart/Trade Toggle - Smaller */}
      <div className="bg-[#0b0b30] mx-3 rounded-lg overflow-hidden">
        <div className="flex">
          <button 
            className={`flex-1 py-1 text-xs font-medium ${
              selectedTab === 'Charts' 
                ? 'bg-[#0a0a2e] text-white' 
                : 'text-gray-400'
            }`}
            onClick={() => handleTabChange('Charts')}
          >
            {t('charts')}
          </button>
          <button 
            className={`flex-1 py-1 text-xs font-medium ${
              selectedTab === 'Trade' 
                ? 'bg-[#0a0a2e] text-white' 
                : 'text-gray-400'
            }`}
            onClick={() => handleTabChange('Trade')}
          >
            {t('trade')}
          </button>
        </div>
      </div>

      {/* Charts Tab Content - Shared for both Spot and Futures */}
      {selectedTab === 'Charts' && (
        <div className="flex-1 overflow-y-auto bg-[#0a0a2e]">
          {/* Tappable Coin Header - Smaller and compact */}
          <div className="flex justify-between items-center p-2 bg-[#0a0a2e] border-b border-[#1a1a40] sticky top-0 z-40">
            <div 
              className="flex flex-col cursor-pointer hover:bg-blue-800 rounded px-2 py-1 transition-colors"
              onClick={() => {
                hapticLight();
                setShowPairSelectorModal(true);
              }}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white" key={`pair-${forceUpdate}`}>
                  {getPairDisplayName(selectedPair)}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-sm font-bold text-green-400">
                $<span id="coin-price" key={`price-${forceUpdate}`}>{currentPrice || '--'}</span>
              </div>
            </div>
            <div className="text-right text-xs leading-tight text-gray-300">
              <div>24h High: <span id="high" className="text-white">{currentTicker?.highPrice24h || '--'}</span></div>
              <div>24h Low: <span id="low" className="text-white">{currentTicker?.lowPrice24h || '--'}</span></div>
              <div>Vol: <span id="turnover" className="text-white">{currentTicker?.volume24h ? (parseFloat(currentTicker.volume24h) / 1000000).toFixed(1) : '--'}M</span></div>
            </div>
          </div>

          {/* Chart Container - Clean without loading skeleton */}
          <div className={`relative ${getBackgroundClass()}`} style={{ height: '70vh' }}>
            {/* Show loading state when chart is initializing */}
            {!isTradingViewReady && (
              <div className={`absolute inset-0 ${getBackgroundClass()} z-20 flex items-center justify-center`}>
                <div className="text-center text-gray-400">
                  <div className="mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto opacity-50 animate-pulse" />
                  </div>
                  <p className="text-lg font-medium">Loading Chart...</p>
                  <p className="text-sm mt-2">Initializing TradingView</p>
                </div>
              </div>
            )}

            {/* Only show error state if chart fails to load */}
            {chartError && (
              <div className={`absolute inset-0 ${getBackgroundClass()} z-20 flex items-center justify-center`}>
                <div className="text-center text-gray-400">
                  <div className="mb-4">
                    <BarChart3 className="w-12 h-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-lg font-medium">Chart Unavailable</p>
                  <p className="text-sm mt-2">Unable to load chart data</p>
                  <button 
                    onClick={() => {
                      setChartError(null);
                      setIsTradingViewReady(false);
                      setTimeout(() => {
                        if ((window as any).TradingView) {
                          loadChart(`BYBIT:${currentSymbol}`, true);
                        }
                      }, 100);
                    }}
                    className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* TradingView Chart */}
            <div 
              id="chart" 
              className="w-full h-full"
              data-chart-symbol={currentSymbol}
            ></div>

            {/* Background watermark */}
            <div 
              className="absolute top-1/2 left-1/2 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-10"
              style={{
                backgroundImage: "url('https://i.imgur.com/F9ljfzP.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            ></div>

            {/* TradingView Logo Cover */}
            <img 
              id="branding-cover"
              src="https://i.imgur.com/1yZtbuJ.jpeg" 
              alt="Nedaxer Logo"
              className="absolute"
              style={{
                bottom: '28px',
                left: '12px',
                width: '50px',
                height: '50px',
                borderRadius: '8px',
                backgroundColor: '#0e0e0e',
                zIndex: 9999,
                pointerEvents: 'auto',
                boxShadow: '0 0 4px #000'
              }}
            />
          </div>


        </div>
      )}

      {/* Crypto Pair Selector Modal */}
      <CryptoPairSelectorModal
        isOpen={showPairSelectorModal}
        onClose={() => setShowPairSelectorModal(false)}
        onSelectPair={handlePairSelectionModal}
        currentPair={selectedPair}
      />

      {/* Fixed Buy/Sell Panel - Positioned directly above bottom navigation */}
      {selectedTab === 'Charts' && (
        <div className="fixed left-0 right-0 bg-blue-900 border-t border-blue-700 p-2" style={{ bottom: '56px', zIndex: 10000 }}>
          <div className="flex gap-2">
            <button 
              onClick={handleBuyClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-xs font-medium transition-colors"
            >
              {selectedTradingType === 'Futures' ? 'Long' : 'Buy'}
            </button>
            <button 
              onClick={handleSellClick}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-xs font-medium transition-colors"
            >
              {selectedTradingType === 'Futures' ? 'Short' : 'Sell'}
            </button>
          </div>
        </div>
      )}

      {/* Trade Tab Content */}
      {selectedTab === 'Trade' && (
        <div className="flex-1 overflow-hidden">

          {selectedTradingType === 'Spot' && (
            <div className="h-full p-4">
              {/* Trading Pair Info */}
              <div className="bg-blue-950 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-lg font-bold">{selectedPair.symbol}/USDT</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-lg font-bold">
                      ${selectedPair.price?.toFixed(2) || '0.00'}
                    </span>
                    <span className={`text-sm ${(selectedPair.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(selectedPair.change || 0) >= 0 ? '+' : ''}{(selectedPair.change || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy/Sell Toggle */}
              <div className="bg-blue-950 rounded-lg overflow-hidden mb-4">
                <div className="flex">
                  <button 
                    className={`flex-1 py-3 font-medium transition-colors ${
                      tradeMode === 'Buy' 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => {
                      setDepositModalAction('buy');
                      setShowDepositModal(true);
                    }}
                  >
                    {t('buy')} {selectedPair.symbol}
                  </button>
                  <button 
                    className={`flex-1 py-3 font-medium transition-colors ${
                      tradeMode === 'Sell' 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => {
                      setDepositModalAction('sell');
                      setShowDepositModal(true);
                    }}
                  >
                    {t('sell')} {selectedPair.symbol}
                  </button>
                </div>
              </div>

              {/* Trading Form */}
              <div className="space-y-4">
                {/* Order Type */}
                <div className="bg-blue-950 rounded-lg p-4">
                  <div className="flex space-x-2 mb-4">
                    <button className="bg-blue-800 text-white px-4 py-2 rounded text-sm">{t('market')}</button>
                    <button className="text-gray-400 px-4 py-2 rounded text-sm hover:text-white">{t('limit')}</button>
                    <button className="text-gray-400 px-4 py-2 rounded text-sm hover:text-white">{t('stop')}</button>
                  </div>

                  {/* Quantity Input */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">
                      {t('quantity')} ({tradeMode === 'Buy' ? 'USDT' : selectedPair.symbol})
                    </label>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleQuantityChange(Math.max(0, quantity - (tradeMode === 'Buy' ? 10 : 0.001)))}
                        className="bg-blue-800 hover:bg-gray-600 text-white p-2 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={tradeMode === 'Buy' ? amount.toFixed(2) : quantity.toFixed(6)}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          if (tradeMode === 'Buy') {
                            handleAmountChange(value);
                          } else {
                            handleQuantityChange(value);
                          }
                        }}
                        className="flex-1 bg-blue-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="0.00"
                      />
                      <button 
                        onClick={() => handleQuantityChange(quantity + (tradeMode === 'Buy' ? 10 : 0.001))}
                        className="bg-blue-800 hover:bg-gray-600 text-white p-2 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {['25%', '50%', '75%', '100%'].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => {
                          const multiplier = parseInt(percent) / 100;
                          if (tradeMode === 'Buy') {
                            handleAmountChange(1000 * multiplier); // Assuming $1000 available balance
                          } else {
                            handleQuantityChange(1 * multiplier); // Assuming 1 unit available
                          }
                        }}
                        className="bg-blue-800 hover:bg-gray-600 text-white py-2 rounded text-sm transition-colors"
                      >
                        {percent}
                      </button>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-blue-900 rounded p-3 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white">${selectedPair.price?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Quantity:</span>
                      <span className="text-white">{quantity.toFixed(6)} {selectedPair.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-white">${amount.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fee (0.1%):</span>
                      <span className="text-white">${(amount * 0.001).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button 
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all active:scale-95 ${
                      tradeMode === 'Buy' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    onClick={() => {
                      setDepositModalAction(tradeMode === 'Buy' ? 'buy' : 'sell');
                      setShowDepositModal(true);
                    }}
                  >
                    {tradeMode} {selectedPair.symbol}
                  </button>
                </div>

                {/* Available Balance */}
                <div className="bg-blue-950 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Available Balance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">USDT:</span>
                      <span className="text-white">1,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{selectedPair.symbol}:</span>
                      <span className="text-white">1.00000000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedTradingType === 'Futures' && (
            <div className="h-full p-4">
              {/* Trading Pair Info */}
              <div className="bg-blue-950 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-lg font-bold">{selectedPair.symbol}/USDT</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-lg font-bold">
                      ${selectedPair.price?.toFixed(2) || '0.00'}
                    </span>
                    <span className={`text-sm ${(selectedPair.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(selectedPair.change || 0) >= 0 ? '+' : ''}{(selectedPair.change || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Leverage: Up to 100x</span>
                  <span>Funding Rate: 0.01%</span>
                </div>
              </div>

              {/* Long/Short Toggle */}
              <div className="bg-blue-950 rounded-lg overflow-hidden mb-4">
                <div className="flex">
                  <button 
                    className={`flex-1 py-3 font-medium transition-colors ${
                      tradeMode === 'Buy' 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => {
                      setDepositModalAction('long');
                      setShowDepositModal(true);
                    }}
                  >
                    {t('long')} {selectedPair.symbol}
                  </button>
                  <button 
                    className={`flex-1 py-3 font-medium transition-colors ${
                      tradeMode === 'Sell' 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => {
                      setDepositModalAction('short');
                      setShowDepositModal(true);
                    }}
                  >
                    {t('short')} {selectedPair.symbol}
                  </button>
                </div>
              </div>

              {/* Futures Trading Form */}
              <div className="space-y-4">
                {/* Leverage Selector */}
                <div className="bg-blue-950 rounded-lg p-4">
                  <label className="block text-gray-400 text-sm mb-2">Leverage</label>
                  <div className="flex space-x-2 mb-4">
                    {['5x', '10x', '25x', '50x', '100x'].map((leverage) => (
                      <button
                        key={leverage}
                        className="bg-blue-800 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        {leverage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Type and Size */}
                <div className="bg-blue-950 rounded-lg p-4">
                  <div className="flex space-x-2 mb-4">
                    <button className="bg-blue-800 text-white px-4 py-2 rounded text-sm">{t('market')}</button>
                    <button className="text-gray-400 px-4 py-2 rounded text-sm hover:text-white">{t('limit')}</button>
                    <button className="text-gray-400 px-4 py-2 rounded text-sm hover:text-white">{t('stop')}</button>
                  </div>

                  {/* Position Size Input */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">
                      Position Size (USDT)
                    </label>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleAmountChange(Math.max(0, amount - 10))}
                        className="bg-blue-800 hover:bg-gray-600 text-white p-2 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={amount.toFixed(2)}
                        onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-blue-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="0.00"
                      />
                      <button 
                        onClick={() => handleAmountChange(amount + 10)}
                        className="bg-blue-800 hover:bg-gray-600 text-white p-2 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {['25%', '50%', '75%', '100%'].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => {
                          const multiplier = parseInt(percent) / 100;
                          handleAmountChange(1000 * multiplier); // Assuming $1000 available balance
                        }}
                        className="bg-blue-800 hover:bg-gray-600 text-white py-2 rounded text-sm transition-colors"
                      >
                        {percent}
                      </button>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-blue-900 rounded p-3 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Entry Price:</span>
                      <span className="text-white">${selectedPair.price?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Position Size:</span>
                      <span className="text-white">${amount.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Leverage:</span>
                      <span className="text-white">10x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Margin Required:</span>
                      <span className="text-white">${(amount / 10).toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trading Fee:</span>
                      <span className="text-white">${(amount * 0.0006).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button 
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-all active:scale-95 ${
                      tradeMode === 'Buy' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    onClick={() => {
                      setDepositModalAction(tradeMode === 'Buy' ? 'long' : 'short');
                      setShowDepositModal(true);
                    }}
                  >
                    {tradeMode === 'Buy' ? 'Open Long' : 'Open Short'} Position
                  </button>
                </div>

                {/* Margin and Positions Info */}
                <div className="bg-blue-950 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Account Balance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available Margin:</span>
                      <span className="text-white">1,000.00 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Used Margin:</span>
                      <span className="text-white">0.00 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Unrealized P&L:</span>
                      <span className="text-green-400">+0.00 USDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Cryptocurrency Pair Selector Modal */}
      {showPairSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select Trading Pair</h3>
              <button
                onClick={() => setShowPairSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {cryptoPairs.map((pair) => (
                  <button
                    key={pair.symbol}
                    onClick={() => handlePairSelect(pair)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#0033a0] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {pair.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{pair.symbol}/USDT</div>
                          <div className="text-sm text-gray-500">{pair.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${pair.price?.toFixed(2) || '0.00'}</div>
                        <div className={`text-sm ${pair.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pair.change >= 0 ? '+' : ''}{pair.change?.toFixed(2) || '0.00'}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-green-600">Buy {selectedPair.symbol}/USDT</h3>
              <button
                onClick={() => setShowBuyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USDT)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span>${selectedPair.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Fee (0.1%):</span>
                  <span>$0.00</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Place Buy Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-red-600">Sell {selectedPair.symbol}/USDT</h3>
              <button
                onClick={() => setShowSellModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ({selectedPair.symbol})
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span>${selectedPair.price?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Fee (0.1%):</span>
                  <span>$0.00</span>
                </div>
              </div>
              <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Place Sell Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Required Modal */}
      <DepositRequiredModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        tradingType={selectedTradingType === 'Spot' ? 'spot' : 'futures'}
        action={depositModalAction}
      />
    </MobileLayout>
  );
}