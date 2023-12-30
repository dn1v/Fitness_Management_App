import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/badRequestException';
import { ErrorMessages } from '../constants/errorMessages';

export class Validation {

    static validateDto(type: any, skipMissingProperties = false): RequestHandler {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.body) {
                return next(new BadRequestException(ErrorMessages.BAD_REQUEST))
            }
            validate(plainToInstance(type, req.body), {
                skipMissingProperties,
                forbidUnknownValues: true
            }).then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
                    next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Invalid inputs.'}))
                }
                next()
            })
        }
    }
}