import { themed } from '../theme';

export const Button = themed({
  tag: 'button',

  defaultTheme: {
    button: {
      color: 'secondaryText',
      bg: 'secondary',
      py: 'sm',
      px: 'md',
      borderRadius: 'lg',
      boxShadow: 'sm',
      fontSize: 'md',
      lineHeight: 'small',

      css: ({ theme }) => ({
        // basic reset styles
        fontFamily: 'inherit',
        WebkitFontSmoothing: 'antialiased',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        border: 'none',

        textDecoration: 'none',
        appearance: 'none',
        ':focus': {
          outline: 'none'
        },
        // define transform that scales on active
        transitionProperty: 'transform',
        transitionTimingFunction: theme.easingFunctions.easeIn,
        transitionDuration: theme.transitionDurations.short,
        ':active': {
          transform: 'scale(0.9)'
        },
        ':hover': {
          backgroundColor: theme.colors.secondaryLight
        }
      }),

      variants: {
        secondary: {
          bg: 'primary',
          color: 'primaryText',
          border: 'regular',
          borderColor: 'secondary',

          css: ({ theme }) => ({
            ':hover': {
              backgroundColor: theme.colors.primaryLight
            }
          })
        }
      }
    }
  }
});
