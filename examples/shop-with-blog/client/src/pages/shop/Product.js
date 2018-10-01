import React from 'react';
import PropTypes from 'prop-types';
import { ProductQuery, Product } from '@deity/falcon-ecommerce-uikit';

const ProductPage = ({ id }) => (
  <ProductQuery variables={{ id }}>{productProps => <Product {...productProps} />}</ProductQuery>
);
ProductPage.propTypes = {
  id: PropTypes.number.isRequired
};

export default ProductPage;

// export default translate('shop')(Product);
