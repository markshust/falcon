import { from } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';

/**
 * @typedef {object} FalconApolloLinkStateConfig
 * @property {object} defaults https://www.apollographql.com/docs/link/links/state.html#defaults
 * @property {object} resolvers https://www.apollographql.com/docs/link/links/state.html#resolver
 */

/**
 * @typedef {object} FalconApolloClientConfig
 * @property {boolean} [isBrowser=false] Boolean flag to determine the current environment
 * @property {object} [initialState={}] Object to restore Cache data from
 * @property {string} [serverUri="http://localhost:4000/graphql"] ApolloServer URL
 * @property {FalconApolloLinkStateConfig} [clientState={}] https://www.apollographql.com/docs/link/links/state.html
 */

/**
 * Creates an ApolloClient instance with the provided arguments
 * @param {FalconApolloClientConfig} config Falcon configuration for creating ApolloClient instance
 * @return {ApolloClient} ApolloClient instance
 */
export default (config = {}) => {
  const addTypename = false;
  const {
    extraLinks = [],
    isBrowser = false,
    initialState = {},
    clientState = {},
    serverUri = 'http://localhost:4000/graphql'
  } = config;

  const cache = new InMemoryCache({ addTypename }).restore(initialState || {});
  const linkState = withClientState({
    cache,
    ...clientState
  });
  const httpLink = createHttpLink({
    uri: serverUri,
    fetch,
    credentials: 'include'
  });

  return new ApolloClient({
    cache,
    connectToDevTools: isBrowser && process.env.NODE_ENV !== 'production',
    ssrMode: !isBrowser,
    addTypename,
    link: from([...extraLinks, linkState, httpLink])
  });
};
