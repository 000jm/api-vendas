
import AppError from "./app-errors.ts"

class NotFoundError extends AppError {
    
    constructor(message:string) {
        super(message, 404)
        this.name = 'NotFoundError'
    }
    
}

export default NotFoundError
