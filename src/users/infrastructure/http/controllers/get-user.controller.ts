import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'

export async function getUserController(req: Request, res: Response): Promise<Response> {

    const getUserUseCase: GetUserUseCase.UseCase = container.resolve('GetUserUseCase')
    const user = await getUserUseCase.execute({ id: req.user.id })

    return res.status(200).json(instanceToInstance(user))

}
