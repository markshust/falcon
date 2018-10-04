import gql from 'graphql-tag';

/**
 * Defines client-side state resolvers
 */

const languages = [
  {
    name: 'English',
    code: 'en',
    active: false
  },
  {
    name: 'Dutch',
    code: 'nl',
    active: true
  }
];

const sortOrders = [
  {
    name: 'Price ascending',
    id: 'asc',
    active: true
  },
  {
    name: 'Price descending',
    id: 'desc'
  }
];

const basketItems = [
  {
    src: 'https://picsum.photos/600/600?image=824',
    name: 'Zoku Round Pop Moulds',
    price: 199
  },
  {
    src: 'https://picsum.photos/600/600?image=493',
    name: 'Fusionbrands Poachpod Egg Poacher',
    price: 299
  }
];

export default {
  defaults: {
    miniCart: {
      open: false
    }
  },

  resolvers: {
    Query: {
      languages: () => languages,
      sortOrders: () => sortOrders,
      basketItems: () => basketItems
    },

    Mutation: {
      toggleMiniCart: (_, _variables, { cache }) => {
        const { miniCart } = cache.readQuery({
          query: gql`
            query miniCart {
              miniCart @client {
                open
              }
            }
          `
        });

        const data = {
          miniCart: { ...miniCart, open: !miniCart.open }
        };

        cache.writeData({ data });

        return null;
      }
    }
  }
};
