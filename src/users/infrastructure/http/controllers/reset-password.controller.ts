
import { Request, Response } from "express"
import { usersDataValidation } from "../validation/users.validation"
import { ResetPasswordSchema } from "../schema/users.schemas"
import { ResetPasswordUseCase } from "@/users/application/usecases/reset-password.usecase"
import { container } from "tsyringe"

export async function resetPasswordController(req: Request, res: Response): Promise<Response> {
    
    const data = await usersDataValidation(ResetPasswordSchema, req.body)
    const { token, password } = data

    const ResetPasswordUseCase: ResetPasswordUseCase.UseCase = container.resolve('ResetPasswordUseCase')

    await ResetPasswordUseCase.execute({ token, password })

    return res.status(204).json({ message: 'Password has been changed' })

}