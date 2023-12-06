import { AppRouter } from "./appRouter";
import { NotificationController } from "../controllers/notifications";
import { Auth } from "../middlewares/auth";
import { Endpoints } from "../constants/endpoints";
import { Router } from "express";


export class NotificationsRouter extends AppRouter {

    controller: NotificationController

    constructor() {
        super()
        this.controller = new NotificationController()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            .get(Endpoints.NOTIFICATIONS, Auth.authenticate, this.controller.readNotifications)
            .delete(Endpoints.NOTIFICATIONS, Auth.authenticate, this.controller.deleteNotifications)
            .delete(Endpoints.NOTIFICATIONS_ID, Auth.authenticate, this.controller.deleteNotification)
    }
}