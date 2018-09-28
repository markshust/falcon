import React from 'react';
import gql from 'graphql-tag';
import { I18n } from 'react-i18next';
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

function getTranslations(t: reactI18Next.TranslationFunction /*, product: any*/) {
  return {
    sku: t('product.sku'),
    inStock: t('product.inStock'),
    reviews: t('product.reviews', { count: 3 }),
    addToCart: t('product.addToCart'),
    tabs: {
      reviews: '...'
    }
  };
}

export type ProductTranslations = ReturnType<typeof getTranslations>;

export class ProductQuery extends React.PureComponent<{
  id: number;
  children: (props: { data: any; translations: ProductTranslations }) => React.ReactNode;
}> {
  render() {
    const { id, children } = this.props;

    return (
      <Query query={GET_PRODUCT} variables={{ id }}>
        {({ product }) => (
          <I18n ns={['shop']}>{t => children({ data: product, translations: getTranslations(t) })}</I18n>
        )}
      </Query>
    );
  }
}
