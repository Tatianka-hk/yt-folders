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
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>${t('subject')}</title>
        </head>

        <body
            style="
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
                font-family: Arial, Helvetica, sans-serif;
                color: #222222;
            "
        >
            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                    width: 100%;
                    background-color: #f5f5f5;
                    padding: 40px 16px;
                "
            >
                <tr>
                    <td align="center">
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                                width: 100%;
                                max-width: 600px;
                                background-color: #ffffff;
                                border-radius: 12px;
                            "
                        >
                            <tr>
                                <td style="padding: 40px;">
                                    <h1
                                        style="
                                            margin: 0 0 24px;
                                            font-size: 26px;
                                            line-height: 1.3;
                                            color: #222222;
                                        "
                                    >
                                        ${t('title')}
                                    </h1>

                                    <p
                                        style="
                                            margin: 0 0 12px;
                                            font-size: 18px;
                                            line-height: 1.6;
                                            font-weight: 600;
                                        "
                                    >
                                        ${t('welcome')}
                                    </p>

                                    <p
                                        style="
                                            margin: 0 0 28px;
                                            font-size: 16px;
                                            line-height: 1.6;
                                            color: #555555;
                                        "
                                    >
                                        ${t('description')}
                                    </p>

                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="margin-bottom: 28px;"
                                    >
                                        <tr>
                                            <td
                                                style="
                                                    border-radius: 8px;
                                                    background-color: #33202a;
                                                "
                                            >
                                                <a
                                                    href="${link}"
                                                    target="_blank"
                                                    style="
                                                        display: inline-block;
                                                        padding: 14px 24px;
                                                        font-size: 16px;
                                                        font-weight: 600;
                                                        color: #ffffff;
                                                        text-decoration: none;
                                                    "
                                                >
                                                    ${t('button')}
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p
                                        style="
                                            margin: 0 0 24px;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #777777;
                                        "
                                    >
                                        ${t('expires')}
                                    </p>

                                    <p
                                        style="
                                            margin: 0 0 8px;
                                            font-size: 14px;
                                            line-height: 1.6;
                                            color: #777777;
                                        "
                                    >
                                        ${t('fallback')}
                                    </p>

                                    <a
                                        href="${link}"
                                        target="_blank"
                                        style="
                                            font-size: 13px;
                                            line-height: 1.6;
                                            color: #5f5566;
                                            word-break: break-all;
                                        "
                                    >
                                        ${link}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>
`

    return {
        subject,
        text,
        html,
    }
}
