export default class ApiError extends Error {
    constructor(status, data, message) {
        super(message);
        this.statusText = status ?? 'fail';
        this.data = data ?? null;
        this.message = message ?? 'Internal server error.';
        console.log('hey i was triggered');

        Error.captureStackTrace(this, this.constructor);
    }
}
