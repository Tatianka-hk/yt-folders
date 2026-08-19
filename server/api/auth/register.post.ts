import { isError } from 'h3'

import { User } from '~/server/models/User'
import { verifyEmail } from '~/server/utils/emails'
import connectDB from '~/server/utils/db'
import { trackUserEvent } from '~/server/services/analyticsService'
import { EVENTS } from '~/static/analytic'
import { hashPassword } from './utils'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<{
            email: string
            password: string
            locale: string
        }>(event)
        const email = body?.email?.trim()?.toLowerCase()
        const password = body?.password?.trim()
        const locale = body?.locale

        if (!email || !password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing email or password',
            })
        }

        const hashedPassword = hashPassword(password)

        await connectDB()

        const existing = await User.findOne({ email })
        if (existing) {
            throw createError({
                statusCode: 409,
                statusMessage: 'User already exists',
            })
        }

        const newUser = await User.insertOne({
            email: email,
            password: hashedPassword,
            createdAt: new Date(),
        })

        await verifyEmail(newUser._id, email, locale, event)
        await trackUserEvent({
            userId: newUser._id.toString(),
            email,
            type: EVENTS.REGISTER,
        })
        return { success: true, message: 'User registered' }
    } catch (err: any) {
        if (isError(err)) {
            throw err
        }
        console.error(err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error',
            data: String(err),
        })
    }
})
