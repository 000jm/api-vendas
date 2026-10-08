
import { Request, Response } from "express"
import { CreateUserSchema } from "../schema/users.schemas"
import { CreateUserUseCase } from "@/users/application/usecases/create-user.usecase"
import { container } from "tsyringe"
import { productDataValidation } from "@/common/infrastructure/validation/zod"

export async function createUserController(req: Request, res: Response): Promise<Response> {

    const data = await productDataValidation(CreateUserSchema, req.body)
    const { name, password, email } = data

    const createUserUseCase: CreateUserUseCase.UseCase = container.resolve('CreateUserUseCase')

    const input: CreateUserUseCase.Input = {
        name,
        password,
        email
    }

    const user = await createUserUseCase.execute(input)

    return res.status(201).json(user)

}
