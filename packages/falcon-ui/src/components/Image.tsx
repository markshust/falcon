import { themed } from '../theme';

export const Image = themed({
  themeKey: 'image',
  tag: 'img'
})({
  objectFit: 'contain',
  maxWidth: '100%'
});
