import React from 'react';
import { Query as ApolloQuery, OperationVariables, QueryProps } from 'react-apollo';
import { I18n, TranslationFunction } from 'react-i18next';
import { Loader } from './Loader';

export class Query<TData = any, TVariables = OperationVariables, TTranslations = {}> extends React.Component<
  QueryProps<TData, TVariables> & {
    children: (result: TData | TData & { translations: TTranslations } | undefined) => React.ReactNode;
  } & {
    getTranslations?: (t: TranslationFunction) => TTranslations;
    translationsNamespaces?: string[];
  }
> {
  render() {
    return (
      <ApolloQuery {...this.props}>
        {({ loading, error, data }) => {
          if (loading) return <Loader />;

          if (error) return `Error!: ${error}`;

          const { children, getTranslations } = this.props;
          if (getTranslations) {
            const { translationsNamespaces } = this.props;

            return (
              <I18n ns={translationsNamespaces}>
                {t => {
                  const translations = getTranslations(t);

                  return children({ ...(data as any), translations });
                }}
              </I18n>
            );
          }

          return children(data);
        }}
      </ApolloQuery>
    );
  }
}
