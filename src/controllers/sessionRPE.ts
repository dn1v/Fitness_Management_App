import { NextFunction, Request, Response } from "express";
import { SessionRPE } from "../models/sRPE";
import { Coach } from "../models/coach";
import { Athlete } from "../models/athlete";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";

export class SessionRPEController {

    private allowedUpdates: string[]

    constructor() {
        this.allowedUpdates = ['trainingType', 'duration', 'sRPE']
        this.createSessionRPE = this.createSessionRPE.bind(this)
        this.readSessionRPEs = this.readSessionRPEs.bind(this)
        this.readSessionRPE = this.readSessionRPE.bind(this)
        this.updateSessionRPE = this.updateSessionRPE.bind(this)
        this.deleteSessionRPE = this.deleteSessionRPE.bind(this)
    }

    private fieldsCheck(updates: string[]): boolean {
        const isAllowed = updates.every((update: string) => this.allowedUpdates.includes(update))
        console.log(isAllowed)
        return isAllowed
    }

    public async createSessionRPE(req: Request, res: Response, next: NextFunction): Promise<void> {
        let fields = Object.keys(req.body)
        if (!this.fieldsCheck(fields)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid fields in the request' }
            ))
        }
        const sRPE = new SessionRPE({
            ...req.body,
            owner: req.athlete._id
        })
        try {
            await sRPE.save()
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
            if (!athlete) return res.status(404).send({ message: 'User not found.' })
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
            if (!sRPE) return res.sendStatus(404)
            res.send(sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async updateSessionRPE(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const updates: string[] = Object.keys(req.body)
        console.log(updates)
        if (!this.fieldsCheck(updates)) {
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
            await sRPE.save()
            res.send(sRPE)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteSessionRPE(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sRPE = await SessionRPE.findOneAndDelete({ _id: req.params.id, owner: req.athlete._id })
            sRPE
                ? res.send(sRPE)
                : next(
                    new NotFoundException(
                        ErrorMessages.SESSION_RPE_404,
                        { reason: 'Session RPE data with the provided session ID and owner ID does not exist.' }
                    )
                );
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }
}