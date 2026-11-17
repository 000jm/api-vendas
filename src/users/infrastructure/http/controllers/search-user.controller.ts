import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import { SearchUserUseCase } from '@/users/application/usecases/search-user.usecase'
import { SearchUserSchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'

export async function searchUserController(req: Request, res: Response): Promise<Response> {

    const source = { ...(req.query as Record<string, unknown>), ...req.body }
    const { page, per_page, sort, sort_dir, filter } = await usersDataValidation(SearchUserSchema, source)

    const searchUserUseCase: SearchUserUseCase.UseCase = container.resolve('SearchUserUseCase')

    const result = await searchUserUseCase.execute({
        page,
        per_page,
        sort,
        sort_dir,
        filter
    })

    return res.status(200).json({
        ...result,
        items: instanceToInstance(result.items),
    })

}
