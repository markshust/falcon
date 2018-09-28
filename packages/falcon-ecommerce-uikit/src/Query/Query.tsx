import React from 'react';
import { Query as ApolloQuery, OperationVariables, QueryProps } from 'react-apollo';
import { I18n, TranslationFunction } from 'react-i18next';
import { Loader } from './Loader';

export class Query<TData = any, TVariables = OperationVariables, TTranslations = {}> extends React.Component<
  QueryProps<TData, TVariables> & {
    children: (result: TData | TData & { translations: TTranslations } | undefined) => React.ReactNode;
  } & {
    getTranslations?: (t: TranslationFunction, data: TData) => TTranslations;
  }
> {
  render() {
    return (
      <ApolloQuery {...this.props}>
        {({ loading, error, data }) => {
          if (loading) return <Loader />;

          if (error) return `Error!: ${error}`;

          if (!this.props.getTranslations) {
            return this.props.children(data);
          }

          return (
            <I18n>
              {t => {
                const translations = this.props.getTranslations!(t, data!);

                return this.props.children({ ...(data as any), translations });
              }}
            </I18n>
          );
        }}
      </ApolloQuery>
    );
  }
}
