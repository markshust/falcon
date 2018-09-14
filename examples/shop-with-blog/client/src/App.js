import { asyncComponent } from 'react-async-component';
import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/home/Home';
import LogIn from 'src/pages/login/LogIn';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import isOnline from '@deity/falcon-client/src/components/isOnline';
import 'src/App.css';

const components = {
  shop: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Shop" */ './pages/dynamic/Shop')
  }),
  post: asyncComponent({
    resolve: () => import(/* webpackChunkName: "Post" */ './pages/dynamic/Post')
  })
};

const App = ({ online }) => (
  <React.Fragment>
    {!online && <p>your are offline.</p>}
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={LogIn} />
      <DynamicRoute components={components} />
    </Switch>
  </React.Fragment>
);

App.propTypes = {
  online: PropTypes.bool
  // t: PropTypes.func,
  // children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default isOnline()(App);
