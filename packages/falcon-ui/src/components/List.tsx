import { themed } from '../theme';

export const List = themed(
  {
    themeKey: 'list',
    tag: 'ul'
  },
  {
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
