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

const Product = {
  title: 'KitchenAid Artisan 175 Candy Apple Food Mixer With FREE Gifts',
  price: '€ 99',
  sku: 'KSM175PSCA',
  description:
    'The KitchenAid Classic food mixer like the Artisan mixer features an original planetary action eliminating the need to rotate the bowl when mixing by spinning the beater clockwise and the shaft counter clockwise, moving the beater to the edge of the bowl in 67 different points ensuring quick, complete mixing. 2 year domestic guarantee.',

  images: [
    {
      thumb:
        'https://www.hartsofstur.com/media/catalog/product/cache/278b263457593076ca6065f245675a67/K/S/KSM175PSCA-KitchenAid-Artisan-Food-Mixer-Candy-Apple-60132-GWP.jpg',
      url:
        'https://www.hartsofstur.com/media/catalog/product/cache/a2ab128dd7882d54c4899772914c19b3/K/S/KSM175PSCA-KitchenAid-Artisan-Food-Mixer-Candy-Apple-60132-GWP.jpg'
    },
    {
      thumb:
        'https://www.hartsofstur.com/media/catalog/product/cache/278b263457593076ca6065f245675a67/K/S/KSM175PSCA-KitchenAid-Artisan-Mixer-Candy-Apple-1.jpg',
      url:
        'https://www.hartsofstur.com/media/catalog/product/cache/a2ab128dd7882d54c4899772914c19b3/K/S/KSM175PSCA-KitchenAid-Artisan-Mixer-Candy-Apple-1.jpg'
    },
    {
      thumb:
        'https://www.hartsofstur.com/media/catalog/product/cache/278b263457593076ca6065f245675a67/K/S/KSM175PSCA-KitchenAid-Artisan-Mixer-Candy-Apple-2.jpg',
      url:
        'https://www.hartsofstur.com/media/catalog/product/cache/a2ab128dd7882d54c4899772914c19b3/K/S/KSM175PSCA-KitchenAid-Artisan-Mixer-Candy-Apple-2.jpg'
    }
  ],

  meta: [
    {
      name: 'Description',
      content:
        'Chasseur Cookware - since its introduction to the UK in 1994, Chasseur has established itself as a serious player in the cast iron cookware market. Chasseurs focus is to supply top quality enamelled cast iron cookware at the best possible price. Chasseur cast iron cookware is manufacture in the Ardennes region of France from top quality materials by skilled craftsmen using time honoured techniques that have been honed to perfection over the last 70 years. Every stage of manufacture is checked by hand, polished, enamelled and finished by hand to ensure that every piece meets the highest quality standard.'
    },
    {
      name: 'Delivery',
      content:
        'our delivery when and where you want it!, DPD convenient one hour delivery window notified on the morning of your delivery, choose your preferred delivery day up two weeks in advance via our integrated check out, (Saturday, Sunday & AM deliveries charge extra), or choose to have your parcel delivered to your nearest DPD click & collect Pick Up Point. FREE DELIVERY TO MAINLAND U.K. on all orders £50 and over in value by DPD Courier on weekdays during normal working hours. £4.99 charge for all orders below £50 in value (delivery by DPD Courier) £2.00 charge for all orders below £25 in value (delivery by Royal Mail 3-7 working days). (Excludes Kitchen Trolleys For Delivery To Scottish Highlands) '
    },
    {
      name: 'Returns',
      content:
        'UK Mainland customers who are not delighted with their purchases for any reason whatsoever may return their products within 28 days and request a full no-quibble refund. (In accordance with the terms below) Upon receipt of the purchases we will give you a full refund of the amount paid or an exchange credit as required.'
    }
  ]
};

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
      sortOrders: () => sortOrders,
      product: () => Product
    }
  }
};
