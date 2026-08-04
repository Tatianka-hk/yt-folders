import nodemailer from 'nodemailer'

type SendVerificationEmailParams = {
    email: string
    verificationToken: string
    event: Parameters<typeof useRuntimeConfig>[0]
}

export async function sendVerificationEmail({
    email,
    verificationToken,
    event,
}: SendVerificationEmailParams) {
    const config = useRuntimeConfig(event)

    if (!config.smtpUser || !config.smtpPassword || !config.emailFrom) {
        throw new Error('SMTP configuration is missing')
    }

    const verificationUrl = new URL(
        '/verify-email',
        config.public.appUrl as string
    )

    verificationUrl.searchParams.set('token', verificationToken)

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort),
        secure: Number(config.smtpPort) === 465,
        auth: {
            user: config.smtpUser,
            pass: config.smtpPassword,
        },
    })

    console.log('host', config.smtpHost)
    console.log('port', config.smtpPort)
    console.log('secure', Number(config.smtpPort) === 465)
    console.log('user', config.smtpUser)
    console.log('pass', config.smtpPassword)

    const emailResponse = await transporter.sendMail({
        from: config.emailFrom,
        to: email,
        subject: 'Verify your email',
        text: `
Welcome!

Please verify your email by opening this link:

${verificationUrl.toString()}

This link expires in 24 hours.
        `.trim(),
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Verify your email</h2>

                <p>
                    Thank you for creating an account.
                    Please confirm your email address.
                </p>

                <p>
                    <a
                        href="${verificationUrl.toString()}"
                        style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #2563eb;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 6px;
                        "
                    >
                        Verify email
                    </a>
                </p>

                <p>
                    This link expires in 24 hours.
                </p>

                <p>
                    If the button does not work, copy this link:
                </p>

                <p>${verificationUrl.toString()}</p>
            </div>
        `,
    })
    console.log('emailResponse', emailResponse)
}
