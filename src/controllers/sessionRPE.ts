import { NextFunction, Request, Response } from "express";
import { SessionRPE } from "../models/sRPE";
import { Athlete } from "../models/athlete";
import { Notification } from "../models/notification";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";

export class SessionRPEController {

    private allowedUpdates: string[]
    private allowedCreateFields: string[]

    constructor() {
        this.allowedCreateFields = ['_id', 'trainingType', 'duration', 'sRPE']
        this.allowedUpdates = ['trainingType', 'duration', 'sRPE']
        this.createSessionRPE = this.createSessionRPE.bind(this)
        this.readSessionRPEs = this.readSessionRPEs.bind(this)
        this.readSessionRPE = this.readSessionRPE.bind(this)
        this.updateSessionRPE = this.updateSessionRPE.bind(this)
        this.deleteSessionRPE = this.deleteSessionRPE.bind(this)
    }

    public async createSessionRPE(req: Request, res: Response, next: NextFunction): Promise<void> {
        let fields = Object.keys(req.body)
        if (!this.fieldsCheck(fields, this.allowedCreateFields)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid fields in the request' }
            ))
        }
        const sRPE = this.instantiateSessionRPE(req)
        const notification = this.instantiateNotification(req, 'sRPE', 'created new sRPE')
        try {
            await sRPE.save()
            await notification.save()
            res.status(201).send(sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readSessionRPEs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await req.athlete.populate({
                path: 'sRPE',
                match: req.match,
                options: req.options
            })
            res.send(req.athlete.sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async coachReadSessionRPEs(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.params.aid) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'The request is missing essential identifier(s).' }
                ))
            }
            const athlete = await Athlete.findOne({ _id: req.params.aid })
            if (!athlete) return next(new NotFoundException(ErrorMessages.USER_404))
            if (!athlete.coaches.includes(req.coach._id)) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: "User is not on your coaching list." }
                ))
            }
            await athlete.populate({
                path: 'sRPE',
                match: req.match,
                options: req.options
            })
            res.send(athlete.sRPE)
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async coachReadSessionRPE(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.params.aid) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'Athlete or Session RPE ID not provided.' }
                ))
            }
            const athlete = await Athlete.findOne({ _id: req.params.aid })
            if (!athlete) return next(new NotFoundException(ErrorMessages.USER_404))
            const sessionRPE = await SessionRPE.findOne({ _id: req.params.sid, owner: req.params.aid })
            if (!sessionRPE) {
                return next(new NotFoundException(
                    ErrorMessages.SESSION_RPE_404,
                    { reason: 'Session RPE with the provided ID does not exist.' }
                ))
            }
            res.send({ sRPE: sessionRPE })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readSessionRPE(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        console.log(req.params.id)
        try {
            const sRPE = await SessionRPE.findOne({ _id: req.params.id, owner: req.athlete._id })
            console.log(sRPE)
            if (!sRPE) return next(new NotFoundException(ErrorMessages.SESSION_RPE_404))
            res.send(sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async updateSessionRPE(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const updates: string[] = Object.keys(req.body)
        console.log(updates)
        if (!this.fieldsCheck(updates, this.allowedUpdates)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid fields in the request' }
            ))
        }
        try {
            console.log("SessionRPE id:", req.params.id)
            const sRPE = await SessionRPE.findOne({ _id: req.params.id, owner: req.athlete._id })
            if (!sRPE) {
                return next(new NotFoundException(
                    ErrorMessages.SESSION_RPE_404,
                    { reason: 'Session RPE data with the provided session ID and owner ID does not exist.' }
                ))
            }
            updates.forEach((update: string) => sRPE[update] = req.body[update])
            const notification = this.instantiateNotification(req, 'sRPE.', 'updated sRPE')
            await sRPE.save()
            await notification.save()
            res.send(sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteSessionRPE(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sRPE = await SessionRPE.findOneAndDelete({ _id: req.params.id, owner: req.athlete._id })
            if (!sRPE) {
                return next(new NotFoundException(
                    ErrorMessages.SESSION_RPE_404,
                    { reason: 'Session RPE data with the provided session ID and owner ID does not exist.' }
                )
                );
            }
            await this.instantiateNotification(req, 'sRPE', 'deleted sRPE').save()
            res.send(sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteSessionRPEs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await SessionRPE.deleteMany({ owner: req.athlete._id })
            await this.instantiateNotification(req, 'sRPE', 'deleted all sRPE resources.').save()
            res.send({ message: 'Content deleted.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    /**
    * Checks if the provided fields are allowed for updates.
    * @param updates - List of fields to be updated.
    * @param fields - Allowed fields for updates.
    * @returns Boolean indicating whether the updates are allowed or not.
    */
    private fieldsCheck(updates: string[], fields: string[]): boolean {
        const isAllowed = updates.every((update: string) => fields.includes(update))
        console.log(isAllowed)
        return isAllowed
    }

    /**
     * Creates a new SessionRPE instance.
     * @param req - Express request object.
     * @returns Newly created SessionRPE instance.
     */
    private instantiateSessionRPE(req: Request): typeof SessionRPE | null {
        return new SessionRPE({
            ...req.body,
            owner: req.user._id
        })
    }

    /**
     * Creates a new Notification instance.
     * @param req - Express request object.
     * @param model - Model type for the notification.
     * @param message - Message for the notification.
     * @returns Newly created Notification instance.
     */
    private instantiateNotification(req: Request, model: string, message: string) {
        return new Notification({
            initiatorId: req.user._id,
            recipientId: req.user.coaches,
            model,
            message: `${req.athlete.firstName} ${req.athlete.lastName} ${message}.`,
        })
    }
}