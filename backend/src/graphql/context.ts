import type { Request } from 'express'
import { verifyJwt } from '../utils/jwt'

export interface GraphQLContext {
  userId: string | null
}

export function buildContext({ req }: { req: Request }): Promise<GraphQLContext> {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  const payload = token ? verifyJwt(token) : null
  return Promise.resolve({ userId: payload?.sub ?? null })
}
