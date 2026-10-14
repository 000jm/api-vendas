
import { Request, Response } from "express"
import { usersDataValidation } from "../validation/users.validation"
import { SendEmailToResetPasswordSchema } from "../schema/users.schemas"
import { SendEmailToResetPasswordUseCase } from "@/users/application/usecases/send-to-email-to-reset-password.usecase"
import { container } from "tsyringe"
import { sendEmailToResetPassword } from "../../views/email/nodemailer/sendEmailToResetPassword"

export async function sendEmailToResetPasswordController(req: Request, res: Response): Promise<Response> {

    const data = await usersDataValidation(SendEmailToResetPasswordSchema, req.body)
    const { email } = data

    const sendEmailToResetPasswordUseCase: SendEmailToResetPasswordUseCase.UseCase = container.resolve('SendEmailToResetPasswordUseCase')

    const { user, token } = await sendEmailToResetPasswordUseCase.execute({ email })

    await sendEmailToResetPassword({ user, token })
    // console.log('user: ', user)
    // console.log('token: ', token)

    return res.status(204).json({ message: 'New token was sent to your email' })

}
