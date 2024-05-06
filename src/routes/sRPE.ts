import { Router } from "express";
import { AppRouter } from "./appRouter";
import { SessionRPEController } from "../controllers/sessionRPE";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";
import { Roles } from "../constants/roles";
import { Validation } from "../middlewares/validation";
import { CreateSRPEDto } from "../dto/srpe/createSessionRPE.dto";
import { UpdateSRPEDto } from "../dto/srpe/updateSessionRPE.dto";
import { Utils } from "../middlewares/utils";

export class SessionRPERouter extends AppRouter {
    controller: SessionRPEController
    constructor() {
        super()
        this.controller = new SessionRPEController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            // Session RPE Management (athlete)
            .post(Endpoints.SESSIONRPE, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), Validation.validateDto(CreateSRPEDto), this.controller.createSessionRPE)
            .get(Endpoints.SESSIONRPE, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), Utils.paginationAndSorting, Utils.queryFilter, this.controller.readSessionRPEs)
            .get(Endpoints.SESSIONRPE_ID, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), this.controller.readSessionRPE)
            .patch(Endpoints.SESSIONRPE_ID, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), Validation.validateDto(UpdateSRPEDto), this.controller.updateSessionRPE)
            .delete(Endpoints.SESSIONRPE_ID, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), this.controller.deleteSessionRPE)

            // Session RPE Management (coach)
            .get(Endpoints.SESSIONRPE_COACH_AID, Auth.authenticate, Auth.authorization.bind(Roles.COACH), this.controller.coachReadSessionRPEs)
            .get(Endpoints.SESSIONRPE_COACH_AID_SID, Auth.authenticate, Auth.authorization.bind(Roles.COACH), this.controller.coachReadSessionRPE)
    }
}

