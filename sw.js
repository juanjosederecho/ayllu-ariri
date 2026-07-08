const CACHE_NAME = "ayllu-ariri-v2";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./config.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/pattern.svg",
  "./assets/titicaca.png",
  "./assets/altiplano.png",
  "./assets/tejido.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

// Instalar y almacenar en caché recursos estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caché abierto correctamente.");
      return cache.addAll(APP_FILES);
    })
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
});

// Estrategia de Fetch: Cache-First para recursos estáticos del app, Network-First para peticiones externas (como mapas)
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Si es un mapa de OpenStreetMap, intentamos red primero, sino caché
  if (requestUrl.host === "tile.openstreetmap.org") {
    event.respondWith(
      caches.open("map-tiles").then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request)); // Fallback a caché offline
      })
    );
  } else {
    // Para archivos del app shell y CDNs pre-cacheadas
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        
        // Si no está cacheado, ir a la red
        return fetch(event.request).then((response) => {
          // No cachear dinámicamente peticiones POST o APIs no deseadas
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Retornar página offline de fallback si aplica
          console.log("Petición fallida y sin conexión disponible.");
        });
      })
    );
  }
});
