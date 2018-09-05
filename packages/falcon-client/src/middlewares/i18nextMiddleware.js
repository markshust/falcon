import koaI18next from 'koa-i18next';
import i18nFactory from '../i18n/i18nServerFactory';

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
