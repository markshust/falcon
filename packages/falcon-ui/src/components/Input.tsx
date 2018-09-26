import { themed, CSSObject } from '../theme';

function placeholder(styles: CSSObject): CSSObject {
  return {
    '::-webkit-input-placeholder': styles,
    '::-moz-placeholder': styles,
    ':-ms-input-placeholder`': styles,
    '::-ms-input-placeholder`': styles
  };
}

export const Input = themed({
  tag: 'input',

  defaultProps: {
    type: 'text',
    invalid: false
  },

  defaultTheme: {
    input: {
      py: 'sm',
      px: 'md',
      border: 'regular',
      borderRadius: 'xl',

      css: ({ invalid, theme }) => ({
        ...placeholder({
          color: theme.colors.primaryText
        }),
        ':focus': {
          outline: 'none',
          borderColor: invalid ? theme.colors.error : theme.colors.secondary
        },
        borderColor: invalid ? theme.colors.error : theme.colors.primaryDark,
        fontFamily: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
        WebkitAppearance: 'none',
        width: '100%'
      })
    }
  }
});
