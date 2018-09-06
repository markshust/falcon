import { themed } from '../theme';

export const BackgroundImage = themed(
  {
    themeKey: 'backgroundImage',
    tag: 'div',
    ratio: 1,
    src: ''
  },
  {
    css: props => ({
      backgroundImage: `url(${props.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: 0,
      paddingBottom: `${props.ratio * 100}%`
    })
  }
);
