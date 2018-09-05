import { themed } from '../theme';

export const Sidebar = themed(
  {
    themeKey: 'sidebar',
    tag: 'div',
    visible: false,
    side: 'left' as 'left' | 'right'
  },
  {
    display: 'flex',
    bg: 'white',
    css: props => ({
      position: 'absolute',
      top: 0,
      bottom: 0,
      [props.side]: 0,
      height: '100%',
      zIndex: props.theme.zIndex.sidebar,
      transitionProperty: 'transform',
      transitionDuration: props.visible
        ? props.theme.transitionDurations.short
        : props.theme.transitionDurations.standard,
      transitionTimingFunction: props.visible
        ? props.theme.easingFunctions.easeIn
        : props.theme.easingFunctions.easeOut,
      // eslint-disable-next-line
      transform: props.visible ? 'translateX(0)' : props.side === 'left' ? 'translateX(-100%)' : 'translateX(100%)'
    })
  }
);
