import { EmailTemplateParams, escapeHtml } from '~/server/utils/emails'

export function buildVerificationEmailTemplate({
    locale,
    verificationLink,
}: EmailTemplateParams) {
    const t = (key: string) =>
        getEmailTranslation(locale, `email.verify-email.${key}`)

    const safeVerificationLink = escapeHtml(verificationLink)

    const subject = t('subject')

    const text = `
${t('welcome')}

${t('description')}

${verificationLink}

${t('expires')}

${t('fallback')}
${verificationLink}
    `.trim()

    const html = `
        <!doctype html>
        <html lang="${locale}">
            ...
        </html>
    `

    return {
        subject,
        text,
        html,
    }
}
