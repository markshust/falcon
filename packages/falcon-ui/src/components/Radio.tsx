import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './Box';

const RadioInnerDOM = (
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) => {
  const { className, ...remaining } = props;
  const { themableProps, rest } = extractThemableProps(remaining);

  return (
    <Box {...themableProps} className={className}>
      <input {...rest} type="radio" />
      <div aria-hidden className="-inner-radio-frame">
        <i className="-inner-radio-icon" />
      </div>
    </Box>
  );
};

export const Radio = themed({
  tag: RadioInnerDOM,

  defaultProps: {
    size: 24
  },

  defaultTheme: {
    radio: {
      css: ({ size, theme }) => ({
        display: 'inline-flex',
        position: 'relative',
        // radio input is not visible but interactive
        input: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          zIndex: 1,
          ':checked + .-inner-radio-frame': {
            borderColor: theme.colors.secondary,
            '.-inner-radio-icon': {
              opacity: 1,
              background: theme.colors.secondary
            }
          },
          ':hover + .-inner-radio-frame': {
            borderColor: theme.colors.secondaryLight,
            '.-inner-radio-icon': {
              background: theme.colors.secondaryLight
            }
          }
        },

        '.-inner-radio-icon': {
          height: size - 10,
          width: size - 10,
          display: 'block',
          opacity: 0,
          backround: theme.colors.white,
          borderRadius: theme.borderRadius.xl,
          transitionProperty: 'opacity, background',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short
        },

        '.-inner-radio-frame': {
          height: size,
          width: size,
          position: 'relative',
          display: 'flex',
          cursor: 'pointer',
          borderRadius: theme.borderRadius.xl,
          border: theme.borders.bold,
          borderColor: theme.colors.primaryDark,
          transitionProperty: 'border, background',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short,
          justifyContent: 'center',
          alignItems: 'center'
        }
      })
    }
  }
});
