import { themed } from '../theme';

export const Select = themed(
  {
    themeKey: 'select',
    tag: 'select'
  },
  {
    p: 'sm',
    border: 'regular',
    borderRadius: 'xs',
    borderColor: 'primaryDark',

    css: props => ({
      display: 'block',
      fontFamily: 'inherit',
      width: '100%',
      outline: 'none',
      position: 'relative',
      ':focus': {
        outline: 'none',
        borderColor: props.theme.colors.secondary
      }
    })
  }
);

export const Option = themed(
  {
    themeKey: 'option',
    tag: 'option'
  },
  {
    p: 'xs',
    fontSize: 'sm',
    css: {
      fontFamily: 'inherit'
    }
  }
);
