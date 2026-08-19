import { randomBytes } from 'crypto'
import { User } from '~/server/models'
import { VerificationToken } from '~/server/models/VerificationToken'
import { sendEmail } from '~/server/services/email/emailService'
import { buildResetPasswordEmailTemplate } from '~/server/services/email/templates/resetPasswordEmailTemplate'
import connectDB from '~/server/utils/db'
import { TOKEN_TYPE } from '~/static/auth'

interface ResetPasswordBody {
    email?: string
    locale?: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody<ResetPasswordBody>(event)

    const email = body.email?.trim().toLowerCase()
    const locale = body.locale ?? 'en'
    await connectDB()

    if (!email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'EMAIL_REQUIRED',
        })
    }

    try {
        const config = useRuntimeConfig(event)

        const normalizedLocale = normalizeLocale(locale)

        const user = await User.findOne({
            email: email.toLowerCase(),
        })

        if (!user) {
            return
        }

        const resetToken = randomBytes(32).toString('hex')

        const hashedToken = getTokenHash(resetToken)

        await VerificationToken.deleteMany({
            userId: user._id,
            type: TOKEN_TYPE.RESET_PASSWORD,
        })

        await VerificationToken.create({
            userId: user._id,
            token: hashedToken,
            type: TOKEN_TYPE.RESET_PASSWORD,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        })

        const resetUrl = new URL(
            locale == 'ua'
                ? '/change-password'
                : `/${normalizedLocale}/change-password`,
            config.public.appUrl as string
        )

        resetUrl.searchParams.set('token', resetToken)

        const resetPasswordLink = resetUrl.toString()

        const template = buildResetPasswordEmailTemplate({
            locale: normalizedLocale,
            link: resetPasswordLink,
        })

        return sendEmail({
            event,
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html,
        })

        return {
            success: true,
            message: 'RESET_PASSWORD_EMAIL_SENT',
        }
    } catch (error) {
        console.error('RESET_PASSWORD_ENDPOINT_ERROR', {
            email,
            error,
        })

        throw createError({
            statusCode: 500,
            statusMessage: 'RESET_PASSWORD_EMAIL_ERROR',
        })
    }
})
