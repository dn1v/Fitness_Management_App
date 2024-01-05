import { AppRouter } from "./appRouter";
import { Auth } from "../middlewares/auth";
import { Endpoints } from "../constants/endpoints";
import { Router } from "express";
import { GroupController } from "../controllers/group";
import { Validation } from "../middlewares/validation";
import { CreateGroupDto } from "../dto/group/createGroup.dto";
import { Roles } from "../constants/roles";


export class GroupRouter extends AppRouter {

    controller: GroupController

    constructor() {
        super()
        this.controller = new GroupController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            .post(
                Endpoints.GROUPS,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                Validation.validateDto(CreateGroupDto),
                this.controller.createGroup
            )
            .get(
                Endpoints.GROUPS,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.readGroups
            )
            .get(
                Endpoints.GROUPS_ID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.readGroup
            )
            .patch(
                Endpoints.GROUPS_ID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.updateGroup
            )
            .delete(
                Endpoints.GROUPS_ID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.deleteGroup
            )
            .post(
                Endpoints.GROUPS_ID_MEMBERS_MODID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.addModerator
            )
            .delete(
                Endpoints.GROUPS_ID_MEMBERS_MODID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.removeModerator
            )
            .post(
                Endpoints.GROUPS_ID_MEMBERS_MEMBERID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.addMember
            )
            .delete(
                Endpoints.GROUPS_ID_MEMBERS_MEMBERID,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                this.controller.removeMember
            )
    }
}