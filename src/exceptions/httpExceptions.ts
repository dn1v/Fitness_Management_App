export class HttpException<T extends {}> extends Error {
    status: number;
    message: string;
    data: T;

    constructor(status: number, message: string, data: T = {} as T) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
