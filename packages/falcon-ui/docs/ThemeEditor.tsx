import React from 'react';
import { withCSSContext } from '@emotion/core';
import { GridLayout, Card, H1, H4, RangeInput, FlexLayout, Input, Divider } from '../src';

const themeMeta = {
  colors: {
    input: 'color'
  },
  breakpoints: {
    input: 'number',
    step: 1,
    min: 0,
    max: 2048
  },
  spacing: {
    input: 'number',
    min: 0,
    step: 1,
    max: 100
  },
  fonts: {
    input: 'text'
  },
  fontSizes: {
    input: 'number',
    min: 0,
    step: 1,
    max: 80
  },
  fontWeights: {
    input: 'text'
  },
  lineHeights: {
    input: 'number',
    min: 0,
    step: 0.1,
    max: 3
  },
  letterSpacings: {
    input: 'text'
  },
  borders: {
    input: 'text'
  },
  borderRadius: {
    input: 'number',
    min: 0,
    step: 1,
    max: 100
  },
  boxShadows: {
    input: 'text'
  },
  easingFunctions: {
    input: 'text'
  },
  transitionDurations: {
    input: 'text'
  },
  zIndex: {
    input: 'number',
    min: 0,
    step: 1,
    max: 1000
  }
};

class ThemeEditor extends React.Component<any> {
  onChange = (themeKey, propName) => {
    return e => {
      this.props.theme.changeTheme(themeKey, propName, e.target.value);
    };
  };
  render() {
    const { theme } = this.props;
    const blacklist = ['components', 'changeTheme'];
    const themeKeys = Object.keys(theme).filter(key => blacklist.indexOf(key) === -1);

    return (
      <GridLayout gridTemplateColumns="1fr" gridGap="md">
        {themeKeys.map(key => (
          <Card key={key} boxShadow="none">
            <H1 css={{ textTransform: 'capitalize' }}>{key}</H1>
            <Divider />
            {Object.keys(theme[key]).map(themeProp => (
              <GridLayout
                alignItems="center"
                gridGap="md"
                mt="md"
                gridTemplateColumns="1fr auto 1.8fr"
                key={key + themeProp}
              >
                <H4>{themeProp}</H4>
                <FlexLayout gridColumn={!themeMeta[key].step ? 'span 2' : ''}>
                  <Input
                    onChange={this.onChange(key, themeProp)}
                    type={themeMeta[key].input}
                    value={theme[key][themeProp]}
                  />
                </FlexLayout>
                {themeMeta[key].step && (
                  <RangeInput
                    value={theme[key][themeProp]}
                    min={themeMeta[key].min}
                    max={themeMeta[key].max}
                    step={themeMeta[key].step}
                    onChange={this.onChange(key, themeProp)}
                  />
                )}
              </GridLayout>
            ))}
          </Card>
        ))}
      </GridLayout>
    );
  }
}

export default withCSSContext((props: any, context: any) => <ThemeEditor {...props} theme={context.theme} />);
