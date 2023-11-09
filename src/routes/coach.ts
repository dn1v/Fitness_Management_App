import { Router } from "express";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../auth/auth";
import { AppRouter } from "./appRouter";
import { CoachController } from "../controllers/coach";


export class CoachRouter extends AppRouter {

    controller: CoachController

    constructor() {
        super()
        this.controller = new CoachController()
    }

    registerRoutes(): Router {
        return super.registerRoutes().post(Endpoints.COACHES, Auth.authorization.bind('coach'), this.controller.createCoach)
    }
}