import React from 'react';
import merge from 'deepmerge';
import { ThemeProvider, createTheme, Theme } from '../src';

class Wrapper extends React.Component<{}, { currentTheme: Theme & { changeTheme: Function } }> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentTheme: {
        ...createTheme(),
        changeTheme: this.changeTheme
      }
    };
  }

  changeTheme = (themeKey, propName, propValue) => {
    const toMerge = {
      [themeKey]: {
        [propName]: propValue
      }
    };

    this.setState({
      currentTheme: merge(this.state.currentTheme, toMerge as any)
    });
  };

  render() {
    return <ThemeProvider theme={this.state.currentTheme} {...this.props} />;
  }
}

export default Wrapper;
