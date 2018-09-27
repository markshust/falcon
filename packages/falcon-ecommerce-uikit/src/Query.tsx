import React from 'react';
import { Query as ApolloQuery } from 'react-apollo';
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

export const Query: React.SFC<{
  children: (data: any) => any;
  query: any;
  variables?: {};
}> = ({ children, query, ...rest }) => (
  <ApolloQuery query={query} {...rest}>
    {({ loading, error, data }) => {
      if (loading) {
        return (
          <LoaderLayout>
            <Icon src="loader" />
          </LoaderLayout>
        );
      }

      if (error) return `Error!: ${error}`;

      return children(data);
    }}
  </ApolloQuery>
);
