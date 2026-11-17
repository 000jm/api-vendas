import { apiSendEmail } from '@/common/infrastructure/config/email/nodemailer.sendmail'
import { env } from '@/common/infrastructure/env'
import type { UserOutput } from '@/users/application/dtos/user-output.dto'
import path from 'node:path'

type SendEmailToResetPasswordProps = {
    user: UserOutput
    token: string
}

export async function sendEmailToResetPassword({ user, token }: SendEmailToResetPasswordProps): Promise<void> {

    const emailTemplate = path.resolve(__dirname, '..', '..', 'forgot-password.hbs')

    await apiSendEmail({
        to: {
            name: user.name,
            email: user.email
        },
        subject: 'Recuperação de senha',
        templateData: {
            file: emailTemplate,
            variables: {
                name: user.name,
                link: `${env.FRONTEND_URL}/reset-password?token=${token}`
            }
        }
    })

}
