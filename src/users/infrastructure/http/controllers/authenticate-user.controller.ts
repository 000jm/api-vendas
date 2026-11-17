import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import type { AuthProvider } from '@/common/domain/providers/auth-provider'
import { AuthenticateUserUseCase } from '@/users/application/usecases/authenticate-user.usecase'
import { AuthenticateUserSchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'

export async function authenticateUserController(req: Request, res: Response): Promise<Response> {

    const { email, password } = await usersDataValidation(AuthenticateUserSchema, req.body)

    const authenticateUserUseCase: AuthenticateUserUseCase.UseCase = container.resolve('AuthenticateUserUseCase')
    const user = await authenticateUserUseCase.execute({ email, password })

    const authProvider: AuthProvider = container.resolve('JwtAuthProvider')
    const { access_token } = authProvider.generateAuthKey(user.id)

    return res.status(200).json({ access_token: acess_token })
    
}
