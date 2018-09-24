import { themed } from '../theme';

export const Dropdown = themed({
  tag: 'div',

  defaultTheme: {
    dropdown: {
      display: 'flex',
      borderRadius: 'xs',
      border: 'light',
      borderColor: 'primaryDark',
      css: ({ theme }) => ({
        position: 'relative',
        ':hover': {
          borderColor: theme.colors.primary
        }
      })
    }
  }
});

export const DropdownLabel = themed({
  tag: 'div',

  defaultProps: {
    active: false
  },

  defaultTheme: {
    dropdownLabel: {
      display: 'flex',
      p: 'sm',
      fontSize: 'md',
      justifyContent: 'space-between',
      css: ({ active, theme }) => ({
        backgroundColor: active ? theme.colors.primaryDark : 'none',
        color: active ? theme.colors.primaryText : 'none',
        width: '100%',
        cursor: 'pointer'
      })
    }
  }
});

export const DropdownMenu = themed({
  tag: 'ul',

  defaultProps: {
    open: false
  },

  defaultTheme: {
    dropdownMenu: {
      m: 'none',
      p: 'none',
      borderRadius: 'xs',
      boxShadow: 'xs',
      bg: 'white',
      css: ({ theme, open }) => ({
        position: 'absolute',
        zIndex: theme.zIndex.backdrop + 1,
        listStyle: 'none',
        display: open ? 'block' : 'none',
        top: '100%',
        left: 0,
        right: 0
      })
    }
  }
});

export const DropdownMenuItem = themed({
  tag: 'li',

  defaultTheme: {
    dropdownMenuItem: {
      p: 'sm',
      css: ({ theme }) => ({
        cursor: 'pointer',
        ':hover': {
          background: theme.colors.primaryLight
        }
      })
    }
  }
});
