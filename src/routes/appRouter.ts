import { Router } from "express";

export abstract class AppRouter {
    
    protected router: Router

    constructor() {
        this.router = Router()
    }

    registerRoutes(): Router {
        return this.router
    }
}