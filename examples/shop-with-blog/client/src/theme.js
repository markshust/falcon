import React from 'react';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import ChevronUp from 'react-feather/dist/icons/chevron-up';
import User from 'react-feather/dist/icons/user';
import Close from 'react-feather/dist/icons/x';
import Remove from 'react-feather/dist/icons/x-circle';
import { createTheme } from '@deity/falcon-ui';
import logo from './assets/logo.svg';

export const deityGreenTheme = createTheme({
  icons: {
    logo: {
      icon: props => <img src={logo} alt="logo" {...props} />,
      height: 70,
      width: 'auto',
      display: 'block'
    },
    loader: {
      icon: props => (
        <svg viewBox="0 0 50 50" {...props}>
          <path
            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
            transform="rotate(241.969 25 25)"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      ),
      size: 50,
      stroke: 'transparent',
      fill: 'secondary'
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
      icon: Close,
      css: {
        cursor: 'pointer'
      }
    },
    remove: {
      icon: Remove
    }
  },
  components: {
    button: {
      boxShadow: 'none'
    }
  }
});
