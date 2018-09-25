import React from 'react';
import { Query as ApolloQuery } from 'react-apollo';

export const Query: React.SFC<{
  children: (data: any) => any;
  query: any;
}> = ({ children, query, ...rest }) => (
  <ApolloQuery query={query} {...rest}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return children(data);
    }}
  </ApolloQuery>
);
