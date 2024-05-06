import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";

export class Utils {

    static queryFilter(req: Request, res: Response, next: NextFunction): void {
        const match: { [key: string]: any } = {};
        const fields = Object.keys(req.query)
        console.log(fields)
        if (req.query.dateFrom) {
            match['createdAt']['$gte'] = new Date(req.query.dateFrom as string);
        }
        if (req.query.dateTo) {
            match['createdAt']['$lte'] = new Date(req.query.dateTo as string);
        }
        fields.map(field => {
            const fieldArr = field.split('-')
            const operator = fieldArr[0]
            const key = fieldArr[1]
            // (field.includes('gte') || field.includes('lte')) 
            if (operator && fields.includes(field.slice(4))) {
                return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Range operator error.'}))
            }
            if (field.includes('gte') || field.includes('lte')) {
                if (!match[key]) {
                    match[key] = {}; // Initialize if undefined
                }
                match[key]['$' + operator] = req.query[field] 
                
            } else {
                match[field] = req.query[field]
            }
        })
        console.log(match)
        req.match = match;
        next();
    }

    static paginationAndSorting(req: Request, res: Response, next: NextFunction): void {
        const limit: number = parseInt(req.query.limit as string);
        const skip: number = parseInt(req.query.skip as string) * limit
        let sort: { [key: string]: string } = {};
        if (typeof req.query.sortBy === 'string') {
            (req.query.sortBy).split('&').map(keyValue => {
                const arr: string[] = keyValue.split(':');
                sort[arr[0]] = arr[1];
            });
        }
        req.options = { limit, skip, sort };
        next();
    };
}