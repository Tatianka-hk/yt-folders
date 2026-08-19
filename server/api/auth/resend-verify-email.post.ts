import connectDB from '~/server/utils/db'
import { User } from '~/server/models/User'
import { VerificationToken } from '~/server/models/VerificationToken'
import { UserStatusEnum } from '~/static/user'

type ResendVerifyEmailBody = {
    email?: string
    locale?: string
}

export default defineEventHandler(async (event) => {
    await connectDB()

    const body = await readBody<ResendVerifyEmailBody>(event)

    const normalizedEmail = body.email?.trim().toLowerCase()
    const locale = body.locale ?? 'en'

    if (!normalizedEmail) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email is required',
            data: {
                code: 'EMAIL_REQUIRED',
            },
        })
    }

    const user = await User.findOne({
        email: normalizedEmail,
    })

    if (!user) {
        return {
            success: true,
            message:
                'If an account with this email exists, a verification email has been sent.',
        }
    }

    if (user.emailStatus === UserStatusEnum.VERIFIED) {
        return {
            success: true,
            message: 'Email is already verified',
            emailStatus: UserStatusEnum.VERIFIED,
        }
    }

    await VerificationToken.deleteMany({
        userId: user._id,
    })

    try {
        await verifyEmail({
            userId: user._id,
            email: user.email as string,
            locale: locale ?? 'en',
            event,
        })
    } catch (error) {
        console.error('Resend verification email error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Could not send verification email',
            data: {
                code: 'EMAIL_SEND_FAILED',
            },
        })
    }

    return {
        success: true,
        message: 'Verification email has been sent',
        retryAfterSeconds: 60,
    }
})
