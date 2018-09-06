import { themed, CSSObject } from '../theme';

function placeholder(styles: CSSObject): CSSObject {
  return {
    '::-webkit-input-placeholder': styles,
    '::-moz-placeholder': styles,
    ':-ms-input-placeholder`': styles,
    '::-ms-input-placeholder`': styles
  };
}

export const Input = themed(
  {
    themeKey: 'input',
    tag: 'input',
    type: 'text',
    invalid: false
  },
  {
    p: 'sm',
    border: 'regular',
    borderRadius: 'xs',

    css: props => ({
      ...placeholder({
        color: props.theme.colors.primaryDark
      }),
      ':focus': {
        outline: 'none',
        borderColor: props.invalid ? props.theme.colors.error : props.theme.colors.secondary
      },
      borderColor: props.invalid ? props.theme.colors.error : props.theme.colors.primaryDark,
      fontFamily: 'inherit',
      lineHeight: 'inherit',
      color: 'inherit',
      WebkitAppearance: 'none',
      width: '100%'
    })
  }
);
