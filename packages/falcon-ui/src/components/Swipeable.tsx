import { themed } from '../theme';

export const Swipeable = themed(
  {
    themeKey: 'swipeable',
    tag: 'div'
  },
  {
    css: {
      height: '300px',
      display: 'flex',
      overflowX: 'scroll',
      msOverflowStyle: 'none',
      // scrollSnapType: ['x mandatory', 'mandatory'],
      scrollSnapPointsX: 'repeat(100%)',
      WebkitOverflowScrolling: 'touch',
      '::-webkit-scrollbar': {
        display: 'none'
      }
    }
  }
);

export const SwipeableItem = themed(
  {
    themeKey: 'swipeableItem',
    tag: 'div'
  },
  {
    css: {
      scrollSnapAlign: 'center',
      flex: '0 0 100%'
    }
  }
);
