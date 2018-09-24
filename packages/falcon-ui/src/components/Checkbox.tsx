import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './Box';
import { Icon } from './Icon';

const CheckboxInnerDOM = (
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
) => {
  const { className, ...remaining } = props;
  const { themableProps, rest } = extractThemableProps(remaining);

  return (
    <Box {...themableProps} className={className}>
      <input {...rest} type="checkbox" />
      <div aria-hidden className="-inner-checkbox-frame">
        <Icon
          src="checkboxCheckedIcon"
          className="-inner-checkbox-icon"
          fallback={
            <svg className="-inner-checkbox-icon" viewBox="0 0 24 24">
              <path fill="none" d="M6,11.3 L10.3,16 L18,6.2" />
            </svg>
          }
        />
      </div>
    </Box>
  );
};
export const Checkbox = themed({
  tag: CheckboxInnerDOM,

  defaultTheme: {
    checkbox: {
      size: 24,
      css: ({ theme }) => ({
        display: 'inline-flex',
        position: 'relative',
        // checkbox input is not visible but interactive
        input: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          zIndex: 1,
          ':checked + .-inner-checkbox-frame': {
            background: theme.colors.secondary,
            borderColor: theme.colors.secondary,
            '.-inner-checkbox-icon': {
              opacity: 1
            }
          },
          ':hover + .-inner-checkbox-frame': {
            borderColor: theme.colors.secondaryLight
          },
          ':checked:hover + .-inner-checkbox-frame': {
            background: theme.colors.secondaryLight
          }
        },

        '.-inner-checkbox-icon': {
          height: '100%',
          width: '100%',
          stroke: theme.colors.white,
          strokeWidth: 3,
          opacity: 0,
          transitionProperty: 'opacity',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short,
          transform: 'scale(1.2)'
        },

        '.-inner-checkbox-frame': {
          height: '100%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          cursor: 'pointer',
          borderRadius: theme.borderRadius.xs,
          border: theme.borders.bold,
          borderColor: theme.colors.primaryDark,
          transitionProperty: 'border, background',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short
        }
      })
    }
  }
});
