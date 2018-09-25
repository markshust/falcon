import { themed } from '../theme';

export const Badge = themed({
  tag: 'div',

  defaultTheme: {
    badge: {
      bg: 'secondary',
      color: 'secondaryText',
      px: 'sm',
      py: 'xs',
      borderRadius: 'lg',

      css: {
        display: 'inline-block',
        textTransform: 'uppercase'
      }
    }
  }
});
