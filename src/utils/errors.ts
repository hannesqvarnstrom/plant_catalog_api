export class AppError extends Error {
    status: string
    isOperational: boolean

    constructor(public message: string, public statusCode = 500) {
        super(message)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}
