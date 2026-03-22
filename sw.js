const CACHE = 'customsoftware-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/thank-you.html',
  '/games/flappy.html',
  '/games/snake.html',
  '/games/tetris.html',
  '/assets/js/flappy.js',
  '/assets/js/snake.js',
  '/assets/js/tetris.js',
  '/favicon.svg?v=2'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
