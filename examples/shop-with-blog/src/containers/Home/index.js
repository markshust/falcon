import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import multipleCssModules from 'falcon-core/lib/cssModules';
import Grid from 'react-bootstrap/lib/Grid';
import ProductList from 'components/Product/components/List';
import { asyncConnect } from 'redux-connect';
import { loadHomepageProducts } from 'redux/modules/catalog/homeProducts';

const styles = require('./styles.scss');

@asyncConnect([
  {
    key: 'loadHomepageProducts',
    deferred: true,
    promise: ({ store: { dispatch } }) => dispatch(loadHomepageProducts())
  }
])
@connect(
  state => ({
    catalog: state.catalog
  }),
  {
    loadHomepageProducts
  }
)
@translate(['shop'])
@multipleCssModules(styles)
export default class Home extends Component {
  componentDidMount() {
    const products = this.props.catalog.homeProducts;
    if (!products.loaded && !products.loading) {
      this.props.loadHomepageProducts();
    }
  }

  render() {
    const {
      t,
      catalog: {
        homeProducts: {
          data: { items = [] },
          error
        },
        loading,
        loaded
      }
    } = this.props;

    return (
      <div styleName="home">
        <Grid fluid>
          {!!items.length && (
            <div styleName="section-title">
              <h2>{t('shop.home.hotSellers')}</h2>
              <p>{t('shop.home.whatsTrending')}</p>
            </div>
          )}
          <ProductList items={items} isLoading={loading || !loaded} error={error} />
        </Grid>
      </div>
    );
  }
}

Home.defaultProps = {
  catalog: {
    homeProducts: {
      data: {
        items: [],
        filters: []
      }
    }
  },
  loadHomepageProducts: () => {},
  t: () => {}
};

Home.propTypes = {
  catalog: PropTypes.shape({
    homeProducts: PropTypes.shape({
      data: PropTypes.shape({
        items: PropTypes.array,
        filters: PropTypes.array
      })
    }),
    loaded: PropTypes.bool,
    loading: PropTypes.bool
  }),
  t: PropTypes.func,
  loadHomepageProducts: PropTypes.func
};
