var sw_verion = '013';
var cacheName = 'gemspider-gas';

var filesToCache = [ 
  '/public/spider/gas/',
  '/public/spider/gas/index.html',
  '/public/spider/gas/manifest.json',  
  '/public/spider/gas/assets/css/app.css',
  '/public/spider/gas/assets/css/addtohomescreen.css',
  '/public/spider/gas/assets/css/icons.css',
  '/public/spider/gas/assets/fonts/Framework7Icons-Regular.woff2',
  '/public/spider/gas/assets/fonts/MaterialIcons-Regular.woff2',
  '/public/spider/gas/assets/icons/favicon-120.png',
  '/public/spider/gas/assets/icons/favicon-152.png',
  '/public/spider/gas/assets/icons/favicon-196.png',
  '/public/spider/gas/assets/icons/favicon-76.png',
  '/public/spider/gas/assets/icons/favicon.ico',
  '/public/spider/gas/assets/icons/icon-120x120.png',
  '/public/spider/gas/assets/icons/icon-128x128.png',
  '/public/spider/gas/assets/icons/icon-144x144.png',
  '/public/spider/gas/assets/icons/icon-152x152.png',
  '/public/spider/gas/assets/icons/icon-167x167.png',
  '/public/spider/gas/assets/icons/icon-180x180.png',
  '/public/spider/gas/assets/icons/icon-192x192.png',
  '/public/spider/gas/assets/icons/icon-196x196.png',
  '/public/spider/gas/assets/icons/icon-384x384.png',
  '/public/spider/gas/assets/icons/icon-512x512.png',
  '/public/spider/gas/assets/icons/icon-57x57.png',
  '/public/spider/gas/assets/icons/icon-72x72.png',
  '/public/spider/gas/assets/icons/icon-76x76.png',
  '/public/spider/gas/assets/icons/icon-96x96.png',
  '/public/spider/gas/data/gas_knoten.geojson',
  '/public/spider/gas/data/gas_leitung.geojson',
  '/public/spider/gas/data/gas_knoten.geojson',
  '/public/spider/gas/data/gas_leitung.geojson',
  '/public/spider/gas/data/gas_knoten.geojson',
  '/public/spider/gas/data/gas_leitung.geojson',
  '/public/spider/gas/data/kanal_knoten.geojson',
  '/public/spider/gas/data/kanal_leitung.geojson',
  '/public/spider/gas/data/wasser_knoten.geojson',
  '/public/spider/gas/data/wasser_leitung.geojson',
  '/public/spider/gas/libs/framework7/css/framework7.min.css',
  '/public/spider/gas/libs/framework7/js/framework7.min.js',
  '/public/spider/gas/libs/framework7-vue/framework7-vue.min.js',
  '/public/spider/gas/libs/mapbox-gl/mapbox-gl.css',
  '/public/spider/gas/libs/mapbox-gl/mapbox-gl.js',
  '/public/spider/gas/libs/vue/vue.min.js',
  '/public/spider/gas/assets/img/marker-icon-black.png',
  '/public/spider/gas/assets/img/marker-icon-blue.png',
  '/public/spider/gas/assets/img/marker-icon-blue2.1.png',
  '/public/spider/gas/assets/img/marker-icon-blue2.png',
  '/public/spider/gas/assets/img/marker-icon-green.png',
  '/public/spider/gas/assets/img/marker-icon-green2.1.png',
  '/public/spider/gas/assets/img/marker-icon-green2.png',
  '/public/spider/gas/assets/img/marker-icon-grey.png',
  '/public/spider/gas/assets/img/marker-icon-orange.png',
  '/public/spider/gas/assets/img/marker-icon-red.png',
  '/public/spider/gas/assets/img/marker-icon-violet.png',
  '/public/spider/gas/assets/img/marker-icon-yellow.png',
  '/public/spider/gas/assets/img/placeholder.png',
  '/public/spider/gas/assets/img/wartungen-shadow.png',
  '/public/spider/gas/assets/img/wartungen.png',
  '/public/spider/gas/assets/js/addtohomescreen.min.js',
  '/public/spider/gas/assets/js/app.js',
  '/public/spider/gas/mapbox-style.json'
]



//filesToCache = [];
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install Version ' + sw_verion);
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
  console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', event => {
  if ( event.request.url.indexOf( 'vtiles/' ) !== -1 ) {
      return false;
  }
  if ( event.request.url.indexOf( 'tile-server/' ) !== -1 ) {
      return false;
  }
  if ( event.request.url.indexOf( 'basemap/' ) !== -1 ) {
      return false;
  }
  if ( event.request.url.indexOf( 'bev.gv.at' ) !== -1 ) {
      return false;
  }
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});

