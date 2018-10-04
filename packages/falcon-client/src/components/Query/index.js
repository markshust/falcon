import React from 'react';
import { Query } from 'react-apollo';

export default ({ query, variables, children, loaderComponent, errorComponent, ...rest }) => (
  <Query query={query} variables={variables} {...rest}>
    {({ loading, error, data }) => {
      if (loading) {
        return loaderComponent ? React.createElement(loaderComponent) : null;
      }
      if (error) {
        return errorComponent ? React.createElement(errorComponent, { error }) : null;
      }

      return children({ data });
    }}
  </Query>
);
