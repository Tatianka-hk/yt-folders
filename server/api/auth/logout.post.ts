import { clearSessionCookie } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
    clearSessionCookie(event)
    return { success: true }
})
