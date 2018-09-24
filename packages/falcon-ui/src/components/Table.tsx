import { themed } from '../theme';

export const Table = themed({
  tag: 'table',

  defaultTheme: {
    table: {
      borderRadius: 'xs',
      fontSize: 'sm',
      boxShadow: 'sm',
      css: {
        display: {
          xs: 'block',
          md: 'table'
        },
        width: '100%',
        overflowY: {
          xs: 'hidden',
          md: 'initial'
        },
        tableLayout: 'auto',
        borderSpacing: 0,
        borderCollapse: 'collapse',
        borderStyle: 'hidden'
      }
    }
  }
});

export const Thead = themed({
  tag: 'thead',

  defaultTheme: {
    thead: {
      bg: 'primary'
    }
  }
});

export const Th = themed({
  tag: 'th',

  defaultTheme: {
    th: {
      p: 'md',
      fontWeight: 'regular',
      fontSize: 'md',
      css: {
        textAlign: 'left'
      }
    }
  }
});

export const Td = themed({
  tag: 'td',
  defaultTheme: {
    td: {
      p: 'md',
      fontWeight: 'light',
      lineHeight: 'large',
      css: {
        textAlign: 'left'
      }
    }
  }
});

export const Tr = themed({
  tag: 'tr',
  defaultTheme: {
    tr: {
      display: 'table-row',
      borderTop: 'light',
      borderColor: 'primary'
    }
  }
});

export const Tbody = themed({
  tag: 'tbody',
  defaultTheme: {
    tbody: {}
  }
});
