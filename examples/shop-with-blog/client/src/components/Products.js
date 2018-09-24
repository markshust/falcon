import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { themed, Image, Text, Button } from '@deity/falcon-ui';

export const ProductsQuery = ({ children, variables }) => (
  <Query
    query={gql`
      query {
        products @client
      }
    `}
    variables={variables}
  >
    {children}
  </Query>
);

export const ProductCard = themed({
  tag: 'li',
  defaultTheme: {
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      css: {
        overflow: 'hidden',
        cursor: 'pointer'
      }
    }
  }
});

export const ProductListLayout = themed({
  tag: 'ul',
  defaultTheme: {
    productListLayout: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
      gridAutoRows: '280px',
      gridGap: 'md',
      m: 'none',
      p: 'none',
      css: {
        listStyle: 'none'
      }
    }
  }
});

export const ProductsList = ({ products }) => (
  <ProductListLayout>
    {products.map(product => (
      <ProductCard key={product.src}>
        <Image flex="1 1 0%" css={{ minHeight: 0 }} src={product.src} />
        <Text ellipsis fontWeight="bold">
          {product.name}
        </Text>
        <Text fontSize="md">€ {product.price}</Text>

        <Button width={150} mt="md" boxShadow="none" bg="secondaryDark">
          Shop Now
        </Button>
      </ProductCard>
    ))}
  </ProductListLayout>
);

export const Products = () => (
  <ProductsQuery>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return <ProductsList products={data.products} />;
    }}
  </ProductsQuery>
);
