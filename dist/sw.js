const CACHE_NAME = 'nedaxer-images-v1';
const STATIC_CACHE = 'nedaxer-static-v1';
const DYNAMIC_CACHE = 'nedaxer-dynamic-v1';

// Cache strategies for different asset types
const cacheStrategies = {
  images: {
    cacheName: CACHE_NAME,
    maxEntries: 200,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
  },
  static: {
    cacheName: STATIC_CACHE,
    maxEntries: 100,
    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
  },
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    maxEntries: 50,
    maxAgeSeconds: 24 * 60 * 60 // 1 day
  }
};

// Files to cache immediately on install
const PRECACHE_ASSETS = [
  '/images/splash-background.png',
  '/images/letter-n.png',
  '/images/letter-e1.png',
  '/images/letter-d.png',
  '/images/letter-a.png',
  '/images/letter-x.png',
  '/images/letter-e2.png',
  '/images/letter-r.png',
  '/logos/nedaxer-logo.png'
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precaching critical images...');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle image requests with cache-first strategy
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle optimized image requests
  if (url.pathname.startsWith('/optimized/')) {
    event.respondWith(handleOptimizedImageRequest(request));
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets with stale-while-revalidate
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }
});

// Helper functions
function isImageRequest(request) {
  const url = new URL(request.url);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  return imageExtensions.some(ext => url.pathname.toLowerCase().includes(ext)) ||
         url.pathname.startsWith('/images/') ||
         request.destination === 'image';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.ico'];
  return staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

async function handleImageRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Return cached version immediately
      return cachedResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Image fetch failed:', error);
    // Return a placeholder or cached fallback if available
    const cache = await caches.open(CACHE_NAME);
    return await cache.match('/images/placeholder.png') || new Response('Image not available', { status: 404 });
  }
}

async function handleOptimizedImageRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache optimized images aggressively
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      
      // Set longer cache headers for optimized images
      const headers = new Headers(networkResponse.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      
      return new Response(await networkResponse.blob(), {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: headers
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Optimized image fetch failed:', error);
    return new Response('Optimized image not available', { status: 404 });
  }
}

async function handleApiRequest(request) {
  try {
    // Network-first for API requests
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache as fallback for GET requests
    if (request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    throw error;
  }
}

async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    // Return cached version while fetching updated version
    if (cachedResponse) {
      // Fetch updated version in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Silently fail background update
      });
      
      return cachedResponse;
    }

    // No cache, fetch from network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Static asset fetch failed:', error);
    throw error;
  }
}

// Background sync for failed image loads
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-image-sync') {
    event.waitUntil(syncFailedImages());
  }
});

async function syncFailedImages() {
  // Implement background sync for failed image requests
  console.log('Background syncing failed images...');
}