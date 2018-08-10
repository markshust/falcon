const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');
const Logger = require('@deity/falcon-logger');

const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

class FalconServer {
  constructor(conf) {
    Logger.setLogLevel(conf.logLevel);

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
      Logger.info(`🚀 Server ready at http://localhost:${this.config.port}`);
    });
  }
}

module.exports = FalconServer;
