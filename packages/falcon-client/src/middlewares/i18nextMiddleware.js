import koaI18next from 'koa-i18next';
import i18nFactory from '../i18n/i18nServerFactory';

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
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */
export default options => {
  // TODO load available languages from falcon-server using apollo client
  // TODO this means that we need to create SINGLE instance of Apollo Client and inject it into middleware instead of creating it each time!
  const i18nInstance = i18nFactory(options);

  return async (ctx, next) => {
    if (process.env.NODE_ENV === 'development') {
      i18nInstance.reloadResources();
    }

    return koaI18next(i18nInstance, {
      lookupCookie: 'i18n',
      order: ['cookie'],
      next: true // if koa is version 2
    })(ctx, next);
  };
};
