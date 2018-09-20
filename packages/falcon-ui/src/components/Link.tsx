import { themed } from '../theme';

export const Link = themed({
  tag: 'a',

  defaultTheme: {
    link: {
      css: {
        color: 'inherit',
        textDecoration: 'none',
        cursor: 'pointer'
      }
    }
  }
});
