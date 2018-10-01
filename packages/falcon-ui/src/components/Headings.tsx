import { themed } from '../theme';

export const H1 = themed({
  tag: 'h1',

  defaultTheme: {
    h1: {
      fontSize: 'xxl',
      fontWeight: 'light',
      m: 'none'
    }
  }
});

export const H2 = themed({
  tag: 'h2',

  defaultTheme: {
    h2: {
      fontSize: 'xl',
      fontWeight: 'regular',
      m: 'none'
    }
  }
});

export const H3 = themed({
  tag: 'h3',

  defaultTheme: {
    h3: {
      fontSize: 'lg',
      m: 'none'
    }
  }
});

export const H4 = themed({
  tag: 'h4',

  defaultTheme: {
    h4: {
      fontSize: 'md',
      fontWeight: 'regular',
      m: 'none'
    }
  }
});
