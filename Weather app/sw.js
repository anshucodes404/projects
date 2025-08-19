// Service Worker for Weather App
const CACHE_NAME = 'weather-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/assets/weather-icon-192.png',
    '/assets/weather-icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.log('Cache failed:', error);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                // Clone the request because it's a stream and can only be consumed once
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response because it's a stream and can only be consumed once
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
            .catch(() => {
                // Return offline page or cached content when network fails
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for weather data
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Attempt to fetch fresh weather data
            fetch('/api/weather/refresh')
                .catch((error) => {
                    console.log('Background sync failed:', error);
                })
        );
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/weather-icon-192.png',
            badge: '/assets/weather-icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Details',
                    icon: '/assets/weather-icon-192.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/assets/weather-icon-192.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle app updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', (event) => {
        if (event.tag === 'weather-update') {
            event.waitUntil(
                updateWeatherData()
            );
        }
    });
}

async function updateWeatherData() {
    try {
        // Attempt to fetch fresh weather data
        const response = await fetch('/api/weather/update');
        if (response.ok) {
            console.log('Weather data updated successfully');
        }
    } catch (error) {
        console.log('Periodic weather update failed:', error);
    }
}

// Cache strategies for different types of requests
const cacheStrategies = {
    // Cache first for static assets
    cacheFirst: async (request) => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        try {
            const networkResponse = await fetch(request);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        } catch (error) {
            return new Response('Network error', { status: 408 });
        }
    },
    
    // Network first for API calls
    networkFirst: async (request) => {
        try {
            const networkResponse = await fetch(request);
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        } catch (error) {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            return new Response('Network error', { status: 408 });
        }
    },
    
    // Stale while revalidate for frequently changing content
    staleWhileRevalidate: async (request) => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
        });
        
        return cachedResponse || fetchPromise;
    }
};

// Apply appropriate strategy based on request type
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Static assets - cache first
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
        event.respondWith(cacheStrategies.cacheFirst(event.request));
        return;
    }
    
    // API calls - network first
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(cacheStrategies.networkFirst(event.request));
        return;
    }
    
    // HTML pages - stale while revalidate
    if (event.request.destination === 'document') {
        event.respondWith(cacheStrategies.staleWhileRevalidate(event.request));
        return;
    }
    
    // Default - network first
    event.respondWith(cacheStrategies.networkFirst(event.request));
});
