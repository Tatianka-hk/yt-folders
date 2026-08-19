import { escapeHtml } from '../../../utils/emails'

export const templateSupport = ({
    email,
    message,
}: {
    email: string
    message: string
}) => {
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Новий запит</title>
            </head>

            <body
                style="
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                    font-family: Arial, sans-serif;
                    color: #222222;
                "
            >
                <div
                    style="
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        padding: 32px;
                    "
                >
                    <h1 style="margin: 0 0 24px; font-size: 24px;">
                       Новий запит<
                    </h1>

                    <p
                        style="
                            margin: 0 0 8px;
                            font-size: 14px;
                            color: #777777;
                        "
                    >
                       Пошта
                    </p>

                    <a
                        href="mailto:${safeEmail}"
                        style="color: #222222;"
                    >
                        ${safeEmail}
                    </a>

                    <p
                        style="
                            margin: 24px 0 8px;
                            font-size: 14px;
                            color: #777777;
                        "
                    >
                        Повідомлення
                    </p>

                    <div
                        style="
                            padding: 16px;
                            background-color: #f7f7f7;
                            border-radius: 8px;
                            line-height: 1.6;
                            white-space: pre-wrap;
                            word-break: break-word;
                        "
                    >${safeMessage}</div>
                </div>
            </body>
        </html>
    `
}
