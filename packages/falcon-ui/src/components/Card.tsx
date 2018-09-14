import { themed } from '../theme';

export const Card = themed({
  tag: 'div',
  defaultTheme: {
    card: {
      display: 'block',
      boxShadow: 'xs',
      p: 'md',
      bg: 'white'
    }
  }
});
