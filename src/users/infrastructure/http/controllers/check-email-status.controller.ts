import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CheckEmailStatusUseCase } from '@/users/application/usecases/check-email-status.usecase'
import { usersDataValidation } from '../validation/users.validation'
import { EmailStatusSchema } from '../schema/users.schemas'

export async function checkEmailStatusController(
  req: Request,
  res: Response,
): Promise<Response> {
  const { email } = await usersDataValidation(EmailStatusSchema, req.body)
  const useCase: CheckEmailStatusUseCase.UseCase = container.resolve(
    'CheckEmailStatusUseCase',
  )
  const result = await useCase.execute({ email })
  return res.status(200).json(result)
}
