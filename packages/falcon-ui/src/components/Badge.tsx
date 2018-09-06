import { themed } from '../theme';

export const Badge = themed(
  {
    themeKey: 'badge',
    tag: 'div'
  },
  {
    bg: 'secondary',
    color: 'secondaryText',
    pl: 'md',
    pr: 'md',
    pt: 'xs',
    pb: 'xs',
    borderRadius: 'md',
    css: {
      display: 'inline-block',
      textTransform: 'uppercase'
    }
  }
);
