import { User } from '~/server/models/User'
import { LOGIN_ERRORS } from '~/static/auth'
import { UserStatusEnum } from '~/static/user'
import connectDB from './../../utils/db'
import { hashPassword, limitLoginAttempts } from './utils'
import { signJwt, setSessionCookie } from './../../utils/jwt'

export default defineEventHandler(async (event) => {
    try {
        const { visited } = limitLoginAttempts(event)

        if (visited >= 30) {
            setResponseStatus(event, 429, LOGIN_ERRORS.TOO_MANY_REQUESTS)

            return {
                success: false,
                message: LOGIN_ERRORS.TOO_MANY_REQUESTS,
            }
        }
        const body = await readBody<{
            email: string
            password: string
        }>(event)

        const email = body?.email?.trim()?.toLowerCase()
        const password = body?.password?.trim()

        if (!email || !password) {
            setResponseStatus(event, 400, LOGIN_ERRORS.INCORRECT_CREDERNTIALS)

            return {
                success: false,
                message: LOGIN_ERRORS.INCORRECT_CREDERNTIALS,
            }
        }

        const hashedPassword = hashPassword(password)

        await connectDB()

        const existingUser = await User.findOne({
            email,
        })
        if (!existingUser) {
            setResponseStatus(event, 401, LOGIN_ERRORS.INCORRECT_CREDERNTIALS)

            return {
                success: false,
                message: LOGIN_ERRORS.INCORRECT_CREDERNTIALS,
            }
        }
        if (existingUser.emailStatus === UserStatusEnum.PENDING) {
            setResponseStatus(event, 401, LOGIN_ERRORS.EMAIL_NOT_VERIFIED)

            return {
                success: false,
                message: LOGIN_ERRORS.EMAIL_NOT_VERIFIED,
            }
        }
        if (existingUser && existingUser.password === hashedPassword) {
            const token = signJwt({ uid: String(existingUser._id) })
            setSessionCookie(event, token)

            return { success: true, message: 'User is authorized' }
        } else {
            setResponseStatus(event, 401, LOGIN_ERRORS.INCORRECT_CREDERNTIALS)
            return {
                success: false,
                message: LOGIN_ERRORS.INCORRECT_CREDERNTIALS,
            }
        }
    } catch (err) {
        console.error('Login failed:', err)
        throw createError({
            statusCode: 500,
            statusMessage: LOGIN_ERRORS.SOMETHING_WENT_WRONG,
            data: String(err),
        })
    }
})
