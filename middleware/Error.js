export default class ApiError extends Error {
    constructor(status, data, message) {
        super(message);
        this.status = status ?? 500;
        this.data = data ?? null;
        this.message = message ?? 'Internal server error.';

        Error.captureStackTrace(this, this.constructor);
    }
}
