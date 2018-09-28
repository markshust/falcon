export const defaultBaseTheme = {
  colors: {
    primary: '#eef0f2',
    primaryLight: '#f8f8f8',
    primaryDark: '#e8e8e8',
    primaryText: '#5f6367',

    secondary: '#A9CF38',
    secondaryLight: '#CBDE6E',
    secondaryDark: '#A9CF38',
    secondaryText: '#fff',
    error: '#E74C3C',
    errorText: '#000000',
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent'
  },

  breakpoints: {
    xs: 0,
    sm: 640,
    md: 860,
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
    xs: '0 5px 5px rgba(0,0,0,.1)',
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
    dropDownMenu: 600,
    backdrop: 800,
    sidebar: 1000
  },

  components: {},

  icons: {}
};
