
import { UnathorizedError } from "@/common/domain/errors/unathorized-error"
import { Request, Response } from "express"
import { usersDataValidation } from "../validation/users.validation"
import { UpdateUserBodySchema } from "../schema/users.schemas"
import { UpdateUserUseCase } from "@/users/application/usecases/update-user.usecase"
import { container } from "tsyringe"
import { instanceToInstance } from "class-transformer"

export async function updateUserController(req: Request, res: Response): Promise<Response> {

    if(!req.user) {
        throw new UnathorizedError('Unathorized')
    }

    const id = req.user.id

    const data = await usersDataValidation(UpdateUserBodySchema, req.body)

    const { name, email, old_password, password } = data as { name: string, email: string, old_password: string, password: string }

    const input: UpdateUserUseCase.Input = {
        user_id: id,
        name,
        email,
        old_password,
        password
    }

    const updateUserUseCase: UpdateUserUseCase.UseCase = container.resolve('UpdateUserUseCase')

    const user = await updateUserUseCase.execute(input)

    return res.status(200).json(instanceToInstance(user))

}
