const { GraphQLError } = require('graphql/index')

class UserInputError extends GraphQLError {
  constructor(message, extensions) {
    super(
      message, { extensions: { ...extensions, code: 'BAD_USER_INPUT' }}
    );
  }
}

class AuthenticationError extends GraphQLError {
  constructor(message, extensions = {}) {
    super(
      message, { extensions: { ...extensions, code: 'FORBIDDEN' }}
    );
  }
}

module.exports = {
  AuthenticationError,
  UserInputError
}