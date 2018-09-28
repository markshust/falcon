import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const TOGGLE_MINI_CART = gql`
  mutation {
    toggleMiniCart @client
  }
`;

export class ToggleMiniCartMutation extends Mutation {
  static defaultProps = {
    mutation: TOGGLE_MINI_CART
  };
}
