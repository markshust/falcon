import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($categoryId: Int!, $page: Int = 1) {
    category(id: $categoryId) {
      name
    }
    products(
      categoryId: $categoryId
      includeSubcategories: true
      query: { page: $page }
      sortOrders: [{ field: "name" }]
    ) {
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
        nextPage
      }
    }
    sortOrders @client
  }
`;

export const fetchMore = (data: any, apolloFetchMore: any) =>
  apolloFetchMore({
    variables: {
      page: data.products.pagination.nextPage
    },
    updateQuery: (prev: any, { fetchMoreResult }: { fetchMoreResult: any }) => {
      if (!fetchMoreResult) {
        return prev;
      }

      return {
        ...prev,
        ...{
          products: {
            ...prev.products,
            items: [...prev.products.items, ...fetchMoreResult.products.items],
            pagination: { ...fetchMoreResult.products.pagination }
          }
        }
      };
    }
  });

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
    fetchMore,
    notifyOnNetworkStatusChange: true,
    getTranslations,
    translationsNamespaces: ['shop']
  };
}
