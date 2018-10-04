import React from 'react';
import { asyncComponent } from 'react-async-component';
import { Loader } from '@deity/falcon-ecommerce-uikit';

export default component =>
  asyncComponent({
    resolve: component,
    LoadingComponent: Loader,
    ErrorComponent: ({ message }) => (
      <div>
        <p>Error!</p>
        <p>{message}</p>
      </div>
    )
  });
