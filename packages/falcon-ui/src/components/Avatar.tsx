import { themed } from '../theme';

export const Avatar = themed({
  tag: 'img',

  defaultProps: {
    size: 48
  },

  defaultTheme: {
    avatar: {
      borderRadius: 'xl',

      css: ({ size }) => ({
        width: size,
        height: size,
        objectFit: 'contain',
        maxWidth: '100%'
      })
    }
  }
});
