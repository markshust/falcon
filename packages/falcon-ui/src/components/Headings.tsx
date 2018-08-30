import { themed } from '../theme';

export const H1 = themed(
  {
    themeKey: 'h1',
    tag: 'h1'
  },
  {
    fontSize: 'xxl',
    fontWeight: 'light',
    lineHeight: 'small',
    p: 'sm',
    m: 'none'
  }
);

export const H2 = themed(
  {
    themeKey: 'h2',
    tag: 'h2'
  },
  {
    fontSize: 'xl',
    fontWeight: 'bold',
    lineHeight: 'small',
    p: 'sm',
    m: 'none'
  }
);

export const H3 = themed(
  {
    themeKey: 'h3',
    tag: 'h3'
  },
  {
    fontSize: 'lg',
    fontWeight: 'bold',
    lineHeight: 'small',
    p: 'sm',
    m: 'none'
  }
);

export const H4 = themed(
  {
    themeKey: 'h4',
    tag: 'h4'
  },
  {
    fontSize: 'md',
    fontWeight: 'regular',
    lineHeight: 'small',
    p: 'sm',
    m: 'none'
  }
);
