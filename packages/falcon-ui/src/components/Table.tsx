import { themed } from '../theme';

export const Table = themed(
  {
    themeKey: 'table',
    tag: 'table'
  },
  {
    borderRadius: 'xs',
    fontSize: 'sm',
    width: '100%',
    boxShadow: 'sm',
    overflowY: {
      xs: 'hidden',
      md: 'initial'
    },
    display: {
      xs: 'block',
      md: 'table'
    },
    css: {
      tableLayout: 'auto',
      borderSpacing: 0,
      borderCollapse: 'collapse',
      borderStyle: 'hidden'
    }
  }
);

export const Thead = themed(
  {
    themeKey: 'thead',
    tag: 'thead'
  },
  {
    bg: 'primary'
  }
);

export const Th = themed(
  {
    themeKey: 'th',
    tag: 'th'
  },
  {
    p: 'md',
    fontWeight: 'regular',
    fontSize: 'md',
    textAlign: 'left'
  }
);

export const Td = themed(
  {
    themeKey: 'td',
    tag: 'td'
  },
  {
    p: 'md',
    fontWeight: 'light',
    textAlign: 'left',
    lineHeight: 'large'
  }
);

export const Tr = themed(
  {
    themeKey: 'tr',
    tag: 'tr'
  },
  {
    display: 'table-row',
    borderTop: 'light',
    borderColor: 'primary'
  }
);

export const Tbody = themed({
  themeKey: 'tbody',
  tag: 'tbody'
});
