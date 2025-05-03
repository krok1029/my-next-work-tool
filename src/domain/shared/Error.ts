export class AuthenticationError extends Error {
  constructor(message = 'User not authenticated') {
    super(message);
    this.name = 'AuthenticationError';
  }
}
