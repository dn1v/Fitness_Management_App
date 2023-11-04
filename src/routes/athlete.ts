import { AthleteController } from "../controllers/athlete";
import { Router } from "express";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../authentication/authentication";
import { AppRouter } from "./appRouter";

export class AthleteRouter extends AppRouter {
    controller: AthleteController
    constructor() {
        super()
        this.controller = new AthleteController()
    }

    registerRoutes(): Router {
        return super.registerRoutes().post(Endpoints.USERS, this.controller.createAthlete)
            .post(Endpoints.USERS_LOGIN, this.controller.loginAthlete)
            .post(Endpoints.USERS_LOGOUT, Auth.authenticate, this.controller.logoutAthlete)
            .post(Endpoints.USERS_LOGOUTALL, Auth.authenticate, this.controller.logoutAll)
            .get(Endpoints.USERS_ME, Auth.authenticate, this.controller.readAthlete)
            .patch(Endpoints.USERS_ME, Auth.authenticate, this.controller.updateAthlete)
            .delete(Endpoints.USERS_ME, Auth.authenticate, this.controller.deleteAthlete)
            .post(Endpoints.USERS_ME_PROFILEPIC, Auth.authenticate, this.controller.uploadPhoto)
            .delete(Endpoints.USERS_ME_PROFILEPIC, Auth.authenticate, this.controller.deletePhoto)
            .get(Endpoints.USERS_ID_PROFILEPIC, Auth.authenticate, this.controller.getPhoto)
    }
}

