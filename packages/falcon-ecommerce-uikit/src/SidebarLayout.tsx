import { themed } from '@deity/falcon-ui';

export const SidebarLayout = themed({
  tag: 'div',

  defaultTheme: {
    sidebarLayout: {
      width: {
        xs: '80vw',
        sm: 510
      },

      px: {
        xs: 'md',
        md: 'lg'
      },
      py: 'md'
    }
  }
});
