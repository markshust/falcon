import React from 'react';
import { ThemeProvider, ThemeEditor } from '../src';

export default (props: any) => <ThemeProvider editor={ThemeEditor} {...props} />;
