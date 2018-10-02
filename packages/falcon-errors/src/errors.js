const { ApolloError } = require('apollo-server-errors');
const codes = require('./codes');

module.exports.EntityNotFoundError = class EntityNotFoundError extends ApolloError {
  constructor(message = 'Entity not found') {
    super(message, codes.NOT_FOUND);
    Object.defineProperty(this, 'name', { value: 'EntityNotFoundError' });
  }
};
