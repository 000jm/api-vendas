import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import AppError from '@/common/domain/errors/app-errors'
import { SendEmailToResetPasswordUseCase } from '@/users/application/usecases/send-to-email-to-reset-password.usecase'
import { SendEmailToResetPasswordSchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'
import { sendEmailToResetPassword } from '../../views/email/nodemailer/sendEmailToResetPassword'

export async function sendEmailToResetPasswordController(req: Request, res: Response): Promise<Response> {

    const { email } = await usersDataValidation(SendEmailToResetPasswordSchema, req.body)

    const sendEmailToResetPasswordUseCase: SendEmailToResetPasswordUseCase.UseCase = container.resolve('SendEmailToResetPasswordUseCase')

    const { user, token } = await sendEmailToResetPasswordUseCase.execute({ email })

    try {
        await sendEmailToResetPassword({ user, token })
    } catch {
        throw new AppError('Não foi possível enviar o e-mail. Tente novamente mais tarde.', 503)
    }

    return res.status(204).send()

}
