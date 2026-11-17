import type { RepositoryInterface } from '@/common/domain/repository/repository.interface'
import type { UserTokensModel } from '../models/user-tokens.model'

export type CreateUserTokensProps = {
    user_id: string
}

export interface UserTokensRepository extends RepositoryInterface<UserTokensModel, CreateUserTokensProps> {
    generateToken(props: CreateUserTokensProps): Promise<UserTokensModel>
    findByToken(token: string): Promise<UserTokensModel>
    deleteByUserId(user_id: string): Promise<void>
}
