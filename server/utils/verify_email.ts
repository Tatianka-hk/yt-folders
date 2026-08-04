import { createHash, randomBytes } from 'node:crypto'
import { Types } from 'mongoose'

import { VerificationToken } from '../models/VerificationToken'
import { sendVerificationEmail } from './send_email'

export const verifyEmail = async (
    userId: Types.ObjectId,
    email: string,
    event: Parameters<typeof useRuntimeConfig>[0]
) => {
    const verificationToken = randomBytes(32).toString('hex')

    const verificationTokenHash = getTokenHash(verificationToken)
    const verificationTokenExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
    )

    await VerificationToken.create({
        userId,
        token: verificationTokenHash,
        createdAt: new Date(),
        expiresAt: verificationTokenExpiresAt,
    })
    await sendVerificationEmail({
        email,
        verificationToken: verificationToken,
        event,
    })
}

export const getTokenHash = (token: string) => {
    const salt = process.env.PASSWORD_SALT
    return createHash('sha256')
        .update(token + salt)
        .digest('hex')
}
