import { themed } from '../theme';

export const GridLayout = themed(
  {
    themeKey: 'gridLayout',
    tag: 'div'
  },
  {
    display: 'grid',
    gridGap: 'sm'
  }
);
