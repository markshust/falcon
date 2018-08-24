import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import koaI18next from 'koa-i18next';

const defaultOptions = {
  whitelist: ['en'], // base on extensions configuration
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'shop'],
  // preload: ['en'],
  defaultNS: 'common',
  fallbackNS: 'common',
  interpolation: {
    escapeValue: false // not needed for react!!
  }
};

const i18nextServer = (options = {}) =>
  i18next.use(Backend).init({
    ...defaultOptions,
    ...options,
    backend: {
      loadPath: path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, '/locales/{{lng}}/{{ns}}.json')),
      jsonIndent: 2
    }
  });

export default options =>
  koaI18next(i18nextServer(options), {
    lookupCookie: 'i18n',
    order: ['cookie'],
    next: true // if koa is version 2
  });
