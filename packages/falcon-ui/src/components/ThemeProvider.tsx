import React from 'react';
import Provider from '@emotion/provider';
import { Global, css } from '@emotion/core';
import { createTheme, PropsWithTheme } from '../theme';
import { Root } from './Root';

const defaultTheme = createTheme();

// IMPORTANT: those styles get injected as global styles
const normalizeCssStyles = {
  body: {
    margin: 0
  }
};

export const ThemeProvider = (props: Partial<PropsWithTheme>) => {
  // create default theme if nothing is provided
  const themeToUse = props.theme || defaultTheme;

  return (
    <Provider theme={themeToUse}>
      <Global styles={normalizeCssStyles} />
      {<Root {...props} />}
    </Provider>
  );
};
