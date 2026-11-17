import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import { UpdateAvatarUseCase } from '@/users/application/usecases/update-avatar-user.usecase'
import { UpdateUserAvatarFileSchema } from '../schema/users.schemas'
import { usersDataValidation } from '../validation/users.validation'

export async function updateAvatarController(req: Request, res: Response): Promise<Response> {

    const { buffer, originalname, size, mimetype } = await usersDataValidation(UpdateUserAvatarFileSchema, req.file)

    const updateUserAvatar: UpdateAvatarUseCase.UseCase = container.resolve('UpdateAvatarUseCase')

    const user = await updateUserAvatar.execute({
        user_id: req.user.id,
        filename: originalname,
        filesize: size,
        filetype: mimetype,
        body: buffer
    })

    return res.status(200).json(instanceToInstance(user))

}
