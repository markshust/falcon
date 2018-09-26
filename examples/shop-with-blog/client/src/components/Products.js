import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { themed, Image, Text, Button } from '@deity/falcon-ui';

export const ProductsQuery = ({ children }) => (
  <Query
    query={gql`
      query {
        products {
          items {
            id
            name
            price
            image
            thumbnail
          }
        }
      }
    `}
    // variables={variables}
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
      p: 'md',
      css: {
        overflow: 'hidden',
        textAlign: 'center',
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
      gridAutoRows: '30vh',
      gridGap: 'md',
      css: {
        listStyle: 'none'
      }
    }
  }
});

export const ProductsList = ({ products }) => (
  <ProductListLayout>
    {products.map(product => (
      <ProductCard key={product.id}>
        <Image flex="1 1 0%" css={{ minHeight: 0 }} src={product.thumbnail} />
        <Text ellipsis fontSize="md" fontWeight="bold">
          {product.name}
        </Text>
        <Text fontSize="lg">€ {product.price}</Text>

        <Button
          width={150}
          boxShadow="none"
          bg="secondaryDark"
          position=""
          css={{ margin: '0 auto', textTransform: 'uppercase' }}
        >
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

      return <ProductsList products={data.products.items} />;
    }}
  </ProductsQuery>
);
