import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-sync-fs-backend';

/**
 * @typedef {object} Options
 * @property {string} lng - language
 * @property {string[]} ns - namespaces to load
 * @property {string} fallbackLng fallback language
 * @property {string[]} whitelist languages whitelist
 * @property {object} resources Initial internationalization resources
 */

/**
 * i18next instance server side factory
 * @argument {Options} - options
 * @returns {object} - next middleware or redirect
 */
export default ({ lng = 'en', ns = ['common'], fallbackLng = 'en', whitelist = ['en'], resources }) =>
  i18next.use(Backend).init({
    lng,
    ns,
    fallbackLng,
    whitelist,
    defaultNS: 'common',
    fallbackNS: 'common',
    saveMissing: false,
    initImmediate: false,
    resources,
    react: {
      nsMode: 'fallback'
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, 'i18n/{{lng}}/{{ns}}.json')),
      jsonIndent: 2
    }
  });

export function filterResourceStoreByNs(storeData, namespaces) {
  const i18nResourceStore = {};
  Object.keys(storeData).forEach(lng => {
    i18nResourceStore[lng] = Object.keys(storeData[lng])
      .filter(ns => namespaces.has(ns))
      .reduce(
        (result, ns) => ({
          ...result,
          [ns]: storeData[lng][ns]
        }),
        {}
      );
  });

  return i18nResourceStore;
}
