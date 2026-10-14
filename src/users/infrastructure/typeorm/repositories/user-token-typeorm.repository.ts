
import { SearchInput, SearchOutput } from "@/common/domain/repository/repository.interface"
import { UserTokensModel } from "@/users/domain/models/user-tokens.model"
import { CreateUserTokensProps, UserTokensRepository } from "@/users/domain/repositories/user-tokens.repository"
import { Repository } from "typeorm"
import { UserTokens } from "../entities/user-tokens.entity"
import { inject, injectable } from "tsyringe"
import type { UsersRepository } from "@/users/domain/repositories/users.repository"
import NotFoundError from "@/common/domain/errors/not-found-error"
import BadRequestError from "@/common/domain/errors/bad-request-error"

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

        const userToken = await this.findById(model.id)
        Object.assign(userToken, {
            ...(model.token !== undefined && {name: model.token}),
            updated_at: new Date()
        })

        await this.userTokenRepository.update({ id: model.id }, userToken)

        return userToken

    }

    async delete(id: string): Promise<void> {

        await this._get(id)
        await this.userTokenRepository.delete({ id: id })
        
    }

    async search(props: SearchInput): Promise<SearchOutput<UserTokensModel>> {
        const validSort = this.sortableFields.includes(props.sort) || false
        const dirOps = ['asc', 'desc']
        const validSortDir = (props.sort_dir && dirOps.includes(props.sort_dir)) || false

        const orderByField = validSort ? props.sort : 'created_at'
        const orderByDir = validSortDir ? props.sort_dir : 'desc'
 
        if(!props.page) props.page = 1
        if(!props.per_page) props.per_page = 10

        if(orderByDir && orderByDir !== 'desc' && orderByDir !== 'asc') throw new BadRequestError('Try a valid sort directory(asc or desc)')

        const [userTokens, total] = await this.userTokenRepository.findAndCount({
            order: { [orderByField]: orderByDir },
            skip: (props.page - 1) * props.per_page,
            take: props.per_page,
        })

        return {
            items: userTokens,
            per_page: props.per_page,
            total,
            current_page: props.page,
            sort: orderByField,
            sort_dir: orderByDir,
            filter: null
        }
    }

    async generateToken(props: CreateUserTokensProps): Promise<UserTokensModel> {
        
        const user = await this.usersRepository.findById(props.user_id)

        const userToken = this.userTokenRepository.create({
            user_id: user.id
        })

        await this.userTokenRepository.save(userToken)

        return userToken

    }

    async findByToken(token: string): Promise<UserTokensModel> {
        
        const userToken = this.userTokenRepository.findOneBy({ token })

        if(!userToken) throw new NotFoundError('User token not found')

        return userToken

    }

    protected async _get(id: string): Promise<UserTokensModel> {

        const userToken = await this.userTokenRepository.findOneBy({ id })

        if(!userToken) {
            throw new NotFoundError(`User not found with id: ${id}`)
        }

        return userToken

    }
    
}
