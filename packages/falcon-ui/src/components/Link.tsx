import { themed } from '../theme';

export const Link = themed(
  {
    themeKey: 'link',
    tag: 'a'
  },
  {
    fontSize: 'md',
    css: {
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }
);
