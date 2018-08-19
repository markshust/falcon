import { from } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

/**
 * @typedef {object} FalconApolloClientConfig
 * @property {boolean} [isBrowser=false] Boolean flag to determine the current environment
 * @property {object} [initialState={}] Object to restore Cache data from
 * @property {string} [serverUri="http://localhost:4000/graphql"] ApolloServer URL
 */

/**
 * Creates an ApolloClient instance with the provided arguments
 * @param {FalconApolloClientConfig} config Falcon configuration for creating ApolloClient instance
 * @return {ApolloClient} ApolloClient instance
 */
export default (config = {}) => {
  const { isBrowser = false, initialState = {}, serverUri = 'http://localhost:4000/graphql' } = config;

  const cache = new InMemoryCache().restore(initialState || {});
  const linkState = withClientState({
    cache,
    resolvers: {},
    defaults: {}
  });
  const httpLink = createHttpLink({
    uri: serverUri,
    credentials: 'same-origin'
  });

  return new ApolloClient({
    cache,
    connectToDevTools: isBrowser && process.env.NODE_ENV !== 'production',
    ssrMode: !isBrowser,
    link: from([linkState, httpLink])
  });
};
