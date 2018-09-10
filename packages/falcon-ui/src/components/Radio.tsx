import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './';

const RadioInnerDOM = (props: any) => {
  const { className, ...remaining } = props;
  const { themableProps, rest } = extractThemableProps(remaining);

  return (
    <Box {...themableProps} className={className}>
      <input {...rest} type="radio" />
      <div aria-hidden>
        <i />
      </div>
    </Box>
  );
};

export const Radio = themed(
  {
    tag: RadioInnerDOM,
    themeKey: 'radio',
    size: 24
  },
  {
    css: props => ({
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
        ':checked + div': {
          borderColor: props.theme.colors.secondary,
          i: {
            opacity: 1,
            background: props.theme.colors.secondary
          }
        },
        ':hover + div': {
          borderColor: props.theme.colors.secondaryLight,
          i: {
            background: props.theme.colors.secondaryLight
          }
        }
      },

      i: {
        height: props.size - 10,
        width: props.size - 10,
        display: 'block',
        opacity: 0,
        backround: props.theme.colors.white,
        borderRadius: props.theme.borderRadius.xl,
        transitionProperty: 'opacity, background',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short
      },

      div: {
        height: props.size,
        width: props.size,
        position: 'relative',
        display: 'flex',
        cursor: 'pointer',
        borderRadius: props.theme.borderRadius.xl,
        border: props.theme.borders.bold,
        borderColor: props.theme.colors.primaryDark,
        transitionProperty: 'border, background',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short,
        justifyContent: 'center',
        alignItems: 'center'
      }
    })
  }
);
