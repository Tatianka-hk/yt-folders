import { createHash, randomBytes } from 'node:crypto'
import { Types } from 'mongoose'

import { TOKEN_EXPIRES_MS } from '~/static/user'
import { VerificationToken } from '../models/VerificationToken'
import { sendVerificationEmail } from './send_email'

export const verifyEmail = async (
    userId: Types.ObjectId,
    email: string,
    locale: string,
    event: Parameters<typeof useRuntimeConfig>[0]
) => {
    const verificationToken = randomBytes(32).toString('hex')

    const verificationTokenHash = getTokenHash(verificationToken)
    const verificationTokenExpiresAt = new Date(Date.now() + TOKEN_EXPIRES_MS)

    await VerificationToken.create({
        userId,
        token: verificationTokenHash,

        createdAt: new Date(),
        expiresAt: verificationTokenExpiresAt,
    })
    await sendVerificationEmail({
        email,
        verificationToken: verificationToken,
        locale,
        event,
    })
}

export const getTokenHash = (token: string) => {
    const salt = process.env.PASSWORD_SALT
    return createHash('sha256')
        .update(token + salt)
        .digest('hex')
}
