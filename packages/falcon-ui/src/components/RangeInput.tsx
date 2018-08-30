import { themed, CSSObject } from '../theme';

const rangeInputTrack = (styles: CSSObject) => ({
  '::-webkit-slider-runnable-track': styles,
  '::-moz-range-track': styles,
  '::-ms-track': styles
});

const rangeInputThumb = (styles: CSSObject) => ({
  '::-webkit-slider-thumb ': styles,
  '::-moz-range-thumb': styles,
  '::-ms-thumb': styles
});

export const RangeInput = themed(
  {
    themeKey: 'rangeInput',
    tag: 'input',
    type: 'range'
  },
  {
    css: props => ({
      width: '100%',
      WebkitAppearance: 'none',
      height: props.theme.spacing.md,
      ':focus': {
        outline: 'none'
      },
      ...rangeInputTrack({
        width: '100%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        border: 'none',
        borderRadius: props.theme.borderRadius.xs,
        height: props.theme.spacing.xs,
        background: props.theme.colors.primary
      }),
      ...rangeInputThumb({
        WebkitAppearance: 'none',
        cursor: 'pointer',
        border: 'none',
        borderRadius: props.theme.borderRadius.xl,
        background: props.theme.colors.secondary,
        height: props.theme.spacing.md,
        width: props.theme.spacing.md,
        transition: 'transform',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short
      }),
      ':active': {
        ...rangeInputThumb({
          transform: 'scale(1.1)'
        })
      }
    })
  }
);
