// install service worker
const staticWeb = "native-app-v";
const dynamicWeb = 'native-dynamic-app-v1';
const assets = [
    'index.html',
    'app.js',
    'bootstrap/js/bootstrap.bundle.min.js',
    'jquery/jquery.min.js',
    'bootstrap/bootstrap.min.css',
    'fontawesome-free/css/all.css', 
    'style.css',
    'image/9.jpg',
    'image/12.jpg',
    'script.js',
    'error.html'

];

self.addEventListener('install', evt => {
    // console.log('Service Worker Installed')
    evt.waitUntil(
        caches.open(staticWeb).then(cache => {
            console.log('Cache the pages');
            cache.addAll(assets);
        })
    )
})

// activate service worker
self.addEventListener('activate', evt => {
    // console.log('Service Worker Activated')
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticWeb && key !== dynamicWeb)
                .map(key => caches.delete(key))
            )
        })
    )
})
// fetch service worker
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRespond => {
            return cacheRespond || fetch(evt.request)
                .then(dynamic => {
                    return caches.open(dynamicWeb).then(cache => {
                        cache.put(evt.request.url, dynamic.clone());
                        return dynamic;
                    })
                });
            
        }).catch(() => caches.match('error.html'))
    )
    // console.log('Service Worker Fetch', evt)
})