import i18next from 'i18next';

export default ({ lng = 'en' } = {}) => {
  const defaultNS = 'common';

  return i18next.init({
    lng,
    fallbackLng: lng,
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
