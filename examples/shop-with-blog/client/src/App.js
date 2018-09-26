import { asyncComponent } from 'react-async-component';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/Home';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';

import { ThemeProvider } from '@deity/falcon-ui';
import { AppLayout, Header, Footer, Category } from '@deity/falcon-ecommerce-uikit';
import { deityGreenTheme } from './theme';

const components = {
  shop: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Shop" */ './pages/dynamic/Shop')
  }),
  post: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Post" */ './pages/dynamic/Post')
  })
};

const App = () => (
  <ThemeProvider theme={deityGreenTheme}>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" />
    <AppLayout>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Category} />
        <DynamicRoute components={components} />
      </Switch>
      <Footer />
    </AppLayout>
  </ThemeProvider>
);

export default App;
