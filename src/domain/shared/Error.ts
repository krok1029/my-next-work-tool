export class AuthenticationError extends Error {
  constructor(message = 'User not authenticated') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class StandandError extends Error {
  constructor(message = 'Standard error') {
    super(message);
    this.name = 'StandardError';
  }
}
export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}