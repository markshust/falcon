import { themed } from '../theme';

export const Link = themed({
  tag: 'a',

  defaultTheme: {
    link: {
      css: {
        textDecoration: 'none',
        cursor: 'pointer'
      }
    }
  }
});
