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
        return super.registerRoutes()
            .post(
                Endpoints.COACHES,
                Auth.authorization.bind(process.env.COACH),
                this.controller.createCoach
            )
            .post(
                Endpoints.COACHES_LOGIN,
                Auth.loginRoleCheck.bind(process.env.COACH),
                this.controller.loginCoach
            )
            .post(
                Endpoints.COACHES_LOGOUT,
                Auth.authenticate,
                this.controller.logoutCoach
            )
            .post(
                Endpoints.COACHES_LOGOUTALL,
                Auth.authenticate,
                this.controller.logoutAll
            )
            .get(
                Endpoints.COACHES,
                Auth.authenticate,
                this.controller.readCoach
            )
            .patch(
                Endpoints.COACHES_ME,
                Auth.authenticate,
                this.controller.updateCoach
            )
            .delete(
                Endpoints.COACHES_ME,
                Auth.authenticate,
                this.controller.deleteCoach
            )
            .post(
                Endpoints.COACHES_ME_PROFILEPIC,
                Auth.authenticate,
                this.controller.uploadPhoto
            )
            .get(
                Endpoints.COACHES_ID_PROFILEPIC,
                Auth.authenticate,
                this.controller.getPhoto
            )
            .delete(
                Endpoints.COACHES_ME_PROFILEPIC,
                Auth.authenticate,
                this.controller.deletePhoto
            )
    }
}  