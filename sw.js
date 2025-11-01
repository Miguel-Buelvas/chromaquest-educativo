const CACHE_NAME = 'chromaquest-v1.0.1'; // Incrementa versión si cambias caché
const urlsToCache = [
  '/index.html',
  '/game.js',
  '/manifest.json',
  '/icon-192.png' // ¡Asegúrate de que exista!
];

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

self.addEventListener('fetch', event => {
  // Solo interceptar peticiones de tu dominio
  if (!event.request.url.startsWith(self.location.origin)) {
    return; // Dejar que los CDN se manejen normalmente
  }

  // Solo cachear peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service Worker: Sirviendo desde caché', event.request.url);
          return response;
        }

        // Clonar la petición porque se consume una vez
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Verificar respuesta válida
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
          .catch(() => {
            // Si es HTML, servir offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Mensajes (para actualizaciones manuales)
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
