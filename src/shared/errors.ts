export class ExpectedError extends Error { // 400
  constructor(message: string) {
    super(message);
    this.name = 'ExpectedError';
  }
}

export class ConflictError extends Error { // 409
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class NotAllowedError extends Error { // 401
  constructor(message: string) {
    super(message);
    this.name = 'NotAllowedError';
  }
}

export class NotFoundError extends Error { // 404
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}