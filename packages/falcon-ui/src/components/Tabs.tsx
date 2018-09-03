import { themed } from '../theme';

export const Tabs = themed(
  {
    themeKey: 'tabs',
    tag: 'ul'
  },
  {
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
);

export const Tab = themed(
  {
    themeKey: 'tab',
    tag: 'li',
    active: false
  },
  {
    fontSize: 'md',
    flex: 0,
    mr: 'md',
    pl: 'md',
    pr: 'md',
    pt: 'xs',
    pb: 'xs',

    transitionTimingFunction: 'easeIn',
    transitionDuration: 'short',
    borderBottom: 'bold',
    css: props => ({
      transitionProperty: 'border-bottom-color',
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
);
