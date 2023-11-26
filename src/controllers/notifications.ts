import { Request, Response, NextFunction } from "express";
import { Notification } from "../models/notification";
import { HttpException } from "../exceptions/httpExceptions";
import { ErrorMessages } from "../constants/errorMessages";
import { NotFoundException } from "../exceptions/notFoundException";

export class NotificationController {

    constructor() {
        this.readNotifications = this.readNotifications.bind(this)
        this.deleteNotifications = this.deleteNotifications.bind(this)
        this.deleteNotification = this.deleteNotification.bind(this)
    }

    public async readNotifications(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (req.athlete) {
                let notifications = await this.findNotifications(req, 'athlete')
                return res.send({ notifications })
            }
            if (req.coach) {
                let notifications = await this.findNotifications(req, 'coach')
                return res.send({ notifications })
            }
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteNotifications(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (req.athlete) await this.delete(req, 'athlete')
            if (req.coach) await this.delete(req, 'coach')
            return res.send({ message: 'Notifications deleted' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let notification = await Notification.deleteOne({
                _id: req.params.id,
                recipientId: { $in: [req.athlete?._id ? req.athlete._id : req.coach._id] }
            })
            if (!notification.deletedCount) {
                return next(new NotFoundException(
                    ErrorMessages.NOTIFICATION_404,
                    { reason: 'Notification with the provided user or notification ID does not exist.' }
                ))
            }
            res.send({ message: 'Notification deleted.' })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    /**
     * Fetches notifications based on a specific field of the request object.
     * @param req - The Express request object.
     * @param field - The field name to extract data from the request object.
     * @returns A promise that resolves to notifications filtered by the recipient's ID in the specified field.
     */
    private async findNotifications(req: Request, field: keyof Request) {
        return await Notification.find({ recipientId: { $in: [req[field]._id] } })
    }

    private async delete(req: Request, field: keyof Request) {
        return await Notification.deleteMany({ recipientId: { $in: [req[field]._id] } })
    }
}