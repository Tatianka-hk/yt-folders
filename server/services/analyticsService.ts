import { sendTelegramMessage } from './telegramService'
import { EVENTS } from '@/static/analytic'

interface TrackEventOptions {
    userId: string
    email: string
    type: EVENTS
    data?: Record<string, unknown>
}

export async function trackUserEvent({
    userId,
    email,
    type,
    data = {},
}: TrackEventOptions) {
    await sendTelegramMessage(
        formatTelegramMessage({
            userId,
            email,
            type,
            data,
        })
    )
}

function formatTelegramMessage({
    userId,
    email,
    type,
    data,
}: TrackEventOptions) {
    switch (type) {
        case EVENTS.REGISTER:
            return `
🆕 New registration

User: ${userId}
Email: ${email ?? '-'}
`.trim()

        case EVENTS.LOGIN:
            return `
🔐 User logged in

User: ${userId}
Email: ${email ?? '-'}
`.trim()

        case EVENTS.CHANNEL_SEARCH:
            return `
🔎 YouTube search

User: ${userId}
Email: ${email ?? '-'}
Query: ${data?.query ?? '-'}
Results: ${data?.resultsCount ?? '-'}
`.trim()
    }
}
