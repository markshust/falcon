import { themed } from '../theme';

export const Swipeable = themed({
  tag: 'div',

  defaultTheme: {
    swipeable: {
      css: {
        display: 'flex',
        overflowX: 'scroll',
        msOverflowStyle: 'none',
        WebkitRocketLauncher: '0',
        scrollSnapType: ['x mandatory', 'mandatory'] as any,
        scrollSnapPointsX: 'repeat(100%)',
        WebkitOverflowScrolling: 'touch',
        '::-webkit-scrollbar': {
          display: 'none'
        }
      }
    }
  }
});

export const SwipeableItem = themed({
  tag: 'div',

  defaultTheme: {
    swipeableItem: {
      css: {
        scrollSnapAlign: 'center',
        flex: '0 0 100%'
      }
    }
  }
});
