import React from 'react';
import { Value } from 'react-powerplug';

import { themed } from '../theme';
import { Box } from './Box';

export const Navbar = themed({
  tag: 'ul',

  defaultTheme: {
    navbar: {
      p: 'none',
      m: 'none',
      bgFullWidth: 'secondary',
      color: 'secondaryText',
      css: {
        display: 'flex',
        listStyle: 'none',
        position: 'relative'
      }
    }
  }
});

type NavbarContextType = {
  open?: boolean;
};

const NavbarItemContext = React.createContext<NavbarContextType>({});

const NavbarItemInnerDOM: React.SFC<any> = props => (
  <Value initial={false}>
    {({ set, value }) => (
      <NavbarItemContext.Provider value={{ open: value }}>
        <Box
          as="li"
          {...props}
          onMouseEnter={() => set(true)}
          onMouseLeave={() => set(false)}
          onClick={() => set(false)}
        />
      </NavbarItemContext.Provider>
    )}
  </Value>
);

export const NavbarItem = themed({
  tag: NavbarItemInnerDOM,

  defaultProps: {
    active: false
  },

  defaultTheme: {
    navbarItem: {
      fontSize: 'md',
      css: ({ theme, active }) => ({
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        listStyle: 'none',
        background: active ? theme.colors.primaryLight : 'none',
        color: active ? theme.colors.primaryText : theme.colors.secondaryText,

        ':hover': {
          background: theme.colors.primary,
          color: theme.colors.primaryText
        }
      })
    }
  }
});

const NavbarItemMenuInnerDOM: React.SFC<any> = props => (
  <NavbarItemContext.Consumer>
    {({ open }) => <Box {...props} display={open ? 'block' : 'none'} />}
  </NavbarItemContext.Consumer>
);

export const NavbarItemMenu = themed({
  tag: NavbarItemMenuInnerDOM,

  defaultProps: {
    role: 'menu'
  },

  defaultTheme: {
    navbarItemMenu: {
      p: 'sm',
      bg: 'primary',
      color: 'primaryText',
      boxShadow: 'xs',
      css: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0
      }
    }
  }
});
