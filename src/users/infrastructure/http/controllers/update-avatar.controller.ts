
import { Request, Response } from "express"
import { usersDataValidation } from "../validation/users.validation"
import { UpdateUserAvatarFileSchema, UpdateUserBodySchema } from "../schema/users.schemas"
import { UpdateAvatarUseCase } from "@/users/application/usecases/update-avatar-user.usecase"
import { container } from "tsyringe"
import { instanceToInstance } from "class-transformer"

export async function updateAvatarController(req: Request, res: Response): Promise<Response> {

    const { user_id } = await usersDataValidation(UpdateUserBodySchema, req.body)

    const { buffer, originalname, size, mimetype } = await usersDataValidation(UpdateUserAvatarFileSchema, req.file)

    const updateUserAvatar: UpdateAvatarUseCase.UseCase = container.resolve('UpdateAvatarUseCase')

    const user = await updateUserAvatar.execute({
        user_id: user_id,
        filename: originalname.split(' ').join('-'),
        filesize: size,
        filetype: mimetype,
        body: buffer
    })

    return res.status(200).json(instanceToInstance(user))

}
