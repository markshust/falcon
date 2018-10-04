import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Helmet from 'react-helmet';
import AsyncComponent from 'src/components/Async';
import Home from 'src/pages/Home';
import { Loader } from '@deity/falcon-ecommerce-uikit';
import { ThemeProvider } from '@deity/falcon-ui';
import DynamicRoute from '@deity/falcon-client/src/components/DynamicRoute';
import isOnline from '@deity/falcon-client/src/components/isOnline';
import logo from 'src/assets/logo.png';
import {
  AppLayout,
  Header,
  Footer,
  FooterQuery,
  HeaderQuery,
  MiniCartQuery,
  MiniCart
} from '@deity/falcon-ecommerce-uikit';
import { ThemeEditor, ThemeState } from '@deity/falcon-theme-editor';

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
  </Helmet>
);

const Category = AsyncComponent(() => import(/* webpackChunkName: "shop/category" */ './pages/shop/Category'));
const Product = AsyncComponent(() => import(/* webpackChunkName: "shop/product" */ './pages/shop/Product'));

const App = ({ online }) => (
  <ThemeState initial={deityGreenTheme}>
    {props => (
      <React.Fragment>
        <ThemeProvider theme={props.theme}>
          <HeadMetaTags />
          <AppLayout>
            <HeaderQuery>{data => <Header {...data} />}</HeaderQuery>
            {!online && <p>your are offline.</p>}
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/products" component={Category} />
              <DynamicRoute
                loaderComponent={Loader}
                components={{
                  'shop-category': Category,
                  'shop-product': Product
                }}
              />
            </Switch>
            <FooterQuery>{(data, t) => <Footer {...data} translations={t} />}</FooterQuery>
            <MiniCartQuery>{data => <MiniCart {...data} />}</MiniCartQuery>
          </AppLayout>
        </ThemeProvider>
        <ThemeEditor {...props} />
      </React.Fragment>
    )}
  </ThemeState>
);

App.propTypes = {
  online: PropTypes.bool
};

export default isOnline()(App);
