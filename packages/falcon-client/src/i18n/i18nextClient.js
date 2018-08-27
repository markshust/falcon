import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

const defaultOptions = {
  whitelist: ['en', 'pl'], // base on extensions configuration
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'shop'],
  defaultNS: 'common',
  fallbackNS: 'common',
  interpolation: {
    escapeValue: false // not needed for react!!
  },
  react: {
    wait: true
  }
};

const loadLocale = (url, options, callback) =>
  import(/* webpackChunkName: "locales/[request]" */ `app-path/public/locales/${url}`)
    .then(x => callback(x.default, { status: '200' }))
    .catch(e => {
      if (e.code === 'MODULE_NOT_FOUND') {
        console.warn(`Can not load locale '${url}'! Will try to load fallback 'lag/ns.json'`);
      } else {
        console.warn(`Unexpected Error while loading locale '${url}'!\n${e}`);
      }
      callback(null, { status: '404' });
    });

export default (options = {}) =>
  i18next.use(XHR).init({
    ...defaultOptions,
    ...options,
    backend: {
      loadPath: '{{lng}}/{{ns}}.json',
      parse: x => x,
      ajax: loadLocale
    }
  });
