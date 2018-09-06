import React from 'react';
import { withCSSContext } from '@emotion/core';
import { GridLayout, Card, H4, RangeInput, FlexLayout, Input, Tabs, Tab, Swipeable, Text, SwipeableItem } from '../src';

const categories = {
  colors: {
    name: 'Colors',
    description: 'Theme colors',
    themeMappings: [
      {
        themeProps: 'colors',
        input: 'color'
      }
    ]
  },
  spacing: {
    name: 'Spacing',
    description: 'Theme spacing',
    themeMappings: [
      {
        themeProps: 'spacing',
        input: 'number',
        min: 0,
        step: 1,
        max: 100
      }
    ]
  },
  fonts: {
    name: 'Typography',
    description: 'Theme fonts',
    themeMappings: [
      {
        themeProps: 'fonts',
        input: 'text'
      },
      {
        themeProps: 'fontSizes',
        input: 'number',
        min: 0,
        step: 1,
        max: 80
      },
      {
        themeProps: 'fontWeights',
        input: 'text'
      },
      {
        themeProps: 'lineHeights',
        input: 'number',
        min: 0,
        step: 0.1,
        max: 3
      },
      {
        themeProps: 'letterSpacings',
        input: 'text'
      }
    ]
  },
  breakpoints: {
    name: 'Breakpoints',
    description: 'Theme responsive breakpoints',
    themeMappings: [
      {
        themeProps: 'breakpoints',
        input: 'number',
        step: 1,
        min: 0,
        max: 2048
      }
    ]
  },
  borders: {
    name: 'Borders',
    description: 'Theme borders',
    themeMappings: [
      {
        themeProps: 'borders',
        input: 'text'
      },
      {
        themeProps: 'borderRadius',
        input: 'number',
        min: 0,
        step: 1,
        max: 100
      }
    ]
  },
  misc: {
    name: 'Miscellaneous',
    description: 'Theme Miscellaneous props',
    themeMappings: [
      {
        themeProps: 'boxShadows',
        input: 'text'
      },
      {
        themeProps: 'easingFunctions',
        input: 'text'
      },
      {
        themeProps: 'transitionDurations',
        input: 'text'
      }
    ]
  }
};

class ThemeEditor extends React.Component<any, any> {
  state = {
    activeCategory: 'colors',
    activeSubCategory: categories.colors.themeMappings[0].themeProps
  };

  onChange = (themeKey, propName) => e => {
    this.props.theme.changeTheme(themeKey, propName, e.target.value);
  };

  changeCategory = categoryKey => () => {
    this.setState({
      activeCategory: categoryKey,
      activeSubCategory: categories[categoryKey].themeMappings[0].themeProps
    });
  };
  changeSubCategory = subCategoryKey => () => {
    this.setState({
      activeSubCategory: subCategoryKey
    });
  };

  renderEditor(themeMapping: any) {
    const { theme } = this.props;
    return (
      <Card boxShadow="none">
        {Object.keys(theme[themeMapping.themeProps]).map(themeProp => (
          <GridLayout
            alignItems="center"
            gridGap="xs"
            mt="md"
            gridTemplateColumns="1fr auto 20px 1.8fr"
            key={themeMapping.themeProps + themeProp}
          >
            <H4>{themeProp}</H4>
            <FlexLayout gridColumn={!themeMapping.step ? 'span 3' : ''}>
              <Input
                onChange={this.onChange(themeMapping.themeProps, themeProp)}
                type={themeMapping.input}
                value={theme[themeMapping.themeProps][themeProp]}
                css={() => {
                  if (themeMapping.input === 'color') {
                    return {
                      padding: 0,
                      width: 60,
                      borderRadius: 0,
                      border: 'none'
                    };
                  }
                  if (themeMapping.input === 'number') {
                    return {
                      width: 70
                    };
                  }
                }}
              />
            </FlexLayout>
            {themeMapping.step && (
              <React.Fragment>
                <Text p="none">px</Text>
                <RangeInput
                  value={theme[themeMapping.themeProps][themeProp]}
                  min={themeMapping.min}
                  max={themeMapping.max}
                  step={themeMapping.step}
                  onChange={this.onChange(themeMapping.themeProps, themeProp)}
                />
              </React.Fragment>
            )}
          </GridLayout>
        ))}
      </Card>
    );
  }

  render() {
    const activeCategory = categories[this.state.activeCategory];

    return (
      <GridLayout gridTemplateColumns="1fr" gridGap="sm" bg="white">
        <Tabs extend={Swipeable}>
          {Object.keys(categories).map(categoryKey => {
            const category = categories[categoryKey];
            return (
              <Tab
                extend={SwipeableItem}
                key={category.name}
                active={categoryKey === this.state.activeCategory}
                onClick={this.changeCategory(categoryKey)}
              >
                {category.name}
              </Tab>
            );
          })}
        </Tabs>
        <Text p="md">{activeCategory.description}</Text>

        {activeCategory.themeMappings.length === 1 ? (
          this.renderEditor(activeCategory.themeMappings[0])
        ) : (
          <React.Fragment>
            <Tabs extend={Swipeable} variant="secondary">
              {activeCategory.themeMappings.map(themeMapping => (
                <Tab
                  extend={SwipeableItem}
                  key={this.state.activeCategory + themeMapping.themeProps}
                  active={themeMapping.themeProps === this.state.activeSubCategory}
                  onClick={this.changeSubCategory(themeMapping.themeProps)}
                  variant="secondary"
                  css={{
                    textTransform: 'capitalize'
                  }}
                >
                  {themeMapping.themeProps}
                </Tab>
              ))}
            </Tabs>
            {this.renderEditor(
              activeCategory.themeMappings.filter(mapping => mapping.themeProps === this.state.activeSubCategory)[0]
            )}
          </React.Fragment>
        )}
      </GridLayout>
    );
  }
}

export default withCSSContext((props: any, context: any) => <ThemeEditor {...props} theme={context.theme} />);
