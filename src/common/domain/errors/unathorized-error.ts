
import AppError from "./app-errors"

export class UnathorizedError extends AppError {
    constructor(message: string) {
        super(message, 401)
        this.name = 'UnathorizedError'
    }
}
