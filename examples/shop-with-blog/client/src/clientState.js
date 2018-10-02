import gql from 'graphql-tag';

/**
 * Defines client-side state resolvers
 */

const footerSections = [
  {
    name: 'Customer service',
    links: [
      {
        name: 'Track order',
        url: '/'
      },
      {
        name: 'Return policy',
        url: '/'
      },
      {
        name: 'FAQs',
        url: '/'
      },
      {
        name: 'Terms',
        url: '/'
      }
    ]
  },
  {
    name: 'About us',
    links: [
      {
        name: 'Blog',
        url: '/'
      },
      {
        name: 'Cookies',
        url: '/'
      },
      {
        name: 'About us',
        url: '/'
      },
      {
        name: 'Jobs',
        url: '/'
      }
    ]
  },
  {
    name: 'Terms',
    links: [
      {
        name: 'Blog',
        url: '/'
      },
      {
        name: 'Cookies',
        url: '/'
      },
      {
        name: 'About us',
        url: '/'
      },
      {
        name: 'Jobs',
        url: '/'
      }
    ]
  }
];

const languages = [
  {
    name: 'English',
    code: 'en',
    active: false
  },
  {
    name: 'Netherlands',
    code: 'ne',
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
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/Z/K/ZK201-Zoku-Round-Pops.jpg',
    name: 'Zoku Round Pop Moulds',
    price: 199
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/8/0/8004111-Poach-Pod-Egg-Poacher.jpg',
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
      footerSections: () => footerSections,
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
