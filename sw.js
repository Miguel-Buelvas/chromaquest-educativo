const CACHE_NAME = 'chromaquest-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/manifest.json',
  '/README.md',
  '/CONVERSION_APK.md',
  // Recursos externos (CDN)
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js',
  'https://unpkg.com/splitting@1.0.6/dist/splitting.min.js',
  'https://unpkg.com/splitting@1.0.6/dist/splitting.css'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caché abierta');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Archivos cacheados');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error al cachear', error);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antigua', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activado');
      return self.clients.claim();
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  console.log('Service Worker: Interceptando petición', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, devolver la versión cacheada
        if (response) {
          console.log('Service Worker: Sirviendo desde caché', event.request.url);
          return response;
        }
        
        // Si no está en caché, hacer la petición a la red
        console.log('Service Worker: Sirviendo desde red', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Si la respuesta es válida, cachearla
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Service Worker: Error en la petición', error);
            
            // Si es una petición a una página HTML y falla, servir la página offline
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  console.log('Service Worker: Mensaje recibido', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Manejar actualizaciones en segundo plano
self.addEventListener('backgroundfetchsuccess', event => {
  console.log('Service Worker: Background fetch exitoso');
});

self.addEventListener('backgroundfetchfail', event => {
  console.log('Service Worker: Background fetch fallido');
});

// Manejar notificaciones push (si se implementan en el futuro)
self.addEventListener('push', event => {
  console.log('Service Worker: Push recibido');
  
  const options = {
    body: '¡Hay nuevos desafíos en ChromaQuest!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Jugar ahora',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ChromaQuest', options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Click en notificación');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Manejar sincronización en segundo plano
self.addEventListener('sync', event => {
  console.log('Service Worker: Sincronización en segundo plano', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Realizar tareas de sincronización si se implementan
      Promise.resolve()
    );
  }
});

console.log('Service Worker: Cargado correctamente');