import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/badRequestException';
import { ErrorMessages } from '../constants/errorMessages';
import { UserSignupDto } from '../dto/user/signup.dto';

export class Validation {

    static validateDto(type: any, skipMissingProperties = false): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {

                if (!req.body) {
                    return next(new BadRequestException(ErrorMessages.BAD_REQUEST))
                }
                // I had a problem with plainToInstance
                const errors = await validate(new type(req.body), {
                    skipMissingProperties: false,
                    forbidUnknownValues: true
                });

                if (errors.length > 0) {
                    const reason = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
                    return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason }))
                }
                next();
            } catch (error) {
                console.error(error)
                next(error);
            }
        }
    }
}