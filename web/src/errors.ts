export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}

export class BadRequestError extends DomainError {
  constructor(message: string = 'Bad Request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = 'Not Found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = 'Conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class InternalServerError extends DomainError {
  constructor(message: string = 'Internal Server Error') {
    super(message)
    this.name = 'InternalServerError'
  }
}
