import { createHash, randomBytes } from 'crypto'
import { Types } from 'mongoose'

import { TOKEN_EXPIRES_MS } from '~/static/user'
import { VerificationToken } from '../models/VerificationToken'

export interface EmailTemplateParams {
    locale: AppLocale
    verificationLink: string
}

export function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

export const getTokenHash = (token: string) => {
    const salt = process.env.PASSWORD_SALT
    return createHash('sha256')
        .update(token + salt)
        .digest('hex')
}

export const verifyEmail = async (
    userId: Types.ObjectId,
    email: string,
    locale: string,
    event: Parameters<typeof useRuntimeConfig>[0]
) => {
    const verificationToken = randomBytes(32).toString('hex')

    const verificationTokenHash = getTokenHash(verificationToken)
    const verificationTokenExpiresAt = new Date(Date.now() + TOKEN_EXPIRES_MS)

    const tokenDocument = await VerificationToken.create({
        userId,
        token: verificationTokenHash,

        createdAt: new Date(),
        expiresAt: verificationTokenExpiresAt,
    })
    try {
        await sendVerificationEmail({
            email,
            verificationToken: verificationToken,
            locale,
            event,
        })
    } catch (error) {
        await VerificationToken.deleteOne({
            _id: tokenDocument._id,
        })
        console.error(error)
    }
}
