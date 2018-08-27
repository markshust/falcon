import { themed } from '../theme';

export const Table = themed({
  themeKey: 'table',
  tag: 'table'
})({
  tableLayout: 'auto',
  borderSpacing: 0,
  borderCollapse: 'collapse',
  borderStyle: 'hidden'
});

export const Thead = themed({
  themeKey: 'thead',
  tag: 'thead'
})({});

export const Th = themed({
  themeKey: 'th',
  tag: 'th'
})({});

export const Td = themed({
  themeKey: 'td',
  tag: 'td'
})({});

export const Tr = themed({
  themeKey: 'tr',
  tag: 'tr'
})({});

export const Tbody = themed({
  themeKey: 'tbody',
  tag: 'tbody'
})({});
