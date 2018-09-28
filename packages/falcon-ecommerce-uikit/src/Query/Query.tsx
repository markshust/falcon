import React from 'react';
import { Query as ApolloQuery, OperationVariables, QueryProps } from 'react-apollo';
import { Loader } from './Loader';

export class Query<TData = any, TVariables = OperationVariables> extends React.Component<
  QueryProps<TData, TVariables> & { children: (result: TData | undefined) => React.ReactNode }
> {
  render() {
    return (
      <ApolloQuery {...this.props}>
        {({ loading, error, data }) => {
          if (loading) return <Loader />;

          if (error) return `Error!: ${error}`;

          return this.props.children(data);
        }}
      </ApolloQuery>
    );
  }
}
