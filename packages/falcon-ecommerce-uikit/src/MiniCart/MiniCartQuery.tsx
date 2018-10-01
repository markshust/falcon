import gql from 'graphql-tag';
import { Query } from '../Query/Query';

const GET_MINI_CART = gql`
  query miniCart {
    miniCart @client {
      open
    }
    basketItems @client
  }
`;

export type MiniCartData = {
  miniCart: {
    open: boolean;
  };
  basketItems: any[];
};

export class MiniCartQuery extends Query<MiniCartData> {
  static defaultProps = {
    query: GET_MINI_CART
  };
}
