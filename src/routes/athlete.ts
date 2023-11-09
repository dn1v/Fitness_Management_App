import { AthleteController } from "../controllers/athlete";
import { Router } from "express";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../auth/auth";
import { AppRouter } from "./appRouter";

export class AthleteRouter extends AppRouter {
    controller: AthleteController
    constructor() {
        super()
        this.controller = new AthleteController()
    }

    registerRoutes(): Router {
        return super.registerRoutes().post(Endpoints.ATHLETES, Auth.authorization.bind('athlete'), this.controller.createAthlete)
            .post(Endpoints.ATHLETES_LOGIN, this.controller.loginAthlete)
            .post(Endpoints.ATHLETES_LOGOUT, Auth.authenticate, this.controller.logoutAthlete)
            .post(Endpoints.ATHLETES_LOGOUTALL, Auth.authenticate, this.controller.logoutAll)
            .get(Endpoints.ATHLETES_ME, Auth.authenticate, this.controller.readAthlete)
            .patch(Endpoints.ATHLETES_ME, Auth.authenticate, this.controller.updateAthlete)
            .delete(Endpoints.ATHLETES_ME, Auth.authenticate, this.controller.deleteAthlete)
            .post(Endpoints.ATHLETES_ME_PROFILEPIC, Auth.authenticate, this.controller.uploadPhoto)
            .delete(Endpoints.ATHLETES_ME_PROFILEPIC, Auth.authenticate, this.controller.deletePhoto)
            .get(Endpoints.ATHLETES_ID_PROFILEPIC, Auth.authenticate, this.controller.getPhoto)
    }
}

