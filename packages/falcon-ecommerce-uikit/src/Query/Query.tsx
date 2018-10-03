import React from 'react';
import { Query as ApolloQuery, OperationVariables, QueryProps, QueryResult, ObservableQueryFields } from 'react-apollo';
import { I18n, TranslationFunction } from 'react-i18next';
import { Loader } from './Loader';
import { NetworkStatus } from 'apollo-client';

export class Query<TData = any, TVariables = OperationVariables, TTranslations = {}> extends React.Component<
  QueryProps<TData, TVariables> & {
    children: (result: TData | TData & { translations: TTranslations } | undefined) => React.ReactNode;
  } & {
    fetchMore?: (data: TData, fetchMore: QueryResult<TData, TVariables>['fetchMore']) => any;
    getTranslations?: (t: TranslationFunction, data: TData) => TTranslations;
    translationsNamespaces?: string[];
  }
> {
  render() {
    const { children, getTranslations, fetchMore, ...restProps } = this.props;

    return (
      <ApolloQuery {...restProps}>
        {({ networkStatus, error, data, fetchMore: apolloFetchMore }) => {
          if (error) return `Error!: ${error}`;

          if (networkStatus === NetworkStatus.loading) {
            return <Loader />;
          }

          const props = {
            ...(data as any),
            networkStatus,
            fetchMore: fetchMore ? () => fetchMore(data!, apolloFetchMore) : undefined
          };

          if (getTranslations) {
            return (
              <I18n ns={this.props.translationsNamespaces}>
                {t => children({ ...props, translations: getTranslations(t, data!) })}
              </I18n>
            );
          }

          return children(props);
        }}
      </ApolloQuery>
    );
  }
}
