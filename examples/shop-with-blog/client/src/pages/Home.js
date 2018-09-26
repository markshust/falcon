import React from 'react';
import { H1, Box, FlexLayout } from '@deity/falcon-ui';
import { Products } from '@deity/falcon-ecommerce-uikit';

const Home = () => (
  <Box my="lg">
    <FlexLayout my="lg" justifyContent="center">
      <H1>Hot sellers</H1>
    </FlexLayout>
    <Products />
  </Box>
);

export default Home;
