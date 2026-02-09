import { User } from '~/server/models/User'
import connectDB from './../../utils/db'
import { hashPassword } from './utils'

export default defineEventHandler(async (event) => {
    const body = await readBody<{
        email: string
        password: string
    }>(event)
    const email = body.email.trim().toLowerCase()
    const password = body.password.trim()

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

    await User.insertOne({
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
    })

    return { success: true, message: 'User registered' }
})
