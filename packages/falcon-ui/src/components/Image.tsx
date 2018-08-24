import { themed } from '../theme';

export const Image = themed({
  themeKey: 'image',
  as: 'img'
})({
  objectFit: 'contain',
  maxWidth: '100%'
});
