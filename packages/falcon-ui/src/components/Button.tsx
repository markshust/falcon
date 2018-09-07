import { themed } from '../theme';

export const Button = themed(
  {
    themeKey: 'button',
    tag: 'button'
  },
  {
    css: props => ({
      // basic reset styles
      fontFamily: 'inherit',
      WebkitFontSmoothing: 'antialiased',
      display: 'inline-block',
      border: 'none',
      textDecoration: 'none',
      appearance: 'none',
      ':focus': {
        outline: 'none'
      },
      // define transform that scales on active
      transitionProperty: 'transform',
      transitionTimingFunction: props.theme.easingFunctions.easeIn,
      transitionDuration: props.theme.transitionDurations.short,
      ':active': {
        transform: 'scale(0.9)'
      },
      ':hover': {
        backgroundColor: props.theme.colors.secondaryLight
      }
    }),
    // default themable props
    color: 'secondaryText',
    bg: 'secondary',
    p: 'sm',
    textAlign: 'center',
    borderRadius: 'sm',
    boxShadow: 'sm',
    fontSize: 'md',
    variants: {
      secondary: {
        bg: 'primary',
        color: 'primaryText',
        border: 'regular',
        borderColor: 'secondary',
        css: props => ({
          ':hover': {
            backgroundColor: props.theme.colors.primaryLight
          }
        })
      }
    }
  }
);
