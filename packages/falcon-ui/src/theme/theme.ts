export const theme = {
  colors: {
    primary: '#eef0f2',
    primaryLight: '#f8f8f8',
    primaryDark: '#e8e8e8',
    primaryText: '#5f6367',

    secondary: '#2196f3',
    secondaryLight: '#6ec6ff',
    secondaryDark: '#0069c0',
    secondaryText: '#ffffff',

    error: '#f44336',
    errorText: '#000000',
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent'
  },

  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },

  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 64
  },

  fonts: {
    sans: '"Segoe UI", system-ui, sans-serif',
    mono: '"SF Mono", "Roboto Mono", Menlo, monospace'
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 34,
    xxxl: 48
  },

  fontWeights: {
    light: 300,
    regular: 400,
    bold: 700
  },

  lineHeights: {
    small: 1,
    default: 1.4,
    large: 2
  },

  letterSpacings: {
    normal: 'normal',
    caps: '0.025em'
  },

  borders: {
    light: '0.5px solid',
    regular: '1px solid',
    bold: '2px solid'
  },

  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 32,
    xl: 333
  },

  boxShadows: {
    none: 'none',
    xs: '0 0 2px 0 rgba(0,0,0,.08),0 1px 4px 0 rgba(0,0,0,.16)',
    sm: '0 0 2px 0 rgba(0,0,0,.08),0 2px 8px 0 rgba(0,0,0,.16)',
    md: '0 0 2px 0 rgba(0,0,0,.08),0 4px 16px 0 rgba(0,0,0,.16)',
    lg: '0 0 2px 0 rgba(0,0,0,.08),0 8px 32px 0 rgba(0,0,0,.16)'
  },

  easingFunctions: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },

  transitionDurations: {
    short: '150ms',
    standard: '250ms',
    long: '375ms'
  },

  zIndex: {
    backdrop: 800,
    sidebar: 1000
  }
};
