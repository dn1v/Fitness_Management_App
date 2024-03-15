import { Router } from "express";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";
import { AppRouter } from "./appRouter";
import { Roles } from "../constants/roles";
import { UserController } from "../controllers/user";
import { Validation } from "../middlewares/validation";
import { UserSignupDto } from "../dto/user/signup.dto";
import { UserLoginDto } from "../dto/user/login.dto";

export class UserRouter extends AppRouter {
    controller: UserController
    constructor() {
        super()
        this.controller = new UserController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            // Athlete Management
            .post(Endpoints.USERS, Auth.signupCheck, Validation.validateDto(UserSignupDto), this.controller.signup)
            .post(Endpoints.USERS_LOGIN, Validation.validateDto(UserLoginDto), this.controller.login)
            .post(Endpoints.USERS_LOGOUT, Auth.authenticate, this.controller.logout)
            .post(Endpoints.USERS_LOGOUTALL, Auth.authenticate, this.controller.logoutAll)
            .get(Endpoints.USERS_ME, Auth.authenticate, this.controller.read)
            .patch(Endpoints.USERS_ME, Auth.authenticate, this.controller.update)
            .delete(Endpoints.USERS_ME, Auth.authenticate, this.controller.delete)

            // Athlete Connections
            .post(Endpoints.USERS_ME_CONNECTIONS, Auth.authenticate, this.controller.connectionRequest)
            .post(Endpoints.USERS_ME_CONNECTIONS_DECLINE_ID, Auth.authenticate, this.controller.declineConnectionRequest)
            .post(Endpoints.USERS_ME_CONNECTIONS_REMOVE_ID, Auth.authenticate, this.controller.removeUserConnection)
            .post(Endpoints.USERS_ME_CONNECTIONS_ACCEPT_ID, Auth.authenticate, this.controller.acceptConnectionRequest)
            .get(Endpoints.USERS_ME_CONNECTIONS_SENT, Auth.authenticate, this.controller.getSentRequests)
            .get(Endpoints.USERS_ME_CONNECTIONS_RECEIVED, Auth.authenticate, this.controller.getReceivedRequests)

            // Athlete Profile Picture Management
            .post(Endpoints.USERS_ME_PROFILEPIC, Auth.authenticate, this.controller.uploadPhoto)
            .delete(Endpoints.USERS_ME_PROFILEPIC, Auth.authenticate, this.controller.deletePhoto)
            .get(Endpoints.USERS_ID_PROFILEPIC, Auth.authenticate, this.controller.getPhoto);
    }
}
