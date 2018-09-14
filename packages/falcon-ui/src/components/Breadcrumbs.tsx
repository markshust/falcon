import { themed } from '../theme';

export const Breadcrumbs = themed({
  tag: 'ul',

  defaultTheme: {
    breadcrumbs: {
      p: 'sm',
      m: 'none',

      css: {
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none'
      }
    }
  }
});

export const Breadcrumb = themed({
  tag: 'li',

  defaultProps: {
    current: false
  },

  defaultTheme: {
    breadcrumb: {
      css: ({ theme, current }) => ({
        display: 'flex',
        pointerEvents: current ? 'none' : 'initial',
        color: current ? theme.colors.secondary : theme.colors.primaryText,

        ':after': {
          content: '"›"',
          color: 'inherit',
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.sm,
          fontSize: theme.fontSizes.lg,
          lineHeight: theme.lineHeights.small,
          fontWeight: theme.fontWeights.bold,
          display: current ? 'none' : 'block'
        }
      })
    }
  }
});
