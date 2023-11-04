import { Router } from "express";
import { AppRouter } from "./appRouter";
import { POMSController } from "../controllers/POMS";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../authentication/authentication";

export class POMSRouter extends AppRouter {
    controller: POMSController
    constructor() {
        super()
        this.controller = new POMSController()
    }

    registerRoutes(): Router {
        return super.registerRoutes().post(Endpoints.POMS, Auth.authenticate, this.controller.createPOMS)
            .get(Endpoints.POMS, Auth.authenticate, this.controller.readManyPOMS)
            .get(Endpoints.POMS_ID, Auth.authenticate, this.controller.readPOMS)
            .patch(Endpoints.POMS_ID, Auth.authenticate, this.controller.updatePOMS)
            .delete(Endpoints.POMS_ID, Auth.authenticate, this.controller.deletePOMS)
    }
}