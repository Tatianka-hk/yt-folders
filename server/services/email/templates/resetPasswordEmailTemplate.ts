import { EmailTemplateParams, getEmailTranslation } from '~/server/utils/emails'

export function buildResetPasswordEmailTemplate({
    locale,
    link,
}: EmailTemplateParams) {
    const t = (key: string) =>
        getEmailTranslation(locale, `auth.reset_password.email.${key}`)

    const safeResetPasswordLink = escapeHtml(link)

    const subject = t('subject')

    const text = `
ytCarpets

${t('title')}

${t('welcome')}

${t('description')}

${t('button')}:
${link}

${t('expires')}

${t('fallback')}
${link}

${t('ignore')}
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
            </head>

            <body
                style="
                    margin: 0;
                    padding: 0;
                    background-color: #f6f4f5;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #33202a;
                "
            >
                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                        width: 100%;
                        background-color: #f6f4f5;
                    "
                >
                    <tr>
                        <td
                            align="center"
                            style="
                                padding: 48px 16px;
                            "
                        >
                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                style="
                                    width: 100%;
                                    max-width: 600px;
                                "
                            >
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding-bottom: 28px;
                                            font-family: Georgia, 'Times New Roman', serif;
                                            font-size: 34px;
                                            line-height: 1.2;
                                            color: #33202a;
                                        "
                                    >
                                        ytCarpets
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style="
                                            background-color: #ffffff;
                                            border: 1px solid #e7e1e4;
                                            border-radius: 24px;
                                            padding: 40px 36px;
                                            box-shadow: 0 8px 28px rgba(51, 32, 42, 0.06);
                                        "
                                    >
                                        <div
                                            style="
                                                width: 56px;
                                                height: 56px;
                                                margin: 0 auto 24px;
                                                border-radius: 50%;
                                                background-color: #f1ecef;
                                                text-align: center;
                                                line-height: 56px;
                                                font-size: 24px;
                                            "
                                        >
                                            🔐
                                        </div>

                                        <h1
                                            style="
                                                margin: 0 0 18px;
                                                text-align: center;
                                                font-size: 28px;
                                                line-height: 1.3;
                                                font-weight: 700;
                                                color: #33202a;
                                            "
                                        >
                                            ${escapeHtml(t('title'))}
                                        </h1>

                                        <p
                                            style="
                                                margin: 0 0 12px;
                                                text-align: center;
                                                font-size: 15px;
                                                line-height: 1.7;
                                                color: #5f5566;
                                            "
                                        >
                                            ${escapeHtml(t('welcome'))}
                                        </p>

                                        <p
                                            style="
                                                margin: 0 auto 30px;
                                                max-width: 460px;
                                                text-align: center;
                                                font-size: 15px;
                                                line-height: 1.7;
                                                color: #5f5566;
                                            "
                                        >
                                            ${escapeHtml(t('description'))}
                                        </p>

                                        <table
                                            role="presentation"
                                            cellspacing="0"
                                            cellpadding="0"
                                            border="0"
                                            align="center"
                                            style="margin: 0 auto 26px;"
                                        >
                                            <tr>
                                                <td
                                                    align="center"
                                                    bgcolor="#33202a"
                                                    style="
                                                        border-radius: 10px;
                                                    "
                                                >
                                                    <a
                                                        href="${safeResetPasswordLink}"
                                                        style="
                                                            display: inline-block;
                                                            padding: 14px 26px;
                                                            font-size: 15px;
                                                            font-weight: 600;
                                                            color: #ffffff;
                                                            text-decoration: none;
                                                            border-radius: 10px;
                                                        "
                                                    >
                                                        ${escapeHtml(t('button'))}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>

                                        <p
                                            style="
                                                margin: 0 0 28px;
                                                text-align: center;
                                                font-size: 13px;
                                                line-height: 1.6;
                                                color: #8c8289;
                                            "
                                        >
                                            ${escapeHtml(t('expires'))}
                                        </p>

                                        <div
                                            style="
                                                height: 1px;
                                                background-color: #ece7ea;
                                                margin: 0 0 24px;
                                            "
                                        ></div>

                                        <p
                                            style="
                                                margin: 0 0 10px;
                                                font-size: 13px;
                                                line-height: 1.6;
                                                color: #5f5566;
                                            "
                                        >
                                            ${escapeHtml(t('fallback'))}
                                        </p>

                                        <div
                                            style="
                                                background-color: #f8f6f7;
                                                border: 1px solid #ece7ea;
                                                border-radius: 10px;
                                                padding: 12px 14px;
                                            "
                                        >
                                            <a
                                                href="${safeResetPasswordLink}"
                                                style="
                                                    display: block;
                                                    font-size: 12px;
                                                    line-height: 1.6;
                                                    color: #33202a;
                                                    text-decoration: underline;
                                                    word-break: break-all;
                                                "
                                            >
                                                ${safeResetPasswordLink}
                                            </a>
                                        </div>

                                        <p
                                            style="
                                                margin: 24px 0 0;
                                                font-size: 12px;
                                                line-height: 1.6;
                                                color: #8c8289;
                                                text-align: center;
                                            "
                                        >
                                            ${escapeHtml(t('ignore'))}
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding-top: 22px;
                                            font-size: 12px;
                                            line-height: 1.6;
                                            color: #8c8289;
                                        "
                                    >
                                        © ${new Date().getFullYear()} ytCarpets
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
