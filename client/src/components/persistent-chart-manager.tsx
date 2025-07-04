
import React, { useEffect, useRef, useState } from 'react';

interface PersistentChartManagerProps {
  children: React.ReactNode;
  isActive: boolean;
  chartId: string;
}

// Global chart container management
const chartContainers = new Map<string, HTMLDivElement>();
const chartInstances = new Map<string, any>();
const chartStates = new Map<string, { symbol: string; ready: boolean }>();

// Global persistent container that stays in DOM
let globalChartContainer: HTMLDivElement | null = null;

// Initialize global chart container
const initializeGlobalContainer = () => {
  if (!globalChartContainer && typeof window !== 'undefined') {
    globalChartContainer = document.createElement('div');
    globalChartContainer.id = 'global-chart-container';
    globalChartContainer.style.position = 'fixed';
    globalChartContainer.style.top = '0';
    globalChartContainer.style.left = '0';
    globalChartContainer.style.width = '100%';
    globalChartContainer.style.height = '100%';
    globalChartContainer.style.zIndex = '-1';
    globalChartContainer.style.visibility = 'hidden';
    globalChartContainer.style.pointerEvents = 'none';
    
    // Add to body but keep hidden
    document.body.appendChild(globalChartContainer);
  }
  return globalChartContainer;
};

export function PersistentChartManager({ children, isActive, chartId }: PersistentChartManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize global container
    const globalContainer = initializeGlobalContainer();
    if (!globalContainer) return;

    // Get or create persistent container for this chart
    let persistentContainer = chartContainers.get(chartId);
    
    if (!persistentContainer) {
      // Create a new persistent container
      persistentContainer = document.createElement('div');
      persistentContainer.style.width = '100%';
      persistentContainer.style.height = '100%';
      persistentContainer.style.position = 'absolute';
      persistentContainer.style.top = '0';
      persistentContainer.style.left = '0';
      persistentContainer.id = `persistent-chart-${chartId}`;
      
      // Add to global container
      globalContainer.appendChild(persistentContainer);
      chartContainers.set(chartId, persistentContainer);
    }

    // Move persistent container to current mount point when active
    if (isActive) {
      // Make global container visible and interactive
      globalContainer.style.visibility = 'visible';
      globalContainer.style.pointerEvents = 'auto';
      globalContainer.style.position = 'static';
      globalContainer.style.zIndex = 'auto';
      
      // Move to current container
      if (persistentContainer.parentNode !== containerRef.current) {
        containerRef.current.appendChild(persistentContainer);
      }
      
      persistentContainer.style.display = 'block';
      setIsInitialized(true);
    } else {
      // Hide global container when not active
      globalContainer.style.visibility = 'hidden';
      globalContainer.style.pointerEvents = 'none';
      globalContainer.style.position = 'fixed';
      globalContainer.style.zIndex = '-1';
      
      // Move back to global container
      if (persistentContainer.parentNode !== globalContainer) {
        globalContainer.appendChild(persistentContainer);
      }
    }

    return () => {
      // Don't cleanup on unmount - keep chart persistent
    };
  }, [chartId, isActive]);

  // Cleanup only when app closes
  useEffect(() => {
    return () => {
      // Only cleanup when component is permanently destroyed
      const persistentContainer = chartContainers.get(chartId);
      if (persistentContainer && persistentContainer.parentNode) {
        persistentContainer.parentNode.removeChild(persistentContainer);
        chartContainers.delete(chartId);
        chartInstances.delete(chartId);
        chartStates.delete(chartId);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        display: isActive ? 'block' : 'none'
      }}
    >
      {isActive && isInitialized && children}
    </div>
  );
}

// Hook to manage chart instance persistence
export function usePersistentChart(chartId: string) {
  const getInstance = () => chartInstances.get(chartId);
  const setInstance = (instance: any) => {
    chartInstances.set(chartId, instance);
    // Store chart state
    chartStates.set(chartId, { symbol: instance._symbol || 'BTCUSDT', ready: true });
  };
  const hasInstance = () => chartInstances.has(chartId);
  const getState = () => chartStates.get(chartId);
  const setState = (state: { symbol: string; ready: boolean }) => chartStates.set(chartId, state);

  return { getInstance, setInstance, hasInstance, getState, setState };
}

// Global function to show/hide chart without unmounting
export const toggleChartVisibility = (show: boolean) => {
  if (globalChartContainer) {
    if (show) {
      globalChartContainer.style.visibility = 'visible';
      globalChartContainer.style.pointerEvents = 'auto';
      globalChartContainer.style.position = 'static';
      globalChartContainer.style.zIndex = 'auto';
    } else {
      globalChartContainer.style.visibility = 'hidden';
      globalChartContainer.style.pointerEvents = 'none';
      globalChartContainer.style.position = 'fixed';
      globalChartContainer.style.zIndex = '-1';
    }
  }
};
