import { themed } from '../theme';

export const Avatar = themed({
  tag: 'img',

  defaultTheme: {
    avatar: {
      borderRadius: 'xl',
      size: 48,
      css: {
        objectFit: 'contain',
        maxWidth: '100%'
      }
    }
  }
});
