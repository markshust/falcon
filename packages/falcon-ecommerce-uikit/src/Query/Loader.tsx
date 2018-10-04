import React from 'react';
import { Icon, themed } from '@deity/falcon-ui';

export const LoaderLayout = themed({
  tag: 'div',
  defaultTheme: {
    loaderLayout: {
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
});

export const Loader = () => (
  <LoaderLayout>
    <Icon src="loader" />
  </LoaderLayout>
);
