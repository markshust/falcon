import i18next from 'i18next';

export default ({ lng = 'en', fallbackLng = 'en' } = {}) => {
  const defaultNS = 'common';

  return i18next.init({
    lng,
    fallbackLng,
    defaultNS,
    fallbackNS: defaultNS,
    debug: false,
    react: {
      nsMode: 'fallback'
    },
    interpolation: {
      escapeValue: false
    }
  });
};
