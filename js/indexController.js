
function trackInstalling (worker) {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      updateReady(worker)
    }
  })
}
navigator.serviceWorker.register('/sw.js').then(reg => {
  console.log('sw has registered', reg)
  if (!navigator.serviceWorker.controller) return

  if (reg.waiting) {
    updateReady(reg.waiting)
    return
  }
  if (reg.installing) {
    trackInstalling(reg.installing)
    return
  }
  reg.addEventListener('updatefound', () => {
    trackInstalling(reg.installing)
  })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}).catch(err => {
  console.log('err installing sw', err)
})

function updateReady (worker) {
  const refresh = window.confirm('there is new update available. Refresh the page')
  if (refresh) {
    worker.postMessage({ refreshPage: true })
  }
}
