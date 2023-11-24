import { AthleteController } from "../controllers/athlete";
import { Router } from "express";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../auth/auth";
import { AppRouter } from "./appRouter";
import { Roles } from "../constants/roles";

export class AthleteRouter extends AppRouter {
    controller: AthleteController
    constructor() {
        super()
        this.controller = new AthleteController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
          // Athlete Management
          .post(Endpoints.ATHLETES, Auth.signupCheck.bind(Roles.ATHLETE), this.controller.createAthlete)
          .post(Endpoints.ATHLETES_LOGIN, Auth.loginRoleCheck.bind(Roles.ATHLETE), this.controller.loginAthlete)
          .post(Endpoints.ATHLETES_LOGOUT, Auth.authenticate, this.controller.logoutAthlete)
          .post(Endpoints.ATHLETES_LOGOUTALL, Auth.authenticate, this.controller.logoutAll)
          .get(Endpoints.ATHLETES_ME, Auth.authenticate, this.controller.readAthlete)
          .patch(Endpoints.ATHLETES_ME, Auth.authenticate, this.controller.updateAthlete)
          .delete(Endpoints.ATHLETES_ME, Auth.authenticate, this.controller.deleteAthlete)
          
          // Athlete Connections
          .post(Endpoints.ATHLETES_ME_CONNECTIONS, Auth.authenticate, this.controller.connectionRequest)
          .post(Endpoints.ATHLETES_ME_CONNECTIONS_DECLINE_ID, Auth.authenticate, this.controller.declineConnectionRequest)
          .post(Endpoints.ATHLETES_ME_CONNECTIONS_REMOVE_ID, Auth.authenticate, this.controller.removeCoachConnection)
          .post(Endpoints.ATHLETES_ME_CONNECTIONS_ACCEPT_ID, Auth.authenticate, this.controller.acceptConnectionRequest)
          
          // Athlete Profile Picture Management
          .post(Endpoints.ATHLETES_ME_PROFILEPIC, Auth.authenticate, this.controller.uploadPhoto)
          .delete(Endpoints.ATHLETES_ME_PROFILEPIC, Auth.authenticate, this.controller.deletePhoto)
          .get(Endpoints.ATHLETES_ID_PROFILEPIC, Auth.authenticate, this.controller.getPhoto);
      }
}

