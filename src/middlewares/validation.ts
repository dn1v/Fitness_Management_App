import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/badRequestException';
import { ErrorMessages } from '../constants/errorMessages';
import { AbstractDto, DTO } from '../dto/DTO.dto';

export class Validation {
    static validateDto<T extends AbstractDto>(
        DTOType: new (userData: T) => T,
        skipMissingProperties = false
    ): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.body) {
                    return next(new BadRequestException(ErrorMessages.BAD_REQUEST));
                }
                
                const dto = new DTOType(req.body);
                
                if (!dto.fieldsCheck(Object.keys(req.body))) {
                    return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Forbidden fields.' }));
                }

                const errors = await validate(dto, {
                    skipMissingProperties,
                    forbidUnknownValues: true,
                });

                if (errors.length > 0) {
                    const reason = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
                    return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason }));
                }
                next();
            } catch (error) {
                console.error(error);
                next(error);
            }
        };
    }
}

// export class Validation {

//     static validateDto(DTO: DTO, skipMissingProperties = false): RequestHandler {
//         return async (req: Request, res: Response, next: NextFunction) => {
//             try {

//                 if (!req.body) {
//                     return next(new BadRequestException(ErrorMessages.BAD_REQUEST))
//                 }
//                 const dto = new DTO(req.body)
//                 if (!dto.fieldsCheck(Object.keys(req.body))) {
//                     return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Forbidden fields.' }))
//                 }
//                 // I had a problem with plainToInstance
//                 const errors = await validate(dto, {
//                     skipMissingProperties,
//                     forbidUnknownValues: true,
//                 });

//                 if (errors.length > 0) {
//                     const reason = errors.map((error: ValidationError) => Object.values(error.constraints || '')).join(', ');
//                     return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason }))
//                 }
//                 next();
//             } catch (error) {
//                 console.error(error)
//                 next(error);
//             }
//         }
//     }
// }