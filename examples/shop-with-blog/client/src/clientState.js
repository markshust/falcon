/**
 * Defines client-side state resolvers
 */
const menuItems = [
  {
    name: 'Baking',

    subMenu: [
      {
        name: 'Bakeware'
      },
      {
        name: 'Mixers'
      },
      {
        name: 'Baking Tins'
      }
    ]
  },
  {
    name: 'Cooking',

    subMenu: [
      {
        name: 'Pots'
      },
      {
        name: 'Saute pans'
      }
    ]
  },
  {
    name: 'Dining'
  },
  {
    name: 'Drink'
  }
];

const bannerLinks = [
  {
    name: 'Contact',
    url: '/contact.html'
  },
  {
    name: 'Blog',
    url: '/blog.html'
  }
];

const products = [
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/1/1/11855281-Chasseur-Cast-Iron-Matt-Black-28cm-Pate-Terrine.jpg',
    name: 'Chasseur Cast Iron Matt ',
    price: 500
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/K/E/KET2SLOTOASTBCA-KitchenAid-Artisan-Candy-Apple-Toaster-Kettle-With-Gadget-Set.jpg',
    name: 'KitchenAid Artisan Candy Apple',
    price: 99
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/J/C/JC85-Judge-Induction-Stove-Top-Kettle-Green.jpg',
    name: 'Judge Induction Green Kettle 1.5L',
    price: 99
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/T/S/TSF02KLF04PGUK-Smeg-4-Slice-Toaster-Variable-Temp-Kettle-Set-Pastel-Green.jpg',
    name: 'Smeg 4 Slice Toaster and Smeg',
    price: 200
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/C/U/CU006-Wrendale-Hedgehog-Cushion.jpg',
    name: 'Wrendale Hedgehog Cushion',
    price: 99
  },
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
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/5/1/5141912-Fred-Pan-Strainer-Big-Blue-Whale-Design-1.jpg',
    name: 'Fred Big Blue Whale Pan Strainer',
    price: 199
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/5/K/5KES100BAC-KitchenAid-Artisan-Almond-Cream-Espresso-Maker.jpg',
    name: 'KitchenAid Artisan Almond',
    price: 99
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/K/S/KSM175PSCL-KitchenAid-Artisan-Food-Mixer-Crystal-Blue-60132-GWP.jpg',
    name: 'KitchenAid Artisan',
    price: 939
  },
  {
    src:
      'https://www.hartsofstur.com/media/catalog/product/cache/e3c1c5e5f4f6c7872a68d3422aa97082/9/F/9FC12501P-Full-Circle-Water-Lemon-570ml-Travel-Bottle-Pink-1.jpg',
    name: 'Full Circle Wherever Water',
    price: 199
  },
  {
    src:
      '//www.hartsofstur.com/pub/media/catalog/product/cache/0f831c1845fc143d00d6d1ebc49f446a/5/1/5161076-Fred-Novelty-Egg-Ring-Funny-Side-Up-Frog-Design-1.jpg',
    name: 'Fred Frog Funny',
    price: 99
  }
];

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
const breadcrumbs = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Cooking',
    url: '/cooking'
  },
  {
    name: 'Pots & Pans',
    url: '/pots'
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

export default {
  defaults: {},
  resolvers: {
    Query: {
      menuItems: () => menuItems,
      bannerLinks: () => bannerLinks,
      products: () => products,
      footerSections: () => footerSections,
      languages: () => languages,
      breadcrumbs: () => breadcrumbs,
      sortOrders: () => sortOrders
    }
  }
};
