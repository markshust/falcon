import { from } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

/**
 * Creates an ApolloClient instance with the provided arguments
 * @param {boolean} [isBrowser=false] Boolean flag to determine the current environment
 * @param {object} [initialState={}] Object to restore Cache data from
 * @param {string} [serverUri="http://localhost:4000/graphql"] ApolloServer URL
 * @return {ApolloClient} ApolloClient instance
 */
export default (isBrowser = false, initialState = {}, serverUri = 'http://localhost:4000/graphql') => {
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
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: from([linkState, httpLink])
  });
};
