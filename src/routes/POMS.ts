import { Router } from "express";
import { AppRouter } from "./appRouter";
import { POMSController } from "../controllers/POMS";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";
import { Roles } from "../constants/roles";
import { Validation } from "../middlewares/validation";
import { CreatePomsDto } from "../dto/poms/createPOMS.dto";
import { UpdatePomsDto } from "../dto/poms/udpatePOMS.dto";

export class POMSRouter extends AppRouter {
    controller: POMSController
    constructor() {
        super()
        this.controller = new POMSController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            // POMS management (athlete)
            .post(Endpoints.POMS, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), Validation.validateDto(CreatePomsDto), this.controller.createPOMS)
            .get(Endpoints.POMS, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), this.controller.readManyPOMS)
            .get(Endpoints.POMS_ID, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), this.controller.readPOMS)
            .patch(Endpoints.POMS_ID, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), Validation.validateDto(UpdatePomsDto), this.controller.updatePOMS)
            .delete(Endpoints.POMS_ID, Auth.authenticate, Auth.authorization.bind(Roles.ATHLETE), this.controller.deletePOMS)

            // POMS management (coach)
            .post(Endpoints.POMS_COACH_AID, Auth.authenticate, Auth.authorization.bind(Roles.COACH), this.controller.coachReadManyPOMS)
            .post(Endpoints.POMS_COACH_AID, Auth.authenticate, Auth.authorization.bind(Roles.COACH), this.controller.coachReadPOMS)
    }
}