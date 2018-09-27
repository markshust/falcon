import React from 'react';
import gql from 'graphql-tag';
import { themed, Image, Text, Button } from '@deity/falcon-ui';
import { Query } from './Query';

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

export const ProductsList: React.SFC<{ products: any }> = ({ products }) => (
  <ProductListLayout>
    {products.map((product: any) => (
      <ProductCard key={product.id}>
        <Image flex="1 1 0%" css={{ minHeight: 0 }} src={product.thumbnail} />
        <Text ellipsis fontWeight="bold">
          {product.name}
        </Text>
        <Text fontSize="lg">€ {product.price}</Text>
      </ProductCard>
    ))}
  </ProductListLayout>
);

const GET_PRODUCTS = gql`
  query {
    products {
      items {
        id
        name
        price
        thumbnail
      }
    }
  }
`;

export const Products = () => (
  <Query query={GET_PRODUCTS}>{({ products }) => <ProductsList products={products.items} />}</Query>
);
