import { verifyJwt } from '~/server/utils/jwt'

export default defineEventHandler((event) => {
    const token = getCookie(event, 'session')
    if (!token) return

    const payload = verifyJwt(token)
    if (payload?.uid) {
        event.context.userId = payload.uid
        event.context.email = payload.email
    }
})
