import path from 'path';
import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import koaI18next from 'koa-i18next';

const i18nextServer = ({ lng = 'en', ns = ['common'], fallbackLng = 'en', whitelist = ['en'] } = {}) =>
  i18next.use(Backend).init({
    lng,
    ns,
    fallbackLng,
    whitelist,
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: path.resolve(path.join(process.env.RAZZLE_PUBLIC_DIR, 'i18n/{{lng}}/{{ns}}.json')),
      jsonIndent: 2
    }
  });

export default options =>
  koaI18next(i18nextServer(options), {
    lookupCookie: 'i18n',
    order: ['cookie'],
    next: true // if koa is version 2
  });
