const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

class FalconServer {
  constructor(conf) {
    this.config = conf;
  }

  start() {
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

    app.listen({ port: this.config.port }, () => {
      console.log(`🚀 Server ready at http://localhost:${this.config.port}`);
    });
  }
}

module.exports = FalconServer;
