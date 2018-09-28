import gql from 'graphql-tag';
import { Query } from '../Query/Query';

const GET_FOOTER_DATA = gql`
  query {
    footerSections @client
    languages @client
  }
`;
export type FooterData = {
  footerSections: any[];
  languages: any[];
};

export class FooterQuery extends Query<FooterData> {
  static defaultProps = {
    query: GET_FOOTER_DATA
  };
}
