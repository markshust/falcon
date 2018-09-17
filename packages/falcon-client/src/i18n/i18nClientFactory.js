import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

export default ({ lng = 'en', fallbackLng = 'en', whitelist = ['en'], debug = false } = {}) => {
  const defaultNS = 'common';

  return i18next.use(XHR).init({
    lng,
    ns: ['common'], // on client side we need only 'common' ns, other will be fetched on demand
    fallbackLng,
    whitelist,
    defaultNS,
    fallbackNS: defaultNS,
    saveMissing: false,
    debug,
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
};
