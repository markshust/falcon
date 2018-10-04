import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './Box';
import { Icon } from './Icon';

const RadioInnerDOM = (
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { icon: JSX.Element }
) => {
  const { className, ...remaining } = props;
  const { themableProps, rest } = extractThemableProps(remaining);

  return (
    <Box {...themableProps} className={className}>
      <input {...rest} type="radio" />
      <div aria-hidden className="-inner-radio-frame">
        {props.icon}
      </div>
    </Box>
  );
};

export const Radio = themed({
  tag: RadioInnerDOM,

  defaultProps: {
    icon: <Icon className="-inner-radio-icon" src="radioCheckedIcon" fallback={<i className="-inner-radio-icon" />} />
  },

  defaultTheme: {
    radio: {
      size: 24,
      css: ({ theme }) => ({
        display: 'inline-flex',
        position: 'relative',
        // radio input is not visible but interactive
        input: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          margin: 0,
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
          height: 'calc(100% - 4px)',
          width: 'calc(100% - 4px)',
          display: 'block',
          opacity: 0,
          background: theme.colors.white,
          borderRadius: theme.borderRadius.xl,
          transitionProperty: 'opacity, background',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short
        },

        '.-inner-radio-frame': {
          height: '100%',
          width: '100%',
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
