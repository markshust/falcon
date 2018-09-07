import { themed } from '../theme';

export const Link = themed(
  {
    themeKey: 'link',
    tag: 'a'
  },
  {
    color: 'primaryText',
    fontSize: 'md',
    css: {
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }
);
