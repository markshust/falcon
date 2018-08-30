import { themed } from '../theme';

export const Image = themed(
  {
    themeKey: 'image',
    tag: 'img'
  },
  {
    css: {
      objectFit: 'contain',
      maxWidth: '100%'
    }
  }
);
