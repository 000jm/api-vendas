
import { Request, Response } from "express"
import { container } from "tsyringe"
import { usersDataValidation } from "../validation/users.validation"
import { SearchUserUseCase } from "@/users/application/usecases/search-user.usecase"
import { searchUserSchema } from "../schema/users.schemas"

export async function searchUserController(req: Request, res: Response): Promise<Response> {

    const validData = await usersDataValidation(searchUserSchema, req.body)
    const { page, per_page, sort, sort_dir, filter } = validData

    const searchUserUseCase: SearchUserUseCase.UseCase = container.resolve('SearchUserUseCase')

    const input: SearchUserUseCase.Input = {
        page,
        per_page,
        sort,
        sort_dir,
        filter
    }

    const result = await searchUserUseCase.execute(input)
    
    return res.status(200).json(result.items)
}
