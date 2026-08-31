export class HttpError extends Error {
    public statusCode: number;
    public errors?: Record<string, string[]>;

    constructor(message: string, statusCode: number = 500, errors?: Record<string, string[]>) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
