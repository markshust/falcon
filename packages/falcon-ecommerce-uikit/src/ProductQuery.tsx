import React from 'react';
import gql from 'graphql-tag';
import { Query } from './Query';

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: Int!) {
    product(id: $id) {
      id
      sku
      name
      description
      price
      currency
      gallery {
        full
        thumbnail
      }
      configurableOptions {
        id
        attributeId
        label
        productId
        values {
          valueIndex
          label
          inStock
        }
      }
      seo {
        title
        description
        keywords
      }
      breadcrumbs {
        id
        name
        urlPath
        urlKey
        urlQuery
      }
    }
  }
`;

export const ProductQuery: React.SFC<{
  id: number;
  children: (data: any) => React.ReactNode;
}> = ({ id, children }) => (
  <Query query={GET_PRODUCT} variables={{ id }}>
    {({ product }) => children(product)}
  </Query>
);
