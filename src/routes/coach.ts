import { Router } from "express";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";
import { AppRouter } from "./appRouter";
import { CoachController } from "../controllers/coach";
import { Roles } from "../constants/roles";


export class CoachRouter extends AppRouter {

    controller: CoachController

    constructor() {
        super()
        this.controller = new CoachController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            // Coach Management
            .post(Endpoints.COACHES, Auth.signupCheck.bind(Roles.COACH), this.controller.createCoach)
            .post(Endpoints.COACHES_LOGIN, Auth.loginRoleCheck.bind(Roles.COACH), this.controller.loginCoach)
            .post(Endpoints.COACHES_LOGOUT, Auth.authenticate, this.controller.logoutCoach)
            .post(Endpoints.COACHES_LOGOUTALL, Auth.authenticate, this.controller.logoutAll)
            .get(Endpoints.COACHES_ME, Auth.authenticate, this.controller.readCoach)
            .patch(Endpoints.COACHES_ME, Auth.authenticate, this.controller.updateCoach)
            .delete(Endpoints.COACHES_ME, Auth.authenticate, this.controller.deleteCoach)

            // Profile Picture Management
            .post(Endpoints.COACHES_ME_PROFILEPIC, Auth.authenticate, this.controller.uploadPhoto)
            .get(Endpoints.COACHES_ID_PROFILEPIC, Auth.authenticate, this.controller.getPhoto)
            .delete(Endpoints.COACHES_ME_PROFILEPIC, Auth.authenticate, this.controller.deletePhoto)

            // Connections
            .post(Endpoints.COACHES_ME_CONNECTIONS, Auth.authenticate, this.controller.connectionRequest)
            .get(Endpoints.COACHES_ME_CONNECTIONS, Auth.authenticate, this.controller.getConnectionRequests)
            .post(Endpoints.COACHES_ME_CONNECTIONS_ACCEPT_ID, Auth.authenticate, this.controller.acceptConnectionRequest)
            .post(Endpoints.COACHES_ME_CONNECTIONS_REMOVE_ID, Auth.authenticate, this.controller.removeAthleteConnection)
            .post(Endpoints.COACHES_ME_CONNECTIONS_DECLINE_ID, Auth.authenticate, this.controller.declineConnectionRequest);
    }
}  