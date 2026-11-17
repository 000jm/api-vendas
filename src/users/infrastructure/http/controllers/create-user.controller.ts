import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { CreateUserSchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'

export async function createUserController(req: Request, res: Response): Promise<Response> {

    const { name, password, email } = await usersDataValidation(CreateUserSchema, req.body)

    const createUserUseCase: CreateUserUseCase.UseCase = container.resolve('CreateUserUseCase')
    const user = await createUserUseCase.execute({ name, password, email })

    return res.status(201).json(instanceToInstance(user))

}
