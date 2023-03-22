import type { TokenPayload } from '@emcord/types'

export function getAuth(req: any) {
  return req.auth as TokenPayload
}
