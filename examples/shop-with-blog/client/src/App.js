import { asyncComponent } from 'react-async-component';
import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/home/Home';
import LogIn from 'src/pages/login/LogIn';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import 'src/App.css';

const components = {
  shop: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Shop" */ './pages/dynamic/Shop')
  }),
  post: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Post" */ './pages/dynamic/Post')
  })
};

const App = () => (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={LogIn} />
      <DynamicRoute components={components} />
    </Switch>
);

export default App;
