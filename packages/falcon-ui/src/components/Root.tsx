import { themed } from '../theme';

export const Root = themed(
  {
    themeKey: 'root',
    tag: 'div'
  },
  {
    fontFamily: 'sans',
    fontSize: 'sm',
    lineHeight: 'default',
    color: 'primaryText',
    css: {
      '*': {
        boxSizing: 'border-box'
      }
    }
  }
);
