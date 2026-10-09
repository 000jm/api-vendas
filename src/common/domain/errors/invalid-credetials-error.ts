
import AppError from './app-errors.ts'

export class InvalidCredentialsError extends AppError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'InvalidCredentialsError'
  }
}
