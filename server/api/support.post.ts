import { SupportBody } from '~/apis/support'
import { sendEmail } from '../services/email/emailService'
import { templateSupport } from '../services/email/templates/supportTemplate'
import { sendTelegramMessage } from '../services/telegramService'

export default defineEventHandler(async (event) => {
    const body = await readBody<SupportBody>(event)

    const email = body.email?.trim().toLowerCase()
    const message = body.message?.trim()

    if (!email || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and message are required',
            data: {
                message: 'Email and message are required',
            },
        })
    }

    if (message.length < 10) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Message is too short',
            data: {
                message: 'Message is too short',
            },
        })
    }
    const config = useRuntimeConfig(event)

    await sendEmail({
        event: event,
        to: config.emailFrom,
        subject: `новий запит ${email}`,
        html: templateSupport({
            email,
            message,
        }),
    })

    sendTelegramMessage(`
    📩 Новий запрос

    Пошта: ${email ?? '-'}
    Повідомлення: ${message}
    `)
    console.log('Support request:', {
        email,
        message,
    })

    return {
        success: true,
    }
})
