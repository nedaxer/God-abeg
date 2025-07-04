
import { useCallback } from 'react';

// Global chart state management
export const usePersistentChart = () => {
  
  const showChart = useCallback(() => {
    const existingWidget = (window as any).nedaxerGlobalChartWidget;
    const chartState = (window as any).nedaxerChartState;
    
    if (existingWidget && existingWidget.iframe) {
      // Find current chart container
      const chartContainer = document.getElementById('chart');
      if (chartContainer && !chartContainer.querySelector('iframe')) {
        // Move chart to current container
        chartContainer.appendChild(existingWidget.iframe);
      }
      
      // Make chart visible
      existingWidget.iframe.style.display = 'block';
      existingWidget.iframe.style.visibility = 'visible';
      
      // Update state
      if (chartState) {
        chartState.isVisible = true;
      }
      
      return true;
    }
    return false;
  }, []);

  const hideChart = useCallback(() => {
    const existingWidget = (window as any).nedaxerGlobalChartWidget;
    const chartState = (window as any).nedaxerChartState;
    
    if (existingWidget && existingWidget.iframe) {
      // Keep chart in DOM but hidden
      existingWidget.iframe.style.display = 'none';
      existingWidget.iframe.style.visibility = 'hidden';
      
      // Update state
      if (chartState) {
        chartState.isVisible = false;
      }
    }
  }, []);

  const isChartReady = useCallback(() => {
    const chartState = (window as any).nedaxerChartState;
    return chartState && chartState.isReady;
  }, []);

  const isChartVisible = useCallback(() => {
    const chartState = (window as any).nedaxerChartState;
    return chartState && chartState.isVisible;
  }, []);

  const getChartSymbol = useCallback(() => {
    const chartState = (window as any).nedaxerChartState;
    return chartState ? chartState.currentSymbol : 'BTCUSDT';
  }, []);

  return {
    showChart,
    hideChart,
    isChartReady,
    isChartVisible,
    getChartSymbol
  };
};
