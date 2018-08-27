import { themed } from '../theme';

export const Root = themed({
  themeKey: 'root',
  tag: 'div'
})({
  '*': {
    boxSizing: 'border-box'
  }
});
