
import AppError from "./app-errors.ts"

class BadRequestError extends AppError {

    constructor(message:string) {
        super(message, 400)
        this.name = 'BadRequestError'
    }
    
}

export default BadRequestError
