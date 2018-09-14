import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './Box';

// based on https://github.com/facebook/react/issues/10135#issuecomment-314441175
function triggerChange(element: any, value: any) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')!.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')!.set;

  if (valueSetter && prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  }

  element.dispatchEvent(new Event('change', { bubbles: true }));
}

class NumberInputInnerDOM extends React.Component<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> {
  getStep() {
    if (this.props.step === undefined) {
      return 1;
    }
    return +this.props.step;
  }

  getMax() {
    if (this.props.max === undefined) {
      return Number.POSITIVE_INFINITY;
    }
    return +this.props.max;
  }

  getMin() {
    if (this.props.min === undefined) {
      return Number.NEGATIVE_INFINITY;
    }
    return +this.props.min;
  }

  inputRef = React.createRef<HTMLInputElement>();

  stepUp = () => {
    if (!this.inputRef.current) {
      return;
    }

    const currentValue = +this.inputRef.current.value;
    const max = this.getMax();

    let nextValue = currentValue + this.getStep();
    if (nextValue > max) {
      nextValue = max;
    }

    triggerChange(this.inputRef.current, nextValue);
  };

  stepDown = () => {
    if (!this.inputRef.current) {
      return;
    }

    const currentValue = +this.inputRef.current.value;
    const min = this.getMin();

    let nextValue = currentValue - this.getStep();
    if (nextValue < min) {
      nextValue = min;
    }

    triggerChange(this.inputRef.current, nextValue);
  };

  render() {
    const { className, ...remaining } = this.props;
    const { themableProps, rest } = extractThemableProps(remaining);

    return (
      <Box {...themableProps} className={className}>
        <button aria-hidden onClick={this.stepDown} className="-inner-input-step-down-element">
          −
        </button>

        <input ref={this.inputRef} min={5} type="number" {...rest} />

        <button aria-hidden onClick={this.stepUp} className="-inner-input-step-up-element">
          +
        </button>
      </Box>
    );
  }
}

export const NumberInput = themed({
  tag: NumberInputInnerDOM,
  defaultProps: {
    size: 30
  },

  defaultTheme: {
    numberInput: {
      css: ({ size, theme }) => ({
        display: 'inline-flex',
        alignItems: 'center',

        input: {
          appearance: 'none',
          MozAppearance: 'textfield',
          pointerEvents: 'none',
          userSelect: 'none',
          height: size,
          width: size,
          fontStyle: 'inherit',
          border: theme.borders.light,
          borderColor: theme.colors.primaryDark,
          borderRadius: theme.borderRadius.xs,
          textAlign: 'center',
          boxShadow: 'none',
          fontSize: size * 0.45,
          '::-webkit-outer-spin-button,::-webkit-inner-spin-button': {
            appearance: 'none'
          }
        },

        '.-inner-input-step-down-element, .-inner-input-step-up-element': {
          height: size,
          width: size,
          transform: 'scale(0.8)',
          border: 'none',
          outline: 'none',
          appearance: 'none',
          transitionProperty: 'transform, background',
          transitionTimingFunction: theme.easingFunctions.easeIn,
          transitionDuration: theme.transitionDurations.short,
          background: theme.colors.primaryDark,
          color: theme.colors.primaryText,
          borderRadius: theme.borderRadius.xl,
          fontWeight: theme.fontWeights.bold,
          fontSize: size * 0.7,
          cursor: 'pointer',
          flex: 'none',
          paddingBottom: size * 0.125,

          ':hover': {
            background: theme.colors.primary
          }
        },
        '.-inner-input-step-down-element': {
          marginRight: theme.spacing.sm,
          ':active': {
            transform: 'scale(0.6)'
          }
        },
        '.-inner-input-step-up-element': {
          marginLeft: theme.spacing.sm,
          ':active': {
            transform: 'scale(1)'
          }
        }
      })
    }
  }
});
