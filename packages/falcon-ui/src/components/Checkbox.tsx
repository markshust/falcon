import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './';

const CheckboxInnerDOM = (props: any) => {
  const { className, ...remaining } = props;
  const { themableProps, rest } = extractThemableProps(remaining);

  return (
    <Box {...themableProps} className={className}>
      <input {...rest} type="checkbox" />
      <div aria-hidden>
        <svg viewBox="0 0 24 24">
          <path fill="none" d="M6,11.3 L10.3,16 L18,6.2" />
        </svg>
      </div>
    </Box>
  );
};

export const Checkbox = themed(
  {
    tag: CheckboxInnerDOM,
    themeKey: 'checkbox',
    size: 24
  },
  {
    css: props => ({
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
        ':checked + div': {
          background: props.theme.colors.secondary,
          borderColor: props.theme.colors.secondary,
          svg: {
            opacity: 1
          }
        },
        ':hover + div': {
          borderColor: props.theme.colors.secondaryLight
        },
        ':checked:hover + div': {
          background: props.theme.colors.secondaryLight
        }
      },

      svg: {
        height: '100%',
        width: '100%',
        stroke: props.theme.colors.white,
        strokeWidth: 3,
        opacity: 0,
        transitionProperty: 'opacity',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short,
        transform: 'scale(1.2)'
      },

      div: {
        height: props.size,
        width: props.size,
        position: 'relative',
        display: 'flex',
        cursor: 'pointer',
        borderRadius: props.theme.borderRadius.xs,
        border: props.theme.borders.bold,
        borderColor: props.theme.colors.primaryDark,
        transitionProperty: 'border, background',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short
      }
    })
  }
);
