class RequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'RequestError';
  }
}

module.exports = RequestError;
