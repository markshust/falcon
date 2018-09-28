import gql from 'graphql-tag';
import { Query } from '../Query/Query';

const GET_HEADER_DATA = gql`
  query {
    menuItems @client
    bannerLinks @client
  }
`;

export type HeaderData = {
  menuItems: any[];
  bannerLinks: any[];
};

export class HeaderQuery extends Query<HeaderData> {
  static defaultProps = {
    query: GET_HEADER_DATA
  };
}
