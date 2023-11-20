import { HttpException } from "./httpExceptions";

export class BadRequestException<T extends {}> extends HttpException<T> {
    constructor(message: string, data: T = {} as T) {
        super(400, message, data);
    }
}