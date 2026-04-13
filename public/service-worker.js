const CACHE_NAME = 'divina-misericordia-v1';
const AUDIO_CACHE_NAME = 'divina-misericordia-audio-v1';

// Recursos esenciales para funcionar offline
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/global.css',
  '/css/reproductor-sagrado.css',
  '/js/global-components.js',
  '/js/cursor.js',
  '/js/splash.js',
  '/js/transitions.js',
  '/js/scroll-reveal.js',
  '/js/votive-candle.js',
  '/js/rosary-counter.js',
  '/js/prayer-intentions.js',
  '/js/daily-quote.js',
  '/js/liturgical-clock.js'
];

// Installing Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching core assets');
      return cache.addAll(CORE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activating Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Limpiar caches antiguos
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch con estrategia inteligente
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin
  if (url.origin !== location.origin) {
    return;
  }

  // HTML pages: Network First
  if (event.request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // CSS/JS: Cache First
  if (event.request.destination === 'style' || event.request.destination === 'script') {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Imágenes: Cache First con TTL largo
  if (event.request.destination === 'image') {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Audio: Cache on Demand (solo si el usuario lo reproduce)
  if (url.pathname.endsWith('.mp3')) {
    event.respondWith(audioCacheStrategy(event.request));
    return;
  }

  // Default: Network First
  event.respondWith(networkFirst(event.request));
});

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, falling back to cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Devolver offline.html si existe y es navegación
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Actualizar en background
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
    }).catch(() => {});
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available offline', { status: 503 });
  }
}

// Audio Cache on Demand (máx 50MB)
async function audioCacheStrategy(request) {
  try {
    // Intentar red primero
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Verificar tamaño total del caché de audio
      const audioCache = await caches.open(AUDIO_CACHE_NAME);
      const keys = await audioCache.keys();
      
      // Si hay menos de 50 audios, cachear
      if (keys.length < 50) {
        await audioCache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    // Fallback a caché
    const audioCache = await caches.open(AUDIO_CACHE_NAME);
    const cachedResponse = await audioCache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Audio no disponible
    return new Response('Audio no disponible offline', { 
      status: 503,
      headers: { 'Content-Type': 'audio/mpeg' }
    });
  }
}

// Mensajes desde el cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URL') {
    // Cachear URL específica bajo demanda
    caches.open(CACHE_NAME).then((cache) => {
      fetch(event.data.url).then((response) => {
        if (response.ok) {
          cache.put(event.data.url, response);
        }
      });
    });
  }
});

// Notificaciones push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/img/icon-192x192.png',
    badge: '/img/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    renotify: true,
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir nueva
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('[SW] Service Worker loaded');