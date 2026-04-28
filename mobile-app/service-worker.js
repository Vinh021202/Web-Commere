const CACHE_NAME = 'web-commerce-mobile-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './src/main.js',
  './src/App.js',
  './src/components/BottomNav.js',
  './src/components/CategorySection.js',
  './src/components/Deals.js',
  './src/components/Header.js',
  './src/components/Hero.js',
  './src/components/MiniCart.js',
  './src/components/ProductCard.js',
  './src/components/ProductSection.js',
  './src/components/Sheets.js',
  './src/components/Toast.js',
  './src/data/fallbackData.js',
  './src/data/icons.js',
  './src/state/store.js',
  './src/utils/api.js',
  './src/utils/assets.js',
  './src/utils/format.js',
  './src/utils/storage.js',
  './manifest.webmanifest',
  './assets/logo.png',
  './assets/banner1.webp',
  './assets/banner2.webp',
  './assets/bannerV2.jpg',
  './assets/product1.jpg',
  './assets/product2.jpg',
  './assets/product3.jpg',
  './assets/category-fashion.jpg',
  './assets/category-beauty.jpg',
  './assets/category-bags.jpg',
  './assets/category-electronics.png',
  './assets/category-wellness.jpg',
  './assets/cartfoot.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
