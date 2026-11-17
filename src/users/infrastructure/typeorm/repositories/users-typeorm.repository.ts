import type { SearchInput, SearchOutput } from '@/common/domain/repository/repository.interface'
import BadRequestError from '@/common/domain/errors/bad-request-error'
import ConflictError from '@/common/domain/errors/conflict-error'
import NotFoundError from '@/common/domain/errors/not-found-error'
import type { UserModel } from '@/users/domain/models/user.model'
import type { CreateUserProps, UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import { ILike, type Repository } from 'typeorm'
import { User } from '../entities/users.entity'

@injectable()
export class UsersTypeormRepository implements UsersRepository {

    sortableFields = ['name', 'email', 'created_at', 'updated_at']

    constructor(
        @inject('UsersDefaultRepository')
        private usersRepository: Repository<User>
    ) {}

    create(props: CreateUserProps): UserModel {
        return this.usersRepository.create(props)
    }

    async insert(model: UserModel): Promise<UserModel> {
        return this.usersRepository.save(model)
    }

    async findById(id: string): Promise<UserModel> {
        return this._get(id)
    }

    async update(model: UserModel): Promise<UserModel> {
        await this._get(model.id)

        await this.usersRepository.update(
            { id: model.id },
            {
                name: model.name,
                email: model.email,
                password: model.password,
                avatar: model.avatar,
            }
        )

        return this._get(model.id)
    }

    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.usersRepository.delete({ id })
    }

    async search(props: SearchInput): Promise<SearchOutput<UserModel>> {
        const page = props.page ?? 1
        const perPage = props.per_page ?? 15
        const sort = props.sort && this.sortableFields.includes(props.sort) ? props.sort : 'created_at'
        const sortDir = props.sort_dir === 'asc' || props.sort_dir === 'desc' ? props.sort_dir : 'desc'

        if (props.sort_dir && props.sort_dir !== 'asc' && props.sort_dir !== 'desc') {
            throw new BadRequestError('Direção de ordenação inválida. Use "asc" ou "desc"')
        }

        const [users, total] = await this.usersRepository.findAndCount({
            ...(props.filter && {
                where: {
                    name: ILike(`%${props.filter}%`)
                }
            }),
            order: { [sort]: sortDir },
            skip: (page - 1) * perPage,
            take: perPage,
        })

        return {
            items: users,
            per_page: perPage,
            total,
            current_page: page,
            sort,
            sort_dir: sortDir,
            filter: props.filter ?? null
        }
    }

    async findByEmail(email: string): Promise<UserModel> {
        const user = await this.usersRepository.findOneBy({ email })

        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        return user
    }

    async emailExists(email: string): Promise<boolean> {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('LOWER(user.email) = :email', { email: email.toLowerCase() })
            .getExists()
    }

    async findByName(name: string): Promise<UserModel> {
        const user = await this.usersRepository.findOneBy({ name })

        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        return user
    }

    async conflictingEmail(email: string): Promise<void> {
        const user = await this.usersRepository.findOneBy({ email })

        if (user) {
            throw new ConflictError('E-mail já cadastrado')
        }
    }

    private async _get(id: string): Promise<UserModel> {
        const user = await this.usersRepository.findOneBy({ id })

        if (!user) {
            throw new NotFoundError('Usuário não encontrado')
        }

        return user
    }

}
