// Bundle optimization utilities to reduce chunk sizes
// This helps address Vite chunk size warnings without modifying vite.config.ts

// Preload critical chunks during idle time
export const preloadCriticalChunks = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload admin components only when needed
      if (window.location.pathname.includes('/admin')) {
        import('../pages/admin-portal-unified');
      }
      
      // Preload chart components for trading pages
      if (window.location.pathname.includes('/trade') || window.location.pathname.includes('/mobile/trade')) {
        import('../components/tradingview-widget');
        import('../components/lightweight-chart');
      }
      
      // Preload crypto utility libraries
      if (window.location.pathname.includes('/mobile/assets') || window.location.pathname.includes('/mobile/trade')) {
        import('bitcoinjs-lib');
        import('bip32');
        import('bip39');
      }
    });
  }
};

// Dynamic import wrapper with error handling
export const dynamicImport = async (importFn: () => Promise<any>) => {
  try {
    return await importFn();
  } catch (error) {
    console.warn('Dynamic import failed:', error);
    return null;
  }
};

// Chunk size monitoring (development only)
export const monitorChunkSizes = () => {
  if (import.meta.env.DEV) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('.js') && (entry as any).transferSize > 500000) {
          console.warn(`Large chunk detected: ${entry.name} (${((entry as any).transferSize / 1024).toFixed(2)}KB)`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Initialize bundle optimization
export const initBundleOptimization = () => {
  preloadCriticalChunks();
  monitorChunkSizes();
};