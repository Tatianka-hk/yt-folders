import nodemailer from 'nodemailer'

import {
    getEmailTranslation,
    normalizeLocale,
    type AppLocale,
} from '~/server/utils/email_i18n'

type SendVerificationEmailParams = {
    email: string
    verificationToken: string
    locale?: AppLocale | string
    event: Parameters<typeof useRuntimeConfig>[0]
}

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

export async function sendVerificationEmail({
    email,
    verificationToken,
    locale,
    event,
}: SendVerificationEmailParams) {
    const config = useRuntimeConfig(event)

    if (
        !config.smtpHost ||
        !config.smtpPort ||
        !config.smtpUser ||
        !config.smtpPassword ||
        !config.emailFrom
    ) {
        throw new Error('SMTP configuration is missing')
    }

    const normalizedLocale = normalizeLocale(locale)

    const t = (key: string) =>
        getEmailTranslation(normalizedLocale, `email.verify-email.${key}`)
    const subject = t('subject')

    const verificationUrl = new URL(
        '/verify-email',
        config.public.appUrl as string
    )

    verificationUrl.searchParams.set('token', verificationToken)

    verificationUrl.searchParams.set('locale', normalizedLocale)

    const verificationLink = verificationUrl.toString()
    const safeVerificationLink = escapeHtml(verificationLink)

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort),
        secure: Number(config.smtpPort) === 465,
        auth: {
            user: config.smtpUser,
            pass: config.smtpPassword,
        },
    })

    const emailResponse = await transporter.sendMail({
        from: config.emailFrom,
        to: email,
        subject: t('subject'),

        text: `
${t('welcome')}

${t('description')}

${verificationLink}

${t('expires')}

${t('fallback')}
${verificationLink}
        `.trim(),

        html: `
            <!doctype html>
            <html lang="${normalizedLocale}">
                <head>
                    <meta charset="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                </head>

                <body
                    style="
                        margin: 0;
                        padding: 0;
                        background-color: #ffffff;
                        font-family: Arial, sans-serif;
                        color: #111111;
                    "
                >
                    <div
                        style="
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 40px 24px;
                            line-height: 1.6;
                        "
                    >
                        <h2
                            style="
                                margin: 0 0 24px;
                                font-size: 24px;
                                font-weight: 600;
                            "
                        >
                            ${escapeHtml(t('title'))}
                        </h2>

                        <p style="margin: 0 0 16px;">
                            ${escapeHtml(t('welcome'))}
                        </p>

                        <p style="margin: 0 0 24px;">
                            ${escapeHtml(t('description'))}
                        </p>

                        <p style="margin: 0 0 24px;">
                            <a
                                href="${safeVerificationLink}"
                                style="
                                    display: inline-block;
                                    padding: 12px 20px;
                                    background-color: #2563eb;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 6px;
                                "
                            >
                                ${escapeHtml(t('button'))}
                            </a>
                        </p>

                        <p style="margin: 0 0 24px;">
                            ${escapeHtml(t('expires'))}
                        </p>

                        <p style="margin: 0 0 8px;">
                            ${escapeHtml(t('fallback'))}
                        </p>

                        <p
                            style="
                                margin: 0;
                                word-break: break-all;
                            "
                        >
                            <a href="${safeVerificationLink}">
                                ${safeVerificationLink}
                            </a>
                        </p>
                    </div>
                </body>
            </html>
        `,
    })

    return emailResponse
}
