import gql from 'graphql-tag';
import { Query } from '../Query/Query';

const GET_PRODUCTS = gql`
  query GET_PRODUCTS($categoryId: Int!) {
    category(id: $categoryId) {
      name
    }
    products(categoryId: $categoryId, includeSubcategories: true) {
      items {
        id
        name
        price
        thumbnail
        urlPath
      }
      pagination {
        currentPage
        totalItems
      }
    }
    sortOrders @client
  }
`;

function getTranslations(t: reactI18Next.TranslationFunction, data: any) {
  const {
    products: { items, pagination }
  } = data;

  return {
    category: {
      pagination: {
        showingOutOf: t('category.pagination.showingOutOf', {
          itemsCount: items.length,
          totalItems: pagination.totalItems
        }),
        showMore: t('category.pagination.showMore')
      }
    }
  };
}

export class CategoryQuery extends Query<any> {
  static defaultProps = {
    query: GET_PRODUCTS,
    getTranslations,
    translationsNamespaces: ['shop']
  };
}
