import BadRequestError from '@/common/domain/errors/bad-request-error'
import type { HashProvider } from '@/common/domain/providers/hash-provider'
import type { UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'
import { addHours, isAfter } from 'date-fns'
import { inject, injectable } from 'tsyringe'

export namespace ResetPasswordUseCase {

    export type Input = {
        token: string
        password: string
    }

    export type Output = void

    @injectable()
    export class UseCase {

        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersRepository,
            @inject('UserTokensRepository')
            private userTokensRepository: UserTokensRepository,
            @inject('HashProvider')
            private hashProvider: HashProvider
        ) {}

        async execute(input: Input): Promise<Output> {

            if (!input.token || !input.password) {
                throw new BadRequestError('Token e nova senha são obrigatórios')
            }

            const userToken = await this.userTokensRepository.findByToken(input.token)

            const expiresAt = addHours(userToken.created_at, 2)

            if (isAfter(Date.now(), expiresAt)) {
                throw new BadRequestError('Token de redefinição expirado')
            }

            const user = await this.usersRepository.findById(userToken.user_id)

            user.password = await this.hashProvider.generateHash(input.password)

            await this.usersRepository.update(user)

            await this.userTokensRepository.deleteByUserId(user.id)

        }

    }

}
