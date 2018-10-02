const errorCodes = {
  GRAPHQL_PARSE_FAILED: null,
  GRAPHQL_VALIDATION_FAILED: null,
  INTERNAL_SERVER_ERROR: null,
  CUSTOMER_TOKEN_INVALID: null,
  CUSTOMER_TOKEN_EXPIRED: null,
  NOT_FOUND: null
};

Object.keys(errorCodes).forEach(key => {
  errorCodes[key] = key;
});

module.exports = errorCodes;
