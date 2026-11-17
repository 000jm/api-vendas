import AppError from './app-errors'

export class InvalidCredentialsError extends AppError {

    constructor(message = 'E-mail ou senha incorretos') {
        super(message, 401)
        this.name = 'InvalidCredentialsError'
    }

}
