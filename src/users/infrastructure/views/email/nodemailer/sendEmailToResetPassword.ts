
import { apiSendEmail } from "@/common/infrastructure/config/email/nodemailer.sendmail"
import { UserOutput } from "@/users/application/dtos/user-output.dto"
import path from "node:path"

type sendEmailToResetPasswordProps = {
    user: UserOutput,
    token: string
}

export async function sendEmailToResetPassword({ user, token }: sendEmailToResetPasswordProps) {
    
    const emailTemplate = path.resolve(
        __dirname,
        '..',
        '..',
        'forgot-password.hbs'
    )

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
                link: `http://localhost:3000/reset_password?token=${token}`
            }
        }
    })

}
