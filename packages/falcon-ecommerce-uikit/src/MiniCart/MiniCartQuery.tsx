import gql from 'graphql-tag';
import { Query } from '../Query/Query';

const GET_MINI_CART = gql`
  query miniCart {
    miniCart @client {
      open
    }
  }
`;

export type MiniCartData = {
  miniCart: {
    open: boolean;
  };
};

export class MiniCartQuery extends Query<MiniCartData> {
  static defaultProps = {
    query: GET_MINI_CART
  };
}
