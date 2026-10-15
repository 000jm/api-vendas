
import { SearchInput, SearchOutput } from "@/common/domain/repository/repository.interface";
import { UserModel } from "@/users/domain/models/user.model";
import { CreateUserProps, UsersRepository } from "@/users/domain/repositories/users.repository"
import { inject, injectable } from "tsyringe";
import { ILike, Repository } from "typeorm"
import { User } from "../entities/users.entity.ts"
import NotFoundError from "@/common/domain/errors/not-found-error.ts";
import ConflictError from "@/common/domain/errors/conflict-error.ts";
import BadRequestError from "@/common/domain/errors/bad-request-error.ts";

@injectable()
export class UsersTypeormRepository implements UsersRepository {    
    constructor(
        @inject('UsersDefaultRepository')
        private usersRepository: Repository<User>
    ) {}

    sortableFields: string[] = ['updated_at', 'created_at']

    create(props: CreateUserProps): UserModel {
        return this.usersRepository.create(props)
    }

    async insert(model: UserModel): Promise<UserModel> {
        return this.usersRepository.save(model)
    }

    async findById(id: string): Promise<UserModel> {
        return await this._get(id)
    }

    async update(model: UserModel): Promise<UserModel> {
        await this.usersRepository.update(
            { id: model.id },
            {
                name: model.name,
                email: model.email,
                password: model.password,
                avatar: model.avatar,
            }
        )

        return model
    }

    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.usersRepository.delete({ id })
    }

    async search(props: SearchInput): Promise<SearchOutput<UserModel>> {
        const validSort = this.sortableFields.includes(props.sort) || false
        const dirOps = ['asc', 'desc']
        const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir)) || false

        const orderByField = validSort ? props.sort : 'created_at'
        const orderByDir = validSortDir ? props.sort_dir : 'desc'
 
        if(!props.page) props.page = 1
        if(!props.per_page) props.per_page = 10

        if(orderByDir && orderByDir !== 'desc' && orderByDir !== 'asc') throw new BadRequestError('Try a valid sort directory(asc or desc)')

        const [users, total] = await this.usersRepository.findAndCount({
            ...(props.filter && {
                where: {
                    name: ILike(`%${props.filter}%`)
                }
            }),
            order: { [orderByField]: orderByDir },
            skip: (props.page - 1) * props.per_page,
            take: props.per_page,
        })

        return {
            items: users,
            per_page: props.per_page,
            total,
            current_page: props.page,
            sort: orderByField,
            sort_dir: orderByDir,
            filter: props.filter
        }
    }

    async findByEmail(email: string): Promise<UserModel> {
        const user = await this.usersRepository.findOneBy({ email })
        if (!user) {
          throw new NotFoundError(`User not found using email ${email}`)
        }

        return user
    }

    async findByName(name: string): Promise<UserModel> {
        const user = await this.usersRepository.findOneBy({ name })
        if (!user) {
            throw new NotFoundError(`User not found using name ${name}`)
        }

        return user
    }

    async conflictingEmail(email: string): Promise<void> {
        const user = await this.usersRepository.findOneBy({ email })
        if (user) {
            throw new ConflictError('Email already used on another user')
        }
    }

    protected async _get(id: string): Promise<UserModel> {
        const user = await this.usersRepository.findOneBy({ id })
        if(!user) {
            throw new NotFoundError(`User not found with id: ${id}`)
        }

        return user
    }

}
