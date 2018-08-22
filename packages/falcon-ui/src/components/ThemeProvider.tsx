import React from 'react';
import Provider from '@emotion/provider';
import { createTheme, PropsWithTheme } from '../theme';
import { Root } from './Root';

const defaultTheme = createTheme();

export const ThemeProvider = (props: Partial<PropsWithTheme>) => {
  // create default theme if nothing is provided
  const themeToUse = props.theme || defaultTheme;

  return (
    <Provider theme={themeToUse}>
      <Root {...props} />
    </Provider>
  );
};
