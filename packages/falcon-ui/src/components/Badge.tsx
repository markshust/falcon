import { themed } from '../theme';

export const Badge = themed({
  tag: 'div',

  defaultTheme: {
    badge: {
      bg: 'secondary',
      color: 'secondaryText',
      px: 'md',
      py: 'xs',
      borderRadius: 'md',

      css: {
        display: 'inline-block',
        textTransform: 'uppercase'
      }
    }
  }
});
