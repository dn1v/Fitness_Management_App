import { Router } from "express";
import { AppRouter } from "./appRouter";
import { POMSController } from "../controllers/POMS";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";

export class POMSRouter extends AppRouter {
    controller: POMSController
    constructor() {
        super()
        this.controller = new POMSController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            // POMS management (athlete)
            .post(Endpoints.POMS, Auth.authenticate, this.controller.createPOMS)
            .get(Endpoints.POMS, Auth.authenticate, this.controller.readManyPOMS)
            .get(Endpoints.POMS_ID, Auth.authenticate, this.controller.readPOMS)
            .patch(Endpoints.POMS_ID, Auth.authenticate, this.controller.updatePOMS)
            .delete(Endpoints.POMS_ID, Auth.authenticate, this.controller.deletePOMS)

            // POMS management (coach)
            .post(Endpoints.POMS_COACH_AID, Auth.authenticate, this.controller.coachReadManyPOMS)
            .post(Endpoints.POMS_COACH_AID, Auth.authenticate, this.controller.coachReadPOMS)
    }
}