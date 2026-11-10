const CACHE_NAME = "studyflow-v1";

const ARQUIVOS = [
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Instala o aplicativo e guarda os arquivos
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ARQUIVOS);
        })
    );

    self.skipWaiting();
});

// Ativa o cache novo
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(chaves => {
            return Promise.all(
                chaves
                    .filter(chave => chave !== CACHE_NAME)
                    .map(chave => caches.delete(chave))
            );
        })
    );

    self.clients.claim();
});

// Busca os arquivos salvos quando necessário
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(resposta => {
            return resposta || fetch(event.request);
        })
    );
});
