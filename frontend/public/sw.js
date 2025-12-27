// School Management System - Unified Service Worker v3.0
// Handles both PWA functionality AND Firebase Cloud Messaging

// Import Firebase scripts for push notifications
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHpQ46cACeXqguCep-4j_NGXzECSo0k-k",
  authDomain: "schoolm-1328f.firebaseapp.com",
  projectId: "schoolm-1328f",
  storageBucket: "schoolm-1328f.firebasestorage.app",
  messagingSenderId: "710514748200",
  appId: "1:710514748200:web:7051ce2d19e85f769a7e1d",
  measurementId: "G-8ZJNSNDM5Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// PWA Cache names
const CACHE_NAME = 'school-erp-v3.0';
const RUNTIME_CACHE = 'school-erp-runtime-v3.0';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/school-logo.png'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing v3.0 with Firebase Messaging...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated and claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network only (don't cache)
  if (url.pathname.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // App shell - Cache first, then network
  if (PRECACHE_URLS.includes(url.pathname) || url.pathname === '/') {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          });
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Other requests - Network first, cache as backup
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
});

// ========== FIREBASE CLOUD MESSAGING ==========

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  console.log('📬 Received background push notification:', payload);

  const notificationTitle = payload.notification?.title || 'School Management System';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/school-logo.png',
    badge: '/school-logo.png',
    tag: payload.data?.type || 'general',
    data: payload.data,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/school-logo.png'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'close') {
    // User dismissed the notification
    return;
  }

  // User clicked notification or "Open" action
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('📱 School Management Unified Service Worker v3.0 loaded (PWA + Firebase Messaging)');
