import i18next from 'i18next';

export default ({ lng = 'en', fallbackLng = 'en', whitelist = ['en'] } = {}) =>
  i18next.init({
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
    }
  });
