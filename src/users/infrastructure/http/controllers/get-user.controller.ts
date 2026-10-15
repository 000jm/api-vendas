
import { UnathorizedError } from "@/common/domain/errors/unathorized-error"
import { GetUserUseCase } from "@/users/application/usecases/get-user.usecase"
import { instanceToInstance } from "class-transformer"
import { Request, Response } from "express"
import { container } from "tsyringe"

export async function getUserController(req: Request, res: Response): Promise<Response> {

    if(!req.user) {
        throw new UnathorizedError('Unathorized')
    }

    const id = req.user.id

    const getUserUseCase: GetUserUseCase.UseCase = container.resolve('GetUserUseCase')

    const user = await getUserUseCase.execute({ id })

    return res.status(200).json(instanceToInstance(user))

}
