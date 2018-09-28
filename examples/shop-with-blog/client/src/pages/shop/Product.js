import React from 'react';
import PropTypes from 'prop-types';
import { ProductQuery, Product } from '@deity/falcon-ecommerce-uikit';

const ProductPage = ({ id }) => (
  <ProductQuery id={id}>{({ data, translations }) => <Product data={data} translations={translations} />}</ProductQuery>
);
ProductPage.propTypes = {
  id: PropTypes.number.isRequired
};

export default ProductPage;

// export default translate('shop')(Product);
