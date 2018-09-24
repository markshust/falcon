import { themed } from '../theme';

export const Select = themed({
  tag: 'select',

  defaultTheme: {
    select: {
      p: 'sm',
      border: 'regular',
      borderRadius: 'xs',
      borderColor: 'primaryDark',

      css: ({ theme }) => ({
        display: 'block',
        fontFamily: 'inherit',
        width: '100%',
        outline: 'none',
        position: 'relative',
        ':focus': {
          outline: 'none',
          borderColor: theme.colors.secondary
        }
      })
    }
  }
});

export const Option = themed({
  tag: 'option',

  defaultTheme: {
    option: {
      p: 'xs',
      fontSize: 'sm',
      css: {
        fontFamily: 'inherit'
      }
    }
  }
});
