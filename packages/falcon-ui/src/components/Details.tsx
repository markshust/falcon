import { themed } from '../theme';

export const Details = themed({
  tag: 'details',

  defaultProps: {
    open: false
  },

  defaultTheme: {
    details: {
      css: props => ({
        display: 'flex',
        flexDirection: 'column',

        '> :not(summary)': {
          display: props.open ? 'block' : 'none',
          flex: props.open ? '1' : 0
        },

        '> summary::-webkit-details-marker': {
          display: 'none'
        },

        '> summary:after': {
          content: props.open ? '"-"' : '"+"',
          marginLeft: props.theme.spacing.sm,
          fontSize: props.theme.fontSizes.lg,
          lineHeight: 0.6,
          fontWeight: props.theme.fontWeights.bold,
          color: props.theme.colors.primaryText
        }
      })
    }
  }
});

export const Summary = themed({
  tag: 'summary',

  defaultTheme: {
    summary: {
      fontSize: 'md',
      py: 'sm',
      px: 'md',
      mb: 'xs',
      bg: 'primary',
      lineHeight: 'small',
      borderRadius: 'md',
      css: {
        outline: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
      }
    }
  }
});

export const DetailsContent = themed({
  tag: 'article',

  defaultTheme: {
    detailsContent: {
      py: 'md',
      pl: 'md'
    }
  }
});
