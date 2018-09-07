import { themed } from '../theme';

export const List = themed(
  {
    themeKey: 'list',
    tag: 'ul'
  },
  {
    p: 'none',
    m: 'none',
    css: {
      listStyle: 'none'
    }
  }
);

export const ListItem = themed(
  {
    themeKey: 'listItem',
    tag: 'li'
  },
  {
    pb: 'sm'
  }
);
