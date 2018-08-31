import { themed } from '../theme';

export const Divider = themed(
  {
    themeKey: 'divider',
    tag: 'hr'
  },
  {
    display: 'block',
    mt: 'md',
    mb: 'md',
    border: 'light',
    borderColor: 'primaryDark',
    opacity: 0.3
  }
);
