import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from 'src/pages/Home';
import Helmet from 'react-helmet';
import { ThemeProvider } from '@deity/falcon-ui';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import isOnline from '@deity/falcon-client/src/components/isOnline';
import logo from 'src/assets/logo.png';
import { AppLayout, Header, Footer, Category, Product } from '@deity/falcon-ecommerce-uikit';
import { deityGreenTheme } from './theme';

const HeadMetaTags = () => (
  <Helmet defaultTitle="Deity Shop with Blog" titleTemplate="%s | Deity Shop with Blog">
    <meta name="description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta name="keywords" content="pwa,reactjs,ecommerce,magento,shop,webshop,deity" />
    <meta name="theme-color" content="#fff" />
    <meta name="format-detection" content="telephone=yes" />
    <meta property="og:title" content="Deity Shop with Blog" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="This is example of Shop with Blog powered by Deity Falcon" />
    <meta property="og:url" content="/" />
    <meta property="og:image" content={logo} />
    <meta property="og:image:width" content="300" />
    <meta property="og:image:height" content="107" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" />
  </Helmet>
);

// const NotFound = () => <p>Not Found</p>;

const App = ({ online }) => (
  <ThemeProvider theme={deityGreenTheme}>
    <HeadMetaTags />
    <AppLayout>
      <Header />
      {!online && <p>your are offline.</p>}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/product" component={Product} />
        <Route exact path="/products" component={Category} />

        <DynamicRoute
          components={{
            'shop-page': import(/* webpackChunkName: "shop/cms" */ './pages/shop/Cms'),
            'shop-product': import(/* webpackChunkName: "shop/product" */ './pages/shop/Product'),
            'shop-category': import(/* webpackChunkName: "shop/category" */ './pages/shop/Category'),
            'blog-post': null,
            'blog-page': null,
            'blog-category': null
          }}
        />

        {/* <Route component={NotFound} /> */}
      </Switch>
      <Footer />
    </AppLayout>
  </ThemeProvider>
);

App.propTypes = {
  online: PropTypes.bool
};

export default isOnline()(App);
