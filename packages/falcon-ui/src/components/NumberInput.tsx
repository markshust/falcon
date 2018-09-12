import React from 'react';
import { themed, extractThemableProps } from '../theme';
import { Box } from './';

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

type NumberInputInnerDOMProps = {
  min?: number | string;
  max?: number | string;
  step?: number | string;
  className?: string;
};

class NumberInputInnerDOM extends React.Component<NumberInputInnerDOMProps> {
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
        <button aria-hidden onClick={this.stepDown}>
          −
        </button>
        <input ref={this.inputRef} min={5} type="number" {...rest} />

        <button aria-hidden onClick={this.stepUp}>
          +
        </button>
      </Box>
    );
  }
}

export const NumberInput = themed(
  {
    tag: NumberInputInnerDOM,
    themeKey: 'numberInput',
    size: 30
  },
  {
    css: props => ({
      display: 'inline-flex',
      alignItems: 'center',
      input: {
        appearance: 'none',
        MozAppearance: 'textfield',
        pointerEvents: 'none',
        userSelect: 'none',
        height: props.size,
        width: props.size,
        fontStyle: 'inherit',
        border: props.theme.borders.light,
        borderColor: props.theme.colors.primaryDark,
        borderRadius: props.theme.borderRadius.xs,
        textAlign: 'center',
        boxShadow: 'none',
        fontSize: props.size * 0.45,
        '::-webkit-outer-spin-button,::-webkit-inner-spin-button ': {
          appearance: 'none'
        }
      },

      button: {
        height: props.size,
        width: props.size,
        transform: 'scale(0.8)',
        border: 'none',
        outline: 'none',
        appearance: 'none',
        transitionProperty: 'transform, background',
        transitionTimingFunction: props.theme.easingFunctions.easeIn,
        transitionDuration: props.theme.transitionDurations.short,
        background: props.theme.colors.primaryDark,
        color: props.theme.colors.primaryText,
        borderRadius: props.theme.borderRadius.xl,
        fontWeight: props.theme.fontWeights.bold,
        fontSize: props.size * 0.7,
        cursor: 'pointer',
        flex: 'none',
        paddingBottom: props.size * 0.125,
        ':hover': {
          background: props.theme.colors.primary
        },
        ':first-child': {
          marginRight: props.theme.spacing.sm,
          ':active': {
            transform: 'scale(0.6)'
          }
        },
        ':last-child': {
          marginLeft: props.theme.spacing.sm,

          ':active': {
            transform: 'scale(1)'
          }
        }
      }
    })
  }
);
