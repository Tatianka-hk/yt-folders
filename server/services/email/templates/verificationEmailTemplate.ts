import { EmailTemplateParams, getEmailTranslation } from '~/server/utils/emails'

export function buildVerificationEmailTemplate({
    locale,
    link,
}: EmailTemplateParams) {
    const t = (key: string) =>
        getEmailTranslation(locale, `email.verify-email.${key}`)

    const subject = t('subject')

    const text = `
${t('welcome')}

${t('description')}

${link}

${t('expires')}

${t('fallback')}
${link}
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
