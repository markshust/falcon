import gql from 'graphql-tag';
import { Query } from './Query';

export const product = gql`
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

function getTranslations(t: reactI18Next.TranslationFunction /* , product: any */) {
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

export class ProductQuery extends Query<any> {
  static defaultProps = {
    query: product,
    getTranslations,
    translationsNamespaces: ['shop']
  };
}
