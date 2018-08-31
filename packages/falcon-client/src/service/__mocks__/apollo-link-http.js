// eslint-disable-next-line import/no-extraneous-dependencies
import { SchemaLink } from 'apollo-link-schema';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeExecutableSchema } from 'graphql-tools';

const createHttpLink = () => {
  const typeDefs = `
    type Query {
      foo: String
    }
  `;
  const resolvers = {
    Query: {}
  };

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  return new SchemaLink({ schema });
};

// eslint-disable-next-line import/prefer-default-export
export { createHttpLink };
