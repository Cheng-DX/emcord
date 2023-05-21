import consola from 'consola'
import type { RawData, WebSocket } from 'ws'
import JWT from 'jsonwebtoken'

export function jsonParse<T>(ws: WebSocket, data: RawData) {
  try {
    const json = JSON.parse(data.toString())
    return json as T
  }
  catch (e) {
    consola.error('[ws]: JSON parse error')
    ws.send(createWSError(500, '[ws]: JSON parse error'))
  }
}

export function jsonStringfy<T>(ws: WebSocket, data: T) {
  try {
    const json = JSON.stringify(data)
    return json
  }
  catch (e) {
    consola.error('[ws]: JSON stringfy error')
    ws.send(createWSError(500, '[ws]: JSON stringfy error'))
  }
}

export function createWSOK<T>(data: T) {
  return JSON.stringify({
    code: 200,
    data,
  })
}

export function createWSError(code: 401 | 500 | 488, message: string) {
  return JSON.stringify({
    code,
    message,
  })
}

export function verifyToken(token?: string) {
  if (!token)
    return [false] as const
  try {
    const result = JWT.verify(
      token,
      process.env.SECRET_KEY!,
    ) as { userId: string }
    return [true, result] as const
  }
  catch (e: any) {
    consola.error(e.message)
    return [false] as const
  }
}

export function createServerSetMap() {
  const serverSetMap = new Map<string, Set<WebSocket>>()

  function add(serverId: string, ws: WebSocket) {
    if (serverSetMap.has(serverId)) {
      const set = serverSetMap.get(serverId)!
      set.add(ws)
    }
    else {
      const set = new Set<WebSocket>([ws])
      serverSetMap.set(serverId, set)
    }
  }

  function remove(serverId: string, ws: WebSocket) {
    if (serverSetMap.has(serverId))
      serverSetMap.get(serverId)!.delete(ws)
  }

  return {
    serverSetMap,
    add,
    remove,
  }
}
