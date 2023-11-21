import { HttpException } from "./httpExceptions";

export class NotFoundException<T extends {}> extends HttpException<T> {
    constructor(message: string, data: T = {} as T) {
        super(404, message, data)
    }
}