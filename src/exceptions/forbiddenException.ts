import { HttpException } from "./httpExceptions";

export class ForbiddenException<T extends {}> extends HttpException<T> {
    constructor(message: string, data: T = {} as T) {
        super(403, message, data);
    }
}