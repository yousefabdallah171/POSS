/**
 * Service Worker for Progressive Web App Support
 *
 * Caching Strategies:
 * - Static assets: Cache-first (return cached, update in background)
 * - API calls: Network-first (try network, fallback to cache)
 * - Images: Stale-while-revalidate (return cached, update in background)
 */

const CACHE_VERSION = 'v2.0.0'
const CACHE_NAMES = {
  static: `${CACHE_VERSION}-static`,
  api: `${CACHE_VERSION}-api`,
  images: `${CACHE_VERSION}-images`,
}

/**
 * Install event - cache essential resources
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.addAll([
        '/',
        '/layout.js',
        '/styles.css',
        '/offline.html',
      ])
    })
  )
  self.skipWaiting()
})

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          // Delete caches that don't match current version
          if (!Object.values(CACHE_NAMES).includes(name)) {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          }
        })
      )
    })
  )
  self.clients.claim()
})

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // ===== STRATEGY 1: Cache-first for static assets =====
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(cacheFirst(request, CACHE_NAMES.static))
    return
  }

  // ===== STRATEGY 2: Stale-while-revalidate for images =====
  if (
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i) ||
    url.pathname.startsWith('/_next/image')
  ) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAMES.images))
    return
  }

  // ===== STRATEGY 3: Network-first for API calls =====
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, CACHE_NAMES.api))
    return
  }

  // ===== STRATEGY 4: Network-first for HTML pages =====
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, CACHE_NAMES.static))
    return
  }

  // Default: Network-first
  event.respondWith(networkFirst(request, CACHE_NAMES.api))
})

/**
 * Cache-first strategy
 * Return from cache, update in background
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    // Update in background
    fetch(request).then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response)
      }
    }).catch(() => {})

    return cached
  }

  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return createOfflineResponse(request)
  }
}

/**
 * Network-first strategy
 * Try network, fall back to cache
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)

    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Fall back to cache
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)

    if (cached) {
      return cached
    }

    return createOfflineResponse(request)
  }
}

/**
 * Stale-while-revalidate strategy
 * Return cached immediately, update in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Always update in background
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => {})

  // Return cached immediately if available
  return cached || fetchPromise
}

/**
 * Create offline fallback response
 */
function createOfflineResponse(request) {
  if (request.headers.get('accept')?.includes('text/html')) {
    return caches.match('/offline.html')
  }

  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain',
    }),
  })
}

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      actions: data.actions || [],
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const action = event.action
  const clickedNotification = event.notification

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Look for existing window
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }

      // Create new window
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

/**
 * Handle message from client
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)))
      })
    )
  }
})

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Sync pending requests
      Promise.resolve()
    )
  }
})

console.log('[SW] Service Worker loaded:', CACHE_NAMES)
