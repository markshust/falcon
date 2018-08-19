const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');
const Logger = require('@deity/falcon-logger');

const ENV = process.env.NODE_ENV || 'development';
const isDevelopment = ENV === 'development';

class FalconServer {
  constructor(config) {
    Logger.setLogLevel(config.logLevel);

    this.config = config;
  }

  start() {
    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`
      type UrlResult {
        type: String
        url: String
      }

      type Query {
        getUrl(url: String!): UrlResult
      }
    `;

    // Provide resolver functions for your schema fields
    const resolvers = {
      Query: {
        getUrl: async (_, { url }) => {
          return {
            url,
            type: 'shop'
          };
        }
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
