import { themed } from '../theme';

export const Table = themed({
  themeKey: 'table',
  as: 'table'
})({
  tableLayout: 'auto',
  borderSpacing: 0,
  borderCollapse: 'collapse',
  borderStyle: 'hidden'
});

export const Thead = themed({
  themeKey: 'thead',
  as: 'thead'
})({});

export const Th = themed({
  themeKey: 'th',
  as: 'th'
})({});

export const Td = themed({
  themeKey: 'td',
  as: 'td'
})({});

export const Tr = themed({
  themeKey: 'tr',
  as: 'tr'
})({});

export const Tbody = themed({
  themeKey: 'tbody',
  as: 'tbody'
})({});
