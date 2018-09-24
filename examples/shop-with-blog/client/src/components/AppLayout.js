import { themed } from '@deity/falcon-ui';

export const AppLayout = themed({
  tag: 'div',

  defaultTheme: {
    AppLayout: {
      px: {
        xs: 'sm',
        md: 'md'
      },
      css: {
        margin: '0 auto',
        maxWidth: 1480
      }
    }
  }
});
