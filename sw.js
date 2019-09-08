const staticChacheName = 'portfolio-v6'
const imgCache = 'portfolio-content-imgs'
const allCaches = [
  staticChacheName,
  imgCache
]
// something has cahnged dag
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticChacheName).then(cache => {
      return cache.addAll([
        '/',
        'css/main.css',
        'css/responsive.css',
        'js/indexController.js',
        'js/manifest.json',
        'img/favicon .ico',
        'img/icons-192.png',
        'img/icons-512.png',
        'https://fonts.googleapis.com/css?family=Roboto',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
      ])
    })
  )
  event.waitUntil(
    caches.open(imgCache).then(cache => {
      return cache.addAll([
        'img/animaltradingcard.jpg',
        'img/mun.jpg',
        'img/mun.png',
        'img/pas.jpg',
        'img/pixelartmaker.jpg',
        'img/udacity.png'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url)
  if (requestUrl.pathname.startsWith('/img/')) {
    event.respondWith(servePhotos(event.request))
    return
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName.startsWith('portfolio-') && !allCaches.includes(cacheName))
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})

self.addEventListener('message', event => {
  if (event.data.refreshPage) {
    self.skipWaiting()
  }
})

function servePhotos (request) {
  const storageUrl = request.url.replace(/-\d+\*\d+\.jpg$/, '')

  return caches.open(imgCache).then(cache => {
    return cache.match(storageUrl).then(response => {
      if (response) return response
      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone())
        return networkResponse
      })
    })
  })
}
