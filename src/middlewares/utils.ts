import { NextFunction, Request, Response } from "express";

export class Utils {

    static queryFilter(req: Request, res: Response, next: NextFunction): void {
        const match: { [key: string]: any } = {};
        const rangeOperator = req.query.rangeOperator;

        if (req.query.dateFrom) {
            match['createdAt'] = { '$gte': new Date(req.query.dateFrom as string) };
        }

        if (req.query.dateTo) {
            match['createdAt'] = { ...match['createdAt'], '$lte': new Date(req.query.dateTo as string) };
        }

        if (['lte', 'gte'].includes(rangeOperator as string)) {
            Object.keys(req.query).map(key => match[key] = { ['$' + rangeOperator]: req.query[key] });
        }

        if (!rangeOperator) {
            Object.keys(req.query).map(key => match[key] = req.query[key]);
        }

        req.match = match;
        next();
    }

    static paginationAndSorting(req: Request, res: Response, next: NextFunction): void {

        const limit: number = parseInt(req.query.limit as string);
        // const limit: string = req.query.limit as string;
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