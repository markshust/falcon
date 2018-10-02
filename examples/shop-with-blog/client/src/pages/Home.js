import React from 'react';
import { I18n } from 'react-i18next';

import { H1, Box, FlexLayout } from '@deity/falcon-ui';
import { ProductsList, ProductsListQuery } from '@deity/falcon-ecommerce-uikit';

const Home = () => (
  <Box my="lg">
    <FlexLayout my="lg" justifyContent="center">
      <I18n ns={['shop']}>{t => <H1>{t('home.hotSellers')}</H1>}</I18n>
    </FlexLayout>
    <ProductsListQuery>{({ products }) => <ProductsList products={products.items} />}</ProductsListQuery>
  </Box>
);

export default Home;
