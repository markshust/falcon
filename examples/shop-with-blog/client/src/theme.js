import React from 'react';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import ChevronUp from 'react-feather/dist/icons/chevron-up';
import User from 'react-feather/dist/icons/user';
import { createTheme } from '@deity/falcon-ui';

const logo = require('../public/logo.svg');
const loader = require('../public/loader.svg');

export const deityGreenTheme = createTheme({
  colors: {
    primary: '#CACACA',
    primaryLight: '#F4F4F4',
    primaryDark: '#CACACA',
    primaryText: '#000',
    secondary: '#A9CF38',
    secondaryLight: '#CBDE6E',
    secondaryDark: '#A9CF38',
    secondaryText: '#fff',
    error: '#E74C3C'
  },

  fonts: {
    sans: '"Roboto", sans-serif'
  },

  borderRadius: {
    none: 0,
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  },
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
