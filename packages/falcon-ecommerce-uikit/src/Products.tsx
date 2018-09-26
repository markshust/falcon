import React from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { themed, Image, Text } from '@deity/falcon-ui';
import { Query } from './Query';

export const ProductCardLayout = themed({
  tag: Link,
  defaultTheme: {
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      color: 'primaryText',

      css: {
        textDecoration: 'none',
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
      <li key={product.src}>
        <ProductCardLayout to="/product">
          <Image css={{ flex: 1, minHeight: '0%' }} src={product.src} />

          <Text ellipsis>{product.name}</Text>

          <Text fontSize="lg">€ {product.price}</Text>
        </ProductCardLayout>
      </li>
    ))}
  </ProductListLayout>
);
const GET_PRODUCTS = gql`
  query {
    products @client
  }
`;

export const Products = () => <Query query={GET_PRODUCTS}>{data => <ProductsList products={data.products} />}</Query>;
