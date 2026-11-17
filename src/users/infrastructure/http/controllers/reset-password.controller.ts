import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import { ResetPasswordUseCase } from '@/users/application/usecases/reset-password.usecase'
import { ResetPasswordSchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'

export async function resetPasswordController(req: Request, res: Response): Promise<Response> {

    const { token, password } = await usersDataValidation(ResetPasswordSchema, req.body)

    const resetPasswordUseCase: ResetPasswordUseCase.UseCase = container.resolve('ResetPasswordUseCase')

    await resetPasswordUseCase.execute({ token, password })

    return res.status(204).send()

}
