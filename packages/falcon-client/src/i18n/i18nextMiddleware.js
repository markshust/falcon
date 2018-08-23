import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import koaI18next from 'koa-i18next';

const defaultOptions = {
  whitelist: ['en'], // base on extensions configuration
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  fallbackNS: 'common',
  debug: false,
  interpolation: {
    escapeValue: false // not needed for react!!
  }
};

const i18nextServer = () =>
  i18next.use(Backend).init({
    ...defaultOptions,
    backend: {
      loadPath: path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, '/locales/{{lng}}/{{ns}}.json')),
      jsonIndent: 2
    }
  });

export default koaI18next(i18nextServer(), {
  // lookupCookie: 'i18n', // detecting language in cookie
  // order: ['cookie'],
  lookupCookie: 'i18next',
  // lookupQuerystring: 'lng',
  // lookupPath: 'lng',
  order: ['cookie'],

  next: true // if koa is version 2
});
