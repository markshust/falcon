import { themed } from '../theme';

export const Image = themed({
  tag: 'img',

  defaultTheme: {
    image: {
      css: {
        objectFit: 'contain',
        maxWidth: '100%'
      }
    }
  }
});
