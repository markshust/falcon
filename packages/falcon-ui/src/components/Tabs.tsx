import { themed } from '../theme';

export const Tabs = themed({
  tag: 'ul',

  defaultTheme: {
    tabs: {
      display: 'flex',
      p: 'sm',
      m: 'none',
      bg: 'secondary',
      color: 'secondaryText',
      boxShadow: 'sm',
      css: {
        listStyle: 'none'
      },
      variants: {
        secondary: {
          boxShadow: 'none',
          color: 'black',
          bg: 'transparent'
        }
      }
    }
  }
});

export const Tab = themed({
  tag: 'li',

  defaultProps: {
    active: false
  },

  defaultTheme: {
    tab: {
      fontSize: 'md',
      flex: 0,
      mr: 'md',
      px: 'md',
      py: 'xs',
      borderBottom: 'bold',

      css: props => ({
        transitionProperty: 'border-bottom-color',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short,
        borderBottomColor: props.active ? props.theme.colors.primary : props.theme.colors.secondary,
        cursor: props.active ? 'default' : 'pointer'
      }),
      variants: {
        secondary: {
          css: props => ({
            borderBottomColor: props.active ? props.theme.colors.secondary : props.theme.colors.primary
          })
        }
      }
    }
  }
});
