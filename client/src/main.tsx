import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// PWA Service Worker Registration
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, notify user
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  }
}

// PWA Install Prompt
let deferredPrompt: any;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button or notification
    showInstallPromotion();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    // Hide install promotion
    hideInstallPromotion();
  });
}

function showInstallPromotion() {
  // Create install banner if it doesn't exist
  if (!document.getElementById('pwa-install-banner')) {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: #0033a0;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Install Nedaxer App</div>
          <div style="font-size: 14px; opacity: 0.9;">Get the full app experience</div>
        </div>
        <div>
          <button id="pwa-install-btn" style="
            background: white;
            color: #0033a0;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            margin-right: 8px;
            cursor: pointer;
          ">Install</button>
          <button id="pwa-dismiss-btn" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
          ">×</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Install button click handler
    document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        deferredPrompt = null;
        hideInstallPromotion();
      }
    });

    // Dismiss button click handler
    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
      hideInstallPromotion();
    });
  }
}

function hideInstallPromotion() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.remove();
  }
}

// Clear service worker cache in development only
function clearServiceWorkerCache() {
  if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
          console.log('Service worker unregistered');
        }
        
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
          console.log('All caches cleared');
        }
      } catch (error) {
        console.error('Error clearing service worker cache:', error);
      }
    });
  }
}

// Initialize PWA features
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
  setupInstallPrompt();
} else {
  clearServiceWorkerCache();
}

// Add no-cache headers for development environments
function addNoCacheHeaders() {
  if (process.env.NODE_ENV === 'development') {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'no-cache, no-store, must-revalidate';
    document.head.appendChild(meta);
    
    const pragma = document.createElement('meta');
    pragma.httpEquiv = 'Pragma';
    pragma.content = 'no-cache';
    document.head.appendChild(pragma);
    
    const expires = document.createElement('meta');
    expires.httpEquiv = 'Expires';
    expires.content = '0';
    document.head.appendChild(expires);
  }
}

// Setup no-cache headers
addNoCacheHeaders();

// Global error handling to prevent red browser errors
function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection prevented:', event.reason);
    event.preventDefault(); // Prevent the default browser error display
    
    // Optional: Show user-friendly notification instead
    // You can integrate with your toast system here if needed
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    console.warn('JavaScript error prevented:', event.error);
    event.preventDefault(); // Prevent the default browser error display
  });

  // Handle fetch errors and other network issues
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      return await originalFetch(...args);
    } catch (error) {
      console.warn('Fetch error handled:', error);
      // Re-throw as a more user-friendly error
      throw new Error('Network request failed. Please check your connection and try again.');
    }
  };
}

// Initialize global error handling
setupGlobalErrorHandling();

// Render the application
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <App />
  );
}
