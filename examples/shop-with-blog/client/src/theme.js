import React from 'react';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import ChevronUp from 'react-feather/dist/icons/chevron-up';
import User from 'react-feather/dist/icons/user';
import Close from 'react-feather/dist/icons/x';
import { createTheme } from '@deity/falcon-ui';
import logo from './assets/logo.svg';
import loader from './assets/loader.svg';

export const deityGreenTheme = createTheme({
  icons: {
    logo: {
      icon: props => <img src={logo} alt="logo" {...props} />,
      height: 70,
      width: 'auto'
    },
    loader: {
      icon: props => <img src={loader} alt="loader" {...props} />,
      size: 50
    },
    cart: {
      icon: ShoppingCart
    },
    user: {
      icon: User
    },
    dropdownArrowDown: {
      icon: ChevronDown,
      size: 22,
      ml: 'xs'
    },
    dropdownArrowUp: {
      icon: ChevronUp,
      size: 22,
      ml: 'xs'
    },
    close: {
      icon: Close
    }
  },
  components: {
    h2: {
      fontWeight: 'bold'
    },
    root: {
      css: {
        overflowX: 'hidden'
      }
    }
  }
});
