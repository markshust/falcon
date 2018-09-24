import { asyncComponent } from 'react-async-component';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/Home';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import { ThemeProvider } from '@deity/falcon-ui';

import { AppLayout, Header } from './components';
import { theme } from './theme';

const components = {
  shop: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Shop" */ './pages/dynamic/Shop')
  }),
  post: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Post" */ './pages/dynamic/Post')
  })
};

const App = () => (
  <ThemeProvider theme={theme}>
    <AppLayout>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <DynamicRoute components={components} />
      </Switch>
    </AppLayout>
  </ThemeProvider>
);

export default App;
