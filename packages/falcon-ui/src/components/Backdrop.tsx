import { themed } from '../theme';

export const Backdrop = themed({
  tag: 'div',

  defaultProps: {
    visible: false
  },

  defaultTheme: {
    backdrop: {
      bg: 'black',

      css: ({ visible, theme }) => ({
        display: 'flex',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '100%',
        transitionProperty: 'opacity',
        transitionDuration: visible ? theme.transitionDurations.short : theme.transitionDurations.standard,
        transitionTimingFunction: visible ? theme.easingFunctions.easeIn : theme.easingFunctions.easeOut,
        opacity: visible ? 0.1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: theme.zIndex.backdrop
      })
    }
  }
});
