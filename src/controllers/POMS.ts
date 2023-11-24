import { ErrorMessages } from "../constants/errorMessages";
import { BadRequestException } from "../exceptions/badRequestException";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { POMS } from "../models/POMS";
import { NextFunction, Request, Response } from "express";
import { Athlete } from "../models/athlete";

export class POMSController {

    private forbiddenUpdates: string[]

    constructor() {
        this.forbiddenUpdates = [
            'angerMoodState',
            'confusionMoodState',
            'depressionMoodState',
            'fatigueMoodState',
            'tensionMoodState',
            'vigourMoodState',
            'totalMoodScore'
        ]
        this.createPOMS = this.createPOMS.bind(this)
        this.readManyPOMS = this.readManyPOMS.bind(this)
        this.readPOMS = this.readPOMS.bind(this)
        this.updatePOMS = this.updatePOMS.bind(this)
        this.deletePOMS = this.deletePOMS.bind(this)
    }

    public async createPOMS(req: Request, res: Response, next: NextFunction): Promise<void> {
        //ADD CHECK FOR FORBIDDEN FIELDS
        let fields = Object.keys(req.body)
        if (this.isNotAllowed(fields)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid fields in the request' }
            ))
        }
        const poms = new POMS({
            ...req.body,
            owner: req.athlete._id
        })

        try {
            await poms.save()
            res.status(201).send(poms)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readManyPOMS(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await req.athlete.populate({
                path: "pomsQ",
                match: req.match,
                options: req.options
            })
            res.send({ POMS: req.athlete.pomsQ })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readPOMS(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const poms = await POMS.findOne({ _id: req.params.id, owner: req.athlete._id })
            if (!poms) return next(new NotFoundException(ErrorMessages.POMS_404))
            res.send(poms)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async coachReadManyPOMS(req: Request, res: Response, next: NextFunction): Promise<void> {
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
                path: "pomsQ",
                match: req.match,
                options: req.options
            })
            res.send(athlete.sRPE)
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async coachReadPOMS(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.params.aid) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'Athlete or Session RPE ID not provided.' }
                ))
            }
            const athlete = await Athlete.findOne({ _id: req.params.aid })
            if (!athlete) return next(new NotFoundException(ErrorMessages.USER_404))
            const poms = await POMS.findOne({ _id: req.params.pid, owner: req.params.aid })
            if (!poms) {
                return next(new NotFoundException(
                    ErrorMessages.POMS_404,
                    { reason: 'POMS quesionaire with the provided ID does not exist.' }
                ))
            }
            res.send({ POMS: poms })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async updatePOMS(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const updates = Object.keys(req.body)
        if (this.isNotAllowed(updates)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid update fields. Please check the provided data.' }
            ))
        }
        try {
            const poms = await POMS.findOne({ _id: req.params.id, owner: req.athlete._id })
            if (!poms) return next(new NotFoundException(ErrorMessages.POMS_404))
            updates.forEach((update: string) => poms[update] = req.body[update])
            await poms.save()
            res.send(poms)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deletePOMS(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const poms = await POMS.findOneAndDelete({ _id: req.params.id, owner: req.athlete._id })
            if (!poms) return next(new NotFoundException(ErrorMessages.POMS_404))
            res.send(poms)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    private isNotAllowed(updates: string[]) {
        let notAllowed: boolean = false
        updates.forEach((update: string) => {
            if (this.forbiddenUpdates.includes(update)) return notAllowed = true
        })
        return notAllowed
    }
}