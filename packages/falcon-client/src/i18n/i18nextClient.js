import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

export default ({ lng = 'en', fallbackLng = 'en', whitelist = ['en'] } = {}) =>
  i18next.use(XHR).init({
    lng,
    fallbackLng,
    whitelist,
    defaultNS: 'common',
    react: {
      wait: true
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: 'i18n/{{lng}}/{{ns}}.json',
      parse: x => JSON.parse(x)
    }
  });
