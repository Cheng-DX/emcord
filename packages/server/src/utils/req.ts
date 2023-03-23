import type { TokenPayload } from '@emcord/types'

export function getAuth(req: any) {
  const { userId, name, avator, profile } = req.auth

  return { userId, name, avator, profile } as TokenPayload
}
