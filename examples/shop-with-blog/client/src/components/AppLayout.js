import { themed } from '@deity/falcon-ui';

export const AppLayout = themed({
  tag: 'div',

  defaultTheme: {
    appWrapper: {
      px: 'md',
      css: {
        margin: '0 auto',
        maxWidth: 1480
      }
    }
  }
});
