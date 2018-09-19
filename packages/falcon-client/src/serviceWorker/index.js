/**
 * Register Service Worker
 * @param {string} swPath public path to service worker
 * @returns {void}
 */
export function register(swPath = '/sw.js') {
  const isHttps = window.location.protocol === 'https:';
  const isLocalHost = window.location.host.match(/(localhost|127.0.0.1)/);

  if (!('serviceWorker' in navigator) || (!isHttps && !isLocalHost)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swPath, { scope: '/' })
      .then(registration => {
        if (isLocalHost) {
          console.log('SW registered: ', registration);
        }
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });

    // window.addEventListener('beforeinstallprompt', event => {
    //   // time when add to homescreen dialog is shown can be changed
    //   // based on different requirements
    //   // more details https://developers.google.com/web/updates/2018/06/a2hs-updates
    //   event.prompt();
    // });
  });
}

/**
 * Unregister all registered service workers
 * @returns {void}
 */
export function unregisterAll() {
  navigator.serviceWorker.getRegistrations().then(swRegistrations => {
    swRegistrations.forEach(registration =>
      registration
        .unregister()
        .then(console.log(`Service Worker for '${registration.scope}' successfully unregistered.`))
        .catch(x => console.error(`Can not unregistered Service Worker for ${registration.scope}.`, x))
    );
  });
}
