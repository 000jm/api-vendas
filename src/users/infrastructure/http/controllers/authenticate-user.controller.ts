
import { Request, Response } from "express"
import { usersDataValidation } from "../validation/users.validation"
import { AuthenticateUserSchema } from "../schema/users.schemas"
import { AuthenticateUserUseCase } from "@/users/application/usecases/authenticate-user.usecase"
import { container } from "tsyringe"
import { AuthProvider } from "@/common/domain/providers/auth-provider"

export async function authenticateUserController(req: Request, res: Response): Promise<Response> {

    const data = await usersDataValidation(AuthenticateUserSchema, req.body)
    const { email, password } = data

    const authenticateUserUseCase: AuthenticateUserUseCase.UseCase = container.resolve('AuthenticateUserUseCase')

    const user = await authenticateUserUseCase.execute({
        email,
        password
    })

    const authProvider: AuthProvider = container.resolve('JwtAuthProvider')

    const { acess_token } = authProvider.generateAuthKey(user.id)

    return res.status(200).json({ acess_token })
    
}
