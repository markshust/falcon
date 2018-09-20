import React from 'react';
import Provider from '@emotion/provider';
import { Global } from '@emotion/core';
import merge from 'deepmerge';

import { createTheme, PropsWithTheme, Theme } from '../theme';
import { Root } from './Root';

// IMPORTANT: those styles get injected as global styles
// every other reset style can be applied on Root component
// but not body margin
const tinyNormalizeStyles = {
  body: {
    margin: 0,
    overflowX: 'hidden'
  }
};

type ThemeProviderState = {
  activeTheme: Theme;
};
type ThemeProviderProps = Partial<PropsWithTheme> & {
  editor?: React.ReactType;
  withoutRoot?: boolean;
};

export class ThemeProvider extends React.Component<ThemeProviderProps, ThemeProviderState> {
  constructor(props: ThemeProviderProps) {
    super(props);

    this.state = {
      activeTheme: props.theme || createTheme()
    };
  }

  static getDerivedStateFromProps(props: ThemeProviderProps, state: ThemeProviderState) {
    if (props.theme && props.theme !== state.activeTheme) {
      return {
        activeTheme: props.theme
      };
    }

    return null;
  }

  updateTheme = (themeDiff: Partial<Theme>) => {
    this.setState({
      activeTheme: merge(this.state.activeTheme, themeDiff)
    });
  };

  render() {
    const { theme, editor: Editor, ...rest } = this.props;

    return (
      <Provider theme={this.state.activeTheme}>
        {!this.props.withoutRoot && <Global styles={tinyNormalizeStyles} />}

        {this.props.withoutRoot ? this.props.children : <Root {...rest} />}

        {Editor && <Editor theme={this.state.activeTheme} updateTheme={this.updateTheme} />}
      </Provider>
    );
  }
}
