import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../exceptions/badRequestException';
import { ErrorMessages } from '../constants/errorMessages';
import { AbstractDto } from '../dto/DTO.dto';
import multer from 'multer';
import ExcelJS from 'exceljs'

export class Validation {
    static validateDto<T extends AbstractDto>(
        DTOType: new (userData: T) => T,
        skipMissingProperties = false
    ): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction) => {
            console.log('REQUEST:', req.body)
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

    static isExcelFile() {
        const storage = multer.memoryStorage();
        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    // Validate MIME type for Excel (.xlsx)
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Please upload an Excel file.'));
                }
            },
        });

        return upload; // Return the configured Multer middleware
    }
}
