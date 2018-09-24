import { themed } from '../theme';

export const Group = themed({
  tag: 'div',

  defaultTheme: {
    group: {
      css: {
        display: 'flex',
        // use first of type not first-child
        // details: https://github.com/emotion-js/emotion/issues/637
        '& > :first-of-type': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: 'none'
        },
        '> :not(:first-of-type):not(:last-child)': {
          borderRadius: 0,
          boxShadow: 'none'
        },
        '> :last-child': {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          boxShadow: 'none'
        }
      }
    }
  }
});
