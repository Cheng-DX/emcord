export const errorMap = {
  INVALID_USER: 'has valid token but userid is invalid',
  DATABASE_ERROR: 'database query error',
  PERMISSION_DENIED: 'user has no permission to access this resource',
  UNAUTHORIZED: 'user has no token or token is invalid',
  INVALID_IDENTITY: 'user has valid token but identity is invalid',
  INVALID_REQUEST: 'some fields in request body is invalid',
  DENIED: 'action denied',
}

export type CustomErrorType = keyof typeof errorMap

export class CustomError extends Error {
  type: CustomErrorType

  constructor(type: CustomErrorType) {
    super(errorMap[type])
    this.type = type
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
    }
  }
}

export function isValidChannelType(type: number) {
  return [0, 1].includes(type)
}
