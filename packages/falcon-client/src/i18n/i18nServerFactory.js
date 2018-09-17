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
 * @argument {Options} options - options
 * @returns {object} - next middleware or redirect
 */
export default ({
  lng = 'en',
  ns = ['common'],
  fallbackLng = 'en',
  whitelist = ['en'],
  debug = false,
  resources
} = {}) => {
  const defaultNS = 'common';

  return i18next.use(Backend).init({
    lng,
    ns,
    fallbackLng,
    whitelist,
    defaultNS,
    fallbackNS: defaultNS,
    saveMissing: false,
    initImmediate: false,
    resources,
    debug,
    react: {
      nsMode: 'fallback'
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: 'build/i18n/{{lng}}/{{ns}}.json',
      jsonIndent: 2
    }
  });
};

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

export function extractI18nextState(ctx) {
  if (ctx.i18next) {
    /* on development we would like to have HMR then we can not inject initial translations
     * because even resources will be updated i18next will not reload its internal state after module.hot.accept()
     */
    const data = process.env.NODE_ENV === 'development' ? undefined : ctx.state.i18nextFilteredStore;

    return {
      language: ctx.i18next.language,
      data
    };
  }

  return {};
}
