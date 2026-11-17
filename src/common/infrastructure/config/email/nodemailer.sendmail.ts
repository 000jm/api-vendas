import { env } from '@/common/infrastructure/env'
import nodemailer, { type Transporter } from 'nodemailer'
import { HandlebarsEmailTemplate, type HandlebarsEmailTemplateProps } from './handlebars-email-template'

type MailContactProps = {
    name: string
    email: string
}

type SendEmailProps = {
    to: MailContactProps
    subject: string
    templateData: HandlebarsEmailTemplateProps
}

const mailTemplate = new HandlebarsEmailTemplate()

let transporter: Transporter | null = null

function getTransporter(): Transporter {

    if (transporter) return transporter

    if (!env.SMTP_HOST) {
        if (env.NODE_ENV === 'production') {
            throw new Error('SMTP não configurado')
        }

        transporter = nodemailer.createTransport({ jsonTransport: true })
        return transporter
    }

    transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: env.SMTP_USER && env.SMTP_PASS
            ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
            : undefined
    })

    return transporter

}

export async function apiSendEmail({ to, subject, templateData }: SendEmailProps): Promise<void> {

    const html = await mailTemplate.parse(templateData)

    const info = await getTransporter().sendMail({
        from: {
            name: env.MAIL_FROM_NAME,
            address: env.MAIL_FROM_EMAIL
        },
        to: {
            name: to.name,
            address: to.email
        },
        subject,
        html
    })

    if (!env.SMTP_HOST) {
        console.log(`[email] "${subject}" para ${to.email} não enviado (SMTP não configurado).`)
        console.log(info.message.toString())
    }

}
