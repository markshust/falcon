import { themed } from '../theme';

export const Card = themed(
  {
    themeKey: 'card',
    tag: 'div'
  },
  {
    display: 'block',
    p: 'md',
    boxShadow: 'xs'
  }
);
