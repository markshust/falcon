import { themed } from '../theme';

export const List = themed({
  tag: 'ul',
  defaultTheme: {
    list: {
      p: 'none',
      m: 'none',
      css: {
        listStyle: 'none'
      }
    }
  }
});

export const ListItem = themed({
  tag: 'li',
  defaultTheme: {
    listItem: {
      p: 'none'
    }
  }
});
