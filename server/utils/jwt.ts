import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
}

export interface JwtPayload {
    uid: string
}

export function signJwt(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyJwt(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload
    } catch {
        return null
    }
}

export function setSessionCookie(event: H3Event, token: string) {
    setCookie(event, 'session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    })
}

export function clearSessionCookie(event: H3Event) {
    deleteCookie(event, 'session', { path: '/' })
}
