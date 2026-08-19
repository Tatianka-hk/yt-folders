import { createHash, randomBytes } from 'crypto'
import { Types } from 'mongoose'

import { TOKEN_EXPIRES_MS } from '~/static/user'

import { VerificationToken } from '../models/VerificationToken'
import { sendEmail } from '../services/email/emailService'
import { buildVerificationEmailTemplate } from '../services/email/templates/verificationEmailTemplate'

import ua from '~/i18n/locales/ua.json'
import en from '~/i18n/locales/en.json'
import esp from '~/i18n/locales/esp.json'
import cat from '~/i18n/locales/cat.json'
import { TOKEN_TYPE } from '~/static/auth'

export type AppLocale = 'ua' | 'en' | 'esp' | 'cat'
type TranslationValue = string | Record<string, unknown>

export interface EmailTemplateParams {
    locale: AppLocale
    link: string
}

const translations = {
    ua,
    en,
    esp,
    cat,
} as const

export function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

export const verifyEmail = async (
    userId: Types.ObjectId,
    email: string,
    locale: string,
    event: Parameters<typeof useRuntimeConfig>[0]
) => {
    const config = useRuntimeConfig(event)
    const verificationToken = randomBytes(32).toString('hex')

    const verificationTokenHash = getTokenHash(verificationToken)
    const verificationTokenExpiresAt = new Date(Date.now() + TOKEN_EXPIRES_MS)

    const tokenDocument = await VerificationToken.create({
        userId,
        token: verificationTokenHash,
        type: TOKEN_TYPE.EMAIL_VERIFICATION,

        createdAt: new Date(),
        expiresAt: verificationTokenExpiresAt,
    })

    const verificationUrl = new URL(
        locale == 'ua' ? '/verify-email' : `/${locale}/verify-email`,
        config.public.appUrl as string
    )
    verificationUrl.searchParams.set('token', verificationToken)
    const verificationLink = verificationUrl.toString()
    try {
        const template = buildVerificationEmailTemplate({
            locale: locale as AppLocale,
            link: verificationLink,
        })

        return sendEmail({
            event: event!,
            to: email,
            subject: template.subject,
            text: template.text,
            html: template.html,
        })
    } catch (error) {
        await VerificationToken.deleteOne({
            _id: tokenDocument._id,
        })
        console.error(error)
    }
}

export const getTokenHash = (token: string) => {
    const salt = process.env.PASSWORD_SALT
    return createHash('sha256')
        .update(token + salt)
        .digest('hex')
}

export function normalizeLocale(locale?: string): AppLocale {
    switch (locale?.toLowerCase()) {
        case 'ua':
            return 'ua'

        case 'esp':
            return 'esp'

        case 'cat':
            return 'cat'

        case 'en':

        default:
            return 'en'
    }
}

export function getEmailTranslation(locale: AppLocale, path: string): string {
    const keys = path.split('.')

    let value: TranslationValue = translations[locale] as TranslationValue

    for (const key of keys) {
        if (typeof value !== 'object' || value === null || !(key in value)) {
            console.warn(
                `Missing email translation: "${path}" for locale "${locale}"`
            )

            return path
        }

        value = value[key] as TranslationValue
    }

    return typeof value === 'string' ? value : path
}
