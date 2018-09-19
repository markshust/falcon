import { themed } from '../theme';

export const Link = themed({
  tag: 'a',

  defaultTheme: {
    link: {
      color: 'black',
      css: {
        textDecoration: 'none',
        cursor: 'pointer'
      }
    }
  }
});
