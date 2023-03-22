export const errorMap = {
  INVALID_USER: 'has valid token but userid is invalid',
  DATABASE_ERROR: 'database query error',
  PERMISSION_DENIED: 'user has no permission to access this resource',
  UNAUTHORIZED: 'user has no token or token is invalid',
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
