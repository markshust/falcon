const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

const PORT = Number(process.env.PORT) || 4000;
const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'World'
  }
};

const server = new ApolloServer({
  tracing: isDevelopment,
  playground: isDevelopment,
  typeDefs,
  resolvers
});

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
