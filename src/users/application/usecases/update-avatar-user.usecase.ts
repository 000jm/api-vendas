import BadRequestError from '@/common/domain/errors/bad-request-error'
import type { UploaderProvider } from '@/common/domain/providers/uploader-provider'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { inject, injectable } from 'tsyringe'
import type { UserOutput } from '../dtos/user-output.dto'

export namespace UpdateAvatarUseCase {

    export type Input = {
        user_id: string
        filename: string
        filesize: number
        filetype: string
        body: Buffer
    }

    export type Output = UserOutput

    export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3

    export const ACCEPTED_IMAGE_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ]

    @injectable()
    export class UseCase {

        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersRepository,
            @inject('UploaderProvider')
            private uploader: UploaderProvider
        ) {}

        async execute(input: Input): Promise<Output> {

            const { user_id, filename, filesize, filetype, body } = input

            if (!ACCEPTED_IMAGE_TYPES.includes(filetype)) {
                throw new BadRequestError('Formato de imagem inválido. Use JPEG, PNG ou WebP')
            }

            if (filesize > MAX_UPLOAD_SIZE) {
                throw new BadRequestError('A imagem deve ter no máximo 3 MB')
            }

            const user = await this.usersRepository.findById(user_id)
            const previousAvatar = user.avatar

            const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '-')
            const uniqueFilename = `${randomUUID()}-${safeFilename}`

            const uploadedFilename = await this.uploader.upload({
                filename: uniqueFilename,
                filetype,
                body
            })

            try {
                user.avatar = uploadedFilename

                const updatedUser = await this.usersRepository.update(user)

                if (previousAvatar && previousAvatar !== uploadedFilename) {
                    await this.uploader.delete(previousAvatar)
                }

                return updatedUser
            } catch (error) {
                await this.uploader.delete(uploadedFilename)
                throw error
            }

        }

    }

}
