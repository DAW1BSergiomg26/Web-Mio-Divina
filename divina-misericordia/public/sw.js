const CACHE_NAME = 'divina-misericordia-v2.0.0';
const STATIC_CACHE = 'divina-static-v2';
const DYNAMIC_CACHE = 'divina-dynamic-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/santa-francisca-romana.html',
  '/oracion-eucharistia.html',
  '/coronilla.html',
  '/novena.html',
  '/oraciones.html',
  '/hora-de-la-misericordia.html',
  '/santo-rosario.html',
  '/misterios-gozosos.html',
  '/misterios-dolorosos.html',
  '/misterios-luminosos.html',
  '/misterios-de-gloria.html',
  '/via-crucis.html',
  '/maria.html',
  '/lugares-de-culto.html',
  '/otras-devociones.html',
  '/css/styles.css',
  '/js/main.js',
  '/img/logo_divina_misericordia.jpg',
  '/manifest.json'
];

const MAX_DYNAMIC_ITEMS = 100;

self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching Core Assets');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('[SW] Precache failed:', err))
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => {
              console.log('[SW] Removing old cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  
  if (url.origin === location.origin) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('/index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const keys = await cache.keys();
      if (keys.length >= MAX_DYNAMIC_ITEMS) {
        cache.delete(keys[0]);
      }
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return null;
  }
}

self.addEventListener('push', event => {
  console.log('[SW] Push received');
  
  let data = {
    title: 'Divina Misericordia',
    body: 'Es la Hora de la Misericordia. Jesús te espera.',
    icon: '/img/logo_divina_misericordia.jpg',
    badge: '/img/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'hora-misericordia',
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'rezar', title: '✝ Rezarp ahora' },
      { action: 'cerrar', title: 'Més tarde' }
    ],
    data: {
      url: '/hora-de-la-misericordia.html',
      horaMisericordia: true
    }
  };

  if (event.data) {
    try {
      const customData = event.data.json();
      data = { ...data, ...customData };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'cerrar') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});

self.addEventListener('notificationclose', event => {
  console.log('[SW] Notification closed');
});

self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduleNotification(event.data);
  }
});

function scheduleNotification(data) {
  const { hour = 15, minute = 0, title, body } = data;
  
  const now = new Date();
  let scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);
  
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const delay = scheduledTime.getTime() - now.getTime();
  
  console.log(`[SW] Scheduling notification for ${scheduledTime.toLocaleString()}`);
  console.log(`[SW] Delay: ${Math.round(delay / 1000 / 60)} minutes`);
  
  setTimeout(() => {
    self.registration.showNotification(title || 'Hora de la Misericordia', {
      body: body || 'Son las 3 PM. Es la Hora de la Misericordia. Jesús te espera.',
      icon: '/img/logo_divina_misericordia.jpg',
      badge: '/img/badge-72.png',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'hora-misericordia-daily',
      requireInteraction: true,
      actions: [
        { action: 'rezar', title: '✝ Rezarp ahora' },
        { action: 'cerrar', title: 'Més tarde' }
      ],
      data: { url: '/hora-de-la-misericordia.html' }
    });
  }, delay);
}

console.log('[SW] Service Worker loaded');
