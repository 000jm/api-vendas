import type { SearchInput, SearchOutput } from '@/common/domain/repository/repository.interface'
import BadRequestError from '@/common/domain/errors/bad-request-error'
import NotFoundError from '@/common/domain/errors/not-found-error'
import type { UserTokensModel } from '@/users/domain/models/user-tokens.model'
import type { CreateUserTokensProps, UserTokensRepository } from '@/users/domain/repositories/user-tokens.repository'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import type { Repository } from 'typeorm'
import { UserTokens } from '../entities/user-tokens.entity'

@injectable()
export class UserTokensTypeormRepository implements UserTokensRepository {

    sortableFields = ['created_at', 'updated_at']

    constructor(
        @inject('UserTokenDefaultRepository')
        private userTokenRepository: Repository<UserTokens>,
        @inject('UsersRepository')
        private usersRepository: UsersRepository
    ) {}

    create(props: CreateUserTokensProps): UserTokensModel {
        return this.userTokenRepository.create(props)
    }

    async insert(model: UserTokensModel): Promise<UserTokensModel> {
        return this.userTokenRepository.save(model)
    }

    async findById(id: string): Promise<UserTokensModel> {
        return this._get(id)
    }

    async update(model: UserTokensModel): Promise<UserTokensModel> {
        await this._get(model.id)

        await this.userTokenRepository.update({ id: model.id }, {
            token: model.token,
            updated_at: new Date()
        })

        return this._get(model.id)
    }

    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.userTokenRepository.delete({ id })
    }

    async search(props: SearchInput): Promise<SearchOutput<UserTokensModel>> {
        const page = props.page ?? 1
        const perPage = props.per_page ?? 15
        const sort = props.sort && this.sortableFields.includes(props.sort) ? props.sort : 'created_at'
        const sortDir = props.sort_dir === 'asc' || props.sort_dir === 'desc' ? props.sort_dir : 'desc'

        if (props.sort_dir && props.sort_dir !== 'asc' && props.sort_dir !== 'desc') {
            throw new BadRequestError('Direção de ordenação inválida. Use "asc" ou "desc"')
        }

        const [userTokens, total] = await this.userTokenRepository.findAndCount({
            order: { [sort]: sortDir },
            skip: (page - 1) * perPage,
            take: perPage,
        })

        return {
            items: userTokens,
            per_page: perPage,
            total,
            current_page: page,
            sort,
            sort_dir: sortDir,
            filter: null
        }
    }

    async generateToken(props: CreateUserTokensProps): Promise<UserTokensModel> {
        const user = await this.usersRepository.findById(props.user_id)

        await this.deleteByUserId(user.id)

        const userToken = this.userTokenRepository.create({ user_id: user.id })

        return this.userTokenRepository.save(userToken)
    }

    async findByToken(token: string): Promise<UserTokensModel> {
        const userToken = await this.userTokenRepository.findOneBy({ token })

        if (!userToken) {
            throw new NotFoundError('Token de redefinição inválido')
        }

        return userToken
    }

    async deleteByUserId(user_id: string): Promise<void> {
        await this.userTokenRepository.delete({ user_id })
    }

    private async _get(id: string): Promise<UserTokensModel> {
        const userToken = await this.userTokenRepository.findOneBy({ id })

        if (!userToken) {
            throw new NotFoundError('Token de redefinição não encontrado')
        }

        return userToken
    }

}
