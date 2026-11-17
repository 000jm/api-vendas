import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UpdateUserBodySchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'

export async function updateUserController(req: Request, res: Response): Promise<Response> {

    const { name, email, old_password, password } = await usersDataValidation(UpdateUserBodySchema, req.body)

    const updateUserUseCase: UpdateUserUseCase.UseCase = container.resolve('UpdateUserUseCase')

    const user = await updateUserUseCase.execute({
        user_id: req.user.id,
        name,
        email,
        old_password,
        password
    })

    return res.status(200).json(instanceToInstance(user))

}
