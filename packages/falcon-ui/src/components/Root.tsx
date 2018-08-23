import { themed } from '../theme';

export const Root = themed({
  themeKey: 'root',
  as: 'div'
})({
  '*': {
    boxSizing: 'border-box'
  }
});
