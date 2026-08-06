import connectDB from '~/server/utils/db'
import { User } from '~/server/models/User'
import { VerificationToken } from '~/server/models/VerificationToken'
import { UserStatusEnum } from '~/static/user'
import { getTokenHash } from '~/server/utils/verify_email'

type VerifyEmailBody = {
    token?: string
}

export default defineEventHandler(async (event) => {
    await connectDB()

    const body = await readBody<VerifyEmailBody>(event)
    const token = body.token?.trim()

    if (!token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Verification token is required',
            data: {
                code: 'TOKEN_REQUIRED',
            },
        })
    }

    const hashedToken = getTokenHash(token)

    const verificationToken = await VerificationToken.findOne({
        token: hashedToken,
    })

    if (!verificationToken) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid verification token',
            data: {
                code: 'INVALID_TOKEN',
            },
        })
    }

    if (
        !verificationToken.expiresAt ||
        verificationToken.expiresAt.getTime() <= Date.now()
    ) {
        await VerificationToken.deleteOne({
            _id: verificationToken._id,
        })

        throw createError({
            statusCode: 410,
            statusMessage: 'Verification token has expired',
            data: {
                code: 'TOKEN_EXPIRED',
            },
        })
    }

    const user = await User.findById(verificationToken.userId)

    if (!user) {
        await VerificationToken.deleteOne({
            _id: verificationToken._id,
        })

        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
            data: {
                code: 'USER_NOT_FOUND',
            },
        })
    }

    if (user.emailStatus === UserStatusEnum.VERIFIED) {
        await VerificationToken.deleteOne({
            _id: verificationToken._id,
        })

        return {
            success: true,
            message: 'Email is already verified',
            emailStatus: UserStatusEnum.VERIFIED,
        }
    }

    user.emailStatus = UserStatusEnum.VERIFIED

    await user.save()

    await VerificationToken.deleteMany({
        userId: user._id,
    })

    return {
        success: true,
        message: 'Email verified successfully',
        emailStatus: UserStatusEnum.VERIFIED,
    }
})
