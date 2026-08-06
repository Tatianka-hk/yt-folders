import crypto from 'crypto'
import type { H3Event } from 'h3'
import { getCookie, setCookie } from 'h3'

const LIMIT_MS = 60 * 60 * 1000

export const hashPassword = (password: string) => {
    const salt = process.env.PASSWORD_SALT
    return crypto
        .createHash('sha256')
        .update(password + salt)
        .digest('hex')
}

export const limitLoginAttempts = (event: H3Event) => {
    const now = new Date()

    const visitedRaw = getCookie(event, 'visited')
    const modifyTimeRaw = getCookie(event, 'modifyTime')

    let visited = visitedRaw ? parseInt(visitedRaw, 10) : 0
    let modifyTime = modifyTimeRaw ? new Date(Number(modifyTimeRaw)) : null

    if (!modifyTime || now.getTime() - modifyTime.getTime() > LIMIT_MS) {
        visited = 1
        modifyTime = now
    } else {
        visited += 1
        modifyTime = now
    }

    setCookie(event, 'visited', String(visited), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    })
    setCookie(event, 'modifyTime', String(modifyTime), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    })

    return { visited }
}
