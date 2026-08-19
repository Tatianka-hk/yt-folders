import nodemailer from 'nodemailer'
import type { H3Event } from 'h3'

interface SendEmailParams {
    event: H3Event
    to: string
    subject: string
    html: string
    text?: string
}

export async function sendEmail({
    event,
    to,
    subject,
    html,
    text,
}: SendEmailParams) {
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

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort),
        secure: Number(config.smtpPort) === 465,

        auth: {
            user: config.smtpUser,
            pass: config.smtpPassword,
        },
    })

    try {
        return await transporter.sendMail({
            from: config.emailFrom,
            to,
            subject,
            text,
            html,
        })
    } catch (error) {
        console.error('EMAIL_SEND_ERROR', {
            to,
            subject,
            error,
        })

        throw error
    }
}
