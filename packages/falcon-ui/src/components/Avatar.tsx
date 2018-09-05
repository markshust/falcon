import { themed } from '../theme';

export const Avatar = themed(
  {
    themeKey: 'avatar',
    tag: 'img',
    size: 48
  },
  {
    borderRadius: 'xl',
    css: props => ({
      width: props.size,
      height: props.size,
      objectFit: 'contain',
      maxWidth: '100%'
    })
  }
);
