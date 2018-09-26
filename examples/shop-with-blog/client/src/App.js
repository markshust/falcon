import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/Home';
import { ThemeProvider } from '@deity/falcon-ui';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';

import { AppLayout, Header } from './components';
import { theme } from './theme';

const NotFound = () => <p>Not Found</p>;

const App = () => (
  <ThemeProvider theme={theme}>
    <AppLayout>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/not-found" component={NotFound} />
        <Route
          exact
          path="/*"
          component={({ match }) => (
            <DynamicRoute
              match={match}
              components={{
                'cms-page': import(/* webpackChunkName: "shop/cms" */ './pages/shop/Cms'),
                product: import(/* webpackChunkName: "shop/product" */ './pages/shop/Product'),
                category: import(/* webpackChunkName: "shop/category" */ './pages/shop/Category'),
                'wp-post': null,
                'wp-page': null,
                'wp-category': null
              }}
            />
          )}
        />
      </Switch>
    </AppLayout>
  </ThemeProvider>
);

export default App;
