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
    const scope = '/';

    navigator.serviceWorker
      .register(swPath, { scope })
      .then(registration => {
        if (isLocalHost) {
          console.log(`SW registered for '${scope}'.`, registration);
        }
      })
      .catch(registrationError => {
        console.warn(`SW registration for '${scope}' failed.`, registrationError);
      });
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
        .then(console.log(`SW unregistered for '${registration.scope}'.`))
        .catch(x => console.warn(`SW unregistration for '${registration.scope}' failed.`, x))
    );
  });
}
