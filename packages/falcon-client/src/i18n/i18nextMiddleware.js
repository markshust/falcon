import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-sync-fs-backend';
import koaI18next from 'koa-i18next';

const i18nextServer = ({ lng = 'en', ns = ['common'], fallbackLng = 'en', whitelist = ['en'] } = {}) =>
  i18next.use(Backend).init({
    lng,
    ns,
    fallbackLng,
    whitelist,
    defaultNS: 'common',
    fallbackNS: 'common',
    saveMissing: false,
    initImmediate: false,
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

export default options => {
  // TODO load available languages from falcon-server using apollo client
  // TODO this means that we need to create SINGLE instance of Apollo Client and inject it into middleware instead of creating it each time!
  const i18nextInstance = i18nextServer(options);

  return async (ctx, next) => {
    if (process.env.NODE_ENV === 'development') {
      i18nextInstance.reloadResources();
    }

    return koaI18next(i18nextInstance, {
      lookupCookie: 'i18n',
      order: ['cookie'],
      next: true // if koa is version 2
    })(ctx, next);
  };
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
