import { themed } from '../theme';

export const Navbar = themed({
  tag: 'ul',

  defaultTheme: {
    navbar: {
      py: 'none',
      px: 'md',
      m: 'none',
      bg: 'secondary',
      color: 'secondaryText',
      css: {
        display: 'flex',
        listStyle: 'none',
        position: 'relative'
      }
    }
  }
});

export const NavbarItem = themed({
  tag: 'li',

  defaultProps: {
    active: false
  },

  defaultTheme: {
    navbarItem: {
      p: 'md',
      fontSize: 'md',
      css: ({ theme, active }) => ({
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        listStyle: 'none',
        background: active ? theme.colors.primaryLight : 'none',
        color: active ? theme.colors.primaryText : 'none',
        ':hover': {
          background: theme.colors.primary,
          color: theme.colors.primaryText
        },
        ':hover > [role="menu"]': {
          display: 'block'
        }
      })
    }
  }
});

export const NavbarItemMenu = themed({
  tag: 'div',

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
        display: 'none',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0
      }
    }
  }
});
