import jwt from 'jsonwebtoken'
import { env } from './env'

export interface JwtPayload {
  sub: string
}

export const signJwt = (userId: string) =>
  jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '1d' })

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    if (typeof payload === 'string' || typeof payload.sub !== 'string') return null
    return { sub: payload.sub }
  } catch {
    return null
  }
}
