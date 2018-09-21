import { asyncComponent } from 'react-async-component';
import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/home/Home';
import Abc from 'src/pages/abc/Abc';
import Helmet from 'react-helmet';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import isOnline from '@deity/falcon-client/src/components/isOnline';
import 'src/App.css';
import logo from 'src/assets/logo.png';

const HeadMetaTags = () => (
  <Helmet defaultTitle="Deity Shop with Blog" titleTemplate="%s | Deity Shop with Blog">
    <meta name="description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta name="keywords" content="pwa,reactjs,ecommerce,magento,shop,webshop,deity" />
    <meta name="theme-color" content="#fff" />
    <meta name="format-detection" content="telephone=yes" />
    <meta property="og:title" content="Deity Shop with Blog" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta property="og:image" content={logo} />
    <meta property="og:url" content="/" />
    <meta property="og:image:width" content="300" />
    <meta property="og:image:height" content="107" />
  </Helmet>
);

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
    <HeadMetaTags />
    {!online && <p>your are offline.</p>}
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/abc" component={Abc} />
      <DynamicRoute components={components} />
    </Switch>
  </React.Fragment>
);

App.propTypes = {
  online: PropTypes.bool
};

export default isOnline()(App);
