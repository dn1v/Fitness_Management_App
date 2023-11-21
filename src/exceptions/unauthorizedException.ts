import { HttpException } from "./httpExceptions";

export class UnauthorizedException<T extends {}> extends HttpException<T> {
    constructor(message: string, data: T = {} as T) {
        super(401, message, data)
    }
}