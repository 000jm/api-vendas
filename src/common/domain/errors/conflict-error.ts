
import AppError from "./app-errors.ts"

class ConflictError extends AppError {
    constructor(message:string) {
        super(message, 409)
        this.name = 'ConflictError'
    }
}

export default ConflictError
