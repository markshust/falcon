import { themed } from '../theme';

export const Backdrop = themed(
  {
    themeKey: 'backdrop',
    tag: 'div',
    visible: false
  },
  {
    display: 'flex',
    bg: 'black',
    css: props => ({
      transition: 'opacity',
      transitionDuration: props.visible
        ? props.theme.transitionDurations.short
        : props.theme.transitionDurations.standard,
      transitionTimingFunction: props.visible
        ? props.theme.easingFunctions.easeIn
        : props.theme.easingFunctions.easeOut,
      opacity: props.visible ? 0.1 : 0,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      width: '100%',
      pointerEvents: props.visible ? 'auto' : 'none',
      zIndex: props.theme.zIndex.backdrop
    })
  }
);
