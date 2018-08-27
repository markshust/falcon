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
  }
};

export default (options = {}) =>
  i18next.use(XHR).init({
    ...defaultOptions,
    ...options,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      parse: data => JSON.parse(data)
    }
  });
