import React from 'react';
// import { translate } from 'react-i18next';
import { ProductQuery, Product } from '@deity/falcon-ecommerce-uikit';

export default ({ id }) => <ProductQuery id={id}>{x => <Product product={x} />}</ProductQuery>;
// export default translate('shop')(Product);
