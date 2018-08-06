import App from 'containers/App';
import routes from '@deity/falcon-core/routes';

if (typeof require.ensure !== 'function') require.ensure = (deps, callback) => callback(require);

export default store => {
  const coreRoutes = routes(store);

  return {
    childRoutes: [
      {
        path: '/',
        component: App,
        indexRoute: {
          getComponent: (nextState, cb) => {
            require.ensure([], require => {
              cb(null, require('containers/Home'));
            });
          }
        },
        childRoutes: [
          ...coreRoutes,
          require('@deity/falcon-core/routes/dynamic')(store, {
            getComponent: type => {
              // todo move to core ?
              switch (type) {
                case 'product':
                  return require.ensure([], require => () => require('shop/containers/Product'));
                case 'wp-post':
                  return require.ensure([], require => () => require('containers/Post'));
                case 'wp-page':
                  return require.ensure([], require => () => require('containers/Cms/CmsPage'));
                case 'category':
                  return require.ensure([], require => () => require('containers/Category'));
                default:
                  return false;
              }
            }
          })
        ]
      }
    ]
  };
};
