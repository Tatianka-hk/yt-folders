import { User } from '~/server/models/User'
import { VerificationToken } from '~/server/models/VerificationToken'
import { PASSWORD_MIN_LENGTH } from '~/static/auth'
import connectDB from '~/server/utils/db'
import { hashPassword } from '../utils'

interface ResetPasswordBody {
    token?: string
    password?: string
}

export default defineEventHandler(async (event) => {
    await connectDB()
    const body = await readBody<ResetPasswordBody>(event)

    const token = body.token?.trim()
    const password = body.password?.trim()

    if (!token || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'TOKEN_AND_PASSWORD_REQUIRED',
        })
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        throw createError({
            statusCode: 400,
            statusMessage: 'PASSWORD_TOO_SHORT',
        })
    }

    const hashedToken = getTokenHash(token)
    const resetToken = await VerificationToken.findOne({
        token: hashedToken,
        expiresAt: {
            $gt: new Date(),
        },
    })

    if (!resetToken) {
        throw createError({
            statusCode: 400,
            statusMessage: 'INVALID_OR_EXPIRED_TOKEN',
        })
    }

    const user = await User.findById(resetToken.userId)

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'USER_NOT_FOUND',
        })
    }

    const hashedPassword = hashPassword(password)

    user.password = hashedPassword

    await user.save()

    await VerificationToken.deleteMany({
        userId: user._id,
    })

    return {
        success: true,
        message: 'PASSWORD_RESET_SUCCESS',
    }
})
