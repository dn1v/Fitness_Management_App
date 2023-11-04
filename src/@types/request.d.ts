import { Express, Request } from "express";

declare global {
    namespace Express {
        interface Request {
            athlete?: any;
            token?: string;
            file?: any;
            match?: any;
            options?: any;
        }
    }
}