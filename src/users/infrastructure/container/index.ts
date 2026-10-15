
import dataSource from "@/common/infrastructure/typeorm/index.ts"
import { container } from "tsyringe"
import { User } from "../typeorm/entities/users.entity.ts"
import { UsersTypeormRepository } from "../typeorm/repositories/users-typeorm.repository.ts"
import { CreateUserUseCase } from "@/users/application/usecases/create-user.usecase.ts"
import { SearchUserUseCase } from "@/users/application/usecases/search-user.usecase.ts"
import { AuthenticateUserUseCase } from "@/users/application/usecases/authenticate-user.usecase.ts"
import { UpdateAvatarUseCase } from "@/users/application/usecases/update-avatar-user.usecase.ts"
import { UserTokens } from "../typeorm/entities/user-tokens.entity.ts"
import { UserTokensTypeormRepository } from "../typeorm/repositories/user-token-typeorm.repository.ts"
import { SendEmailToResetPasswordUseCase } from "@/users/application/usecases/send-to-email-to-reset-password.usecase.ts"
import { ResetPasswordUseCase } from "@/users/application/usecases/reset-password.usecase.ts"
import { GetUserUseCase } from "@/users/application/usecases/get-user.usecase.ts"
import { UpdateUserUseCase } from "@/users/application/usecases/update-user.usecase.ts"


container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance('UsersDefaultRepository', dataSource.getRepository(User))

container.registerSingleton('UserTokensRepository', UserTokensTypeormRepository)
container.registerInstance('UserTokenDefaultRepository', dataSource.getRepository(UserTokens))

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)

container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)

container.registerSingleton('AuthenticateUserUseCase', AuthenticateUserUseCase.UseCase)

container.registerSingleton('UpdateAvatarUseCase', UpdateAvatarUseCase.UseCase)

container.registerSingleton('SendEmailToResetPasswordUseCase', SendEmailToResetPasswordUseCase.UseCase)

container.registerSingleton('ResetPasswordUseCase', ResetPasswordUseCase.UseCase)

container.registerSingleton('GetUserUseCase', GetUserUseCase.UseCase)

container.registerSingleton('UpdateUserUseCase', UpdateUserUseCase.UseCase)
