import type { CustomError } from './error'

export function pkg(res: any, code: number, data: any) {
  res.status(code).json(data)
}

export function ok(res: any, data: any) {
  pkg(res, 200, data)
}

export function err(res: any, error: CustomError) {
  pkg(res, 488, error)
}

