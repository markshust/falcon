import { themed } from '../theme';

export const Sidebar = themed({
  tag: 'div',

  defaultProps: {
    visible: false,
    side: 'left' as 'left' | 'right'
  },

  defaultTheme: {
    sidebar: {
      display: 'flex',
      bg: 'white',
      css: ({ visible, theme, side }) => ({
        position: 'fixed',
        top: 0,
        bottom: 0,
        [side]: 0,
        height: '100%',
        zIndex: theme.zIndex.sidebar,
        transitionProperty: 'transform',
        transitionDuration: visible ? theme.transitionDurations.short : theme.transitionDurations.standard,
        transitionTimingFunction: visible ? theme.easingFunctions.easeIn : theme.easingFunctions.easeOut,
        // eslint-disable-next-line
        transform: visible ? 'translateX(0)' : side === 'left' ? 'translateX(-100%)' : 'translateX(100%)'
      })
    }
  }
});
