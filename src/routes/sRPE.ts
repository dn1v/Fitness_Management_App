import { Router } from "express";
import { AppRouter } from "./appRouter";
import { SessionRPEController } from "../controllers/sessionRPE";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../authentication/authentication";

export class SessionRPERouter extends AppRouter {
    controller: SessionRPEController
    constructor() {
        super()
        this.controller = new SessionRPEController()
    }

    registerRoutes(): Router {
        return super.registerRoutes().post(Endpoints.SESSIONRPE, Auth.authenticate, this.controller.createSessionRPE)
            .get(Endpoints.SESSIONRPE, Auth.authenticate, this.controller.readSessionRPEs)
            .get(Endpoints.SESSIONRPE_ID, Auth.authenticate, this.controller.readSessionRPE)
            .patch(Endpoints.SESSIONRPE_ID, Auth.authenticate, this.controller.updateSessionRPE)
            .delete(Endpoints.SESSIONRPE_ID, Auth.authenticate, this.controller.deleteSessionRPE)
    }
}