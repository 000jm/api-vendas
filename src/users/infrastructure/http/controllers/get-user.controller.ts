
import { Request, Response } from "express"
import { usersDataValidation } from "../validation/users.validation"
import { GetUserSchema } from "../schema/users.schemas"
import { GetUserUseCase } from "@/users/application/usecases/get-user.usecase"
import { container } from "tsyringe"

export async function getUserController(req: Request, res: Response): Promise<Response> {

    const data = await usersDataValidation(GetUserSchema, req.params)
    const id = data.id

    const getUserUseCase: GetUserUseCase.UseCase = container.resolve('GetUserUseCase')

    const input = { id }

    const user = await getUserUseCase.execute(input)
    
    return res.status(200).json(user)

}
