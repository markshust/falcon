import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

export default ({ lng = 'en', ns = ['common'], fallbackLng = 'en', whitelist = ['en'] } = {}) =>
  i18next.use(XHR).init({
    lng,
    ns: ['common'], // on client side we need only 'common' ns, other will be fetched on demand
    fallbackLng,
    whitelist,
    defaultNS: 'common',
    fallbackNS: 'common',
    react: {
      wait: true,
      nsMode: 'fallback'
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: 'i18n/{{lng}}/{{ns}}.json',
      parse: x => JSON.parse(x)
    }
  });
