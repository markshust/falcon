import i18next from 'i18next';

export default ({ lng = 'en', fallbackLng = 'en', defaultNS = 'common', resources = {} } = {}) =>
  i18next.init({
    lng,
    fallbackLng,
    defaultNS,
    fallbackNS: defaultNS,
    debug: false,
    resources,
    react: {
      nsMode: 'fallback'
    },
    interpolation: {
      escapeValue: false
    }
  });
