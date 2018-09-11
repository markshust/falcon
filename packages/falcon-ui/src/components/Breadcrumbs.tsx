import { themed } from '../theme';

export const Breadcrumbs = themed(
  {
    themeKey: 'breadcrumbs',
    tag: 'ul'
  },
  {
    p: 'sm',
    m: 'none',
    css: {
      display: 'flex',
      flexWrap: 'wrap',
      appearance: 'none',
      listStyle: 'none'
    }
  }
);

export const Breadcrumb = themed(
  {
    themeKey: 'breadcrumb',
    tag: 'li',
    current: false
  },
  {
    css: props => ({
      display: 'flex',
      appearance: 'none',
      pointerEvents: props.current ? 'none' : 'initial',
      color: props.current ? props.theme.colors.secondary : props.theme.colors.primaryText,
      ':after': {
        content: '"›"',
        color: 'inherit',
        paddingLeft: props.theme.spacing.sm,
        paddingRight: props.theme.spacing.sm,
        fontSize: props.theme.fontSizes.lg,
        lineHeight: props.theme.lineHeights.small,
        fontWeight: props.theme.fontWeights.bold,
        display: props.current ? 'none' : 'block'
      }
    })
  }
);
