import React, { ReactNode } from 'react';

import {
  H4,
  RangeInput,
  Input,
  Text,
  Details,
  Summary,
  DetailsContent,
  ThemeProvider,
  Sidebar,
  Box,
  Portal,
  NumberInput,
  GridLayout,
  themed,
  Theme,
  createTheme,
  mergeThemes
} from '@deity/falcon-ui';

const categories = {
  colors: {
    name: 'Colors',
    themeMappings: [
      {
        themeProps: 'colors',
        input: 'color'
      }
    ]
  },
  spacing: {
    name: 'Spacing',
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

type ThemeSidebarProps = {
  open: boolean;
  toggle: any;
  children?: ReactNode;
};

const SVGIcon = themed({
  tag: 'svg'
});

const ThemeSidebar = (props: ThemeSidebarProps) => (
  <Sidebar as={Portal} visible={props.open} side="right" css={{ position: 'fixed' }} boxShadow="xs" bg="primaryLight">
    {props.children}
    <Box
      position="absolute"
      right="100%"
      top="calc(50% - 40px)"
      height={90}
      width={40}
      display="flex"
      bg={props.open ? 'primaryLight' : 'primaryDark'}
      p="sm"
      alignItems="center"
      css={{
        cursor: 'pointer',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '-2px 5px 5px rgba(0,0,0,.1)'
      }}
      onClick={props.toggle}
    >
      <SVGIcon
        viewBox="0 0 8 8"
        height={20}
        width={20}
        css={({ theme }) => ({
          fill: theme.colors.secondary
        })}
      >
        <path d="M6 0l-1 1 2 2 1-1-2-2zm-2 2l-4 4v2h2l4-4-2-2z" id="pencil" />
      </SVGIcon>
    </Box>
  </Sidebar>
);

export class ThemeEditor extends React.Component<any, any> {
  state = {
    openPanels: {},
    sidebarVisible: false
  };

  onChange = (themeKey: string, propName: string, isNumber?: boolean) => (e: any) => {
    this.props.updateTheme({
      [themeKey]: {
        [propName]: isNumber ? +e.target.value : e.target.value
      }
    });
  };

  toggleSidebar = () => {
    this.setState((state: any) => ({ sidebarVisible: !state.sidebarVisible }));
  };

  toggleCollapsible = (key: string) => (e: any) => {
    e.preventDefault();

    this.setState((state: any) => {
      const openPanels = { ...state.openPanels };

      openPanels[key] = !openPanels[key];
      return {
        openPanels
      };
    });
  };

  renderEditor(themeMapping: any) {
    const { theme } = this.props;
    return (
      <React.Fragment>
        {Object.keys(theme[themeMapping.themeProps]).map(themeProp => (
          <GridLayout
            alignItems="center"
            gridGap="xs"
            mb="sm"
            gridTemplateColumns="1fr auto 1.8fr 20px"
            key={themeMapping.themeProps + themeProp}
          >
            <H4 p="xs">{themeProp}</H4>
            {!themeMapping.step && (
              <Box gridColumn={!themeMapping.step ? 'span 3' : ''}>
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

                    return {};
                  }}
                />
              </Box>
            )}
            {themeMapping.step && (
              <React.Fragment>
                <NumberInput
                  gridColumn={!themeMapping.step ? 'span 3' : ''}
                  value={theme[themeMapping.themeProps][themeProp]}
                  min={themeMapping.min}
                  max={themeMapping.max}
                  step={themeMapping.step}
                  onChange={this.onChange(themeMapping.themeProps, themeProp, true)}
                />

                <RangeInput
                  value={theme[themeMapping.themeProps][themeProp]}
                  min={themeMapping.min}
                  max={themeMapping.max}
                  step={themeMapping.step}
                  onChange={this.onChange(themeMapping.themeProps, themeProp, true)}
                />
                <Text p="none" ml="xs" fontSize="sm">
                  px
                </Text>
              </React.Fragment>
            )}
          </GridLayout>
        ))}
      </React.Fragment>
    );
  }

  render() {
    return (
      <ThemeProvider withoutRoot>
        <ThemeSidebar open={this.state.sidebarVisible} toggle={this.toggleSidebar}>
          <GridLayout
            p="sm"
            gridTemplateColumns="minmax(280px, 380px)"
            gridAutoRows="min-content"
            css={{ overflow: 'auto' }}
          >
            {Object.keys(categories).map(categoryKey => {
              const category = (categories as any)[categoryKey];
              return (
                <Details key={category.name} open={(this.state.openPanels as any)[categoryKey]}>
                  <Summary onClick={this.toggleCollapsible(categoryKey)}>{category.name}</Summary>

                  <DetailsContent>
                    {category.themeMappings.length === 1
                      ? this.renderEditor(category.themeMappings[0])
                      : category.themeMappings.map((themeMapping: any) => {
                          const key = category.name + themeMapping.themeProps;

                          return (
                            <Details mb="sm" key={key} open={(this.state.openPanels as any)[key]}>
                              <Summary onClick={this.toggleCollapsible(key)}>{themeMapping.themeProps}</Summary>
                              <DetailsContent>{this.renderEditor(themeMapping)}</DetailsContent>
                            </Details>
                          );
                        })}
                  </DetailsContent>
                </Details>
              );
            })}
          </GridLayout>
        </ThemeSidebar>
      </ThemeProvider>
    );
  }
}

type ThemeStateState = {
  activeTheme: Theme;
};

type ChildrenRenderProp = { theme: Theme; updateTheme: (themeDiff: Partial<Theme>) => void };

type ThemeStateProps = {
  initial?: Theme;
  children: (renderProp: ChildrenRenderProp) => React.ReactNode;
};

export class ThemeState extends React.Component<ThemeStateProps, ThemeStateState> {
  constructor(props: ThemeStateProps) {
    super(props);

    this.state = {
      activeTheme: props.initial || createTheme()
    };
  }

  updateTheme = (themeDiff: Partial<Theme>) => {
    this.setState(state => ({
      activeTheme: mergeThemes(state.activeTheme, themeDiff)
    }));
  };

  render() {
    return this.props.children({
      theme: this.state.activeTheme,
      updateTheme: this.updateTheme
    });
  }
}
