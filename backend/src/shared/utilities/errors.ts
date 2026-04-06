export class UnauthorizedError extends Error {
  constructor(message = 'Authentication required.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Action forbidden for current role/scope.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(message = 'Invalid workflow state transition.') {
    super(message);
    this.name = 'InvalidStateTransitionError';
  }
}
