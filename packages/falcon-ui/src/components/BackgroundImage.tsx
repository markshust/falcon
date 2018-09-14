import { themed } from '../theme';

export const BackgroundImage = themed({
  tag: 'div',

  defaultProps: {
    src: '',
    ratio: 1
  },

  defaultTheme: {
    backgroundImage: {
      css: ({ src, ratio }) => ({
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 0,
        paddingBottom: `${ratio * 100}%`
      })
    }
  }
});
