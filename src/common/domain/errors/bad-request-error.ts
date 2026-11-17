import AppError from './app-errors'

class BadRequestError extends AppError {

    constructor(message: string, details?: unknown) {
        super(message, 400, details)
        this.name = 'BadRequestError'
    }

}

export default BadRequestError
