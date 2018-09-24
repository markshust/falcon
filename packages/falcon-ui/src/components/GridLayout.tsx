import { themed } from '../theme';

export const GridLayout = themed({
  tag: 'div',

  defaultTheme: {
    gridLayout: {
      display: 'grid',
      gridGap: 'sm'
    }
  }
});
