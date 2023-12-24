import { ObjectId } from "mongoose";
import { Athlete } from "../models/athlete";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import { SessionRPE } from "../models/sRPE";
import { POMS } from "../models/POMS";
import { Coach } from "../models/coach";
import { User } from "../models/user";
import { UnauthorizedException } from "../exceptions/unauthorizedException";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
// import { EmailService } from "../email/email";

export class AthleteController {

    private readonly allowedUpdates: string[]
    // private emailService: EmailService

    constructor() {
        // this.emailService = new EmailService()
        this.allowedUpdates = ['firstName', 'lastName', 'password', 'dateOfBirth', 'sport']
        this.createAthlete = this.createAthlete.bind(this)
        this.loginAthlete = this.loginAthlete.bind(this)
        this.readAthlete = this.readAthlete.bind(this)
        this.updateAthlete = this.updateAthlete.bind(this)
        this.deleteAthlete = this.deleteAthlete.bind(this)
        this.uploadPhoto = this.uploadPhoto.bind(this)
        this.getPhoto = this.getPhoto.bind(this)
        this.deletePhoto = this.deletePhoto.bind(this)
        this.logoutAthlete = this.logoutAthlete.bind(this)
        this.logoutAll = this.logoutAll.bind(this)
        this.connectionRequest = this.connectionRequest.bind(this)
        this.acceptConnectionRequest = this.acceptConnectionRequest.bind(this)
        this.declineConnectionRequest = this.declineConnectionRequest.bind(this)
        this.removeCoachConnection = this.removeCoachConnection.bind(this)
    }

    public async createAthlete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const athlete = new Athlete(req.body)
        try {
            const token: string = await athlete.generateToken()
            // this.emailService.sendConfirmationEmail(
            //     req.body.firstName,
            //     req.body.email,
            //     `http://127.0.0.1:3001/confirmation/${token}`
            // )
            await athlete.save()
            res.status(201).send({ athlete, token })
        } catch (e) {
            next(new BadRequestException(ErrorMessages.BAD_REQUEST))
        }
    }

    public async loginAthlete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.athlete) return next(new UnauthorizedException(ErrorMessages.UNAUTHORIZED_REQUEST))
            const athlete = req.athlete
            const token = await athlete.generateToken()
            res.send({ athlete, token })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async logoutAthlete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.athlete.tokens = req.athlete.tokens.filter((token: { token: string, _id: ObjectId }) => token.token !== req.token)
            await req.athlete.save()
            res.send()
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.athlete.tokens = []
            await req.athlete.save()
            res.send()
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))

        }
    }

    public async readAthlete(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.athlete) {
            try {
                res.send({ athlete: req.athlete, token: req.token })
            } catch (e) {
                next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
            }
        }
    }

    public async updateAthlete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const updates = Object.keys(req.body)
        if (!this.updateCheck(updates)) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST))
        }
        try {
            updates.forEach((update: string) => req.athlete[update] = req.body[update])
            await req.athlete.save()
            res.send({ athlete: req.athlete, token: req.token })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteAthlete(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log(req.athlete)
        try {
            // Deleting associated data.
            // 'remove' as a first argument in pre method on the schema instance depricated
            await SessionRPE.deleteMany({ owner: req.athlete._id })
            await POMS.deleteMany({ owner: req.athlete._id })
            const athlete = await Athlete.deleteOne({ _id: req.athlete._id })
            res.send({ deleted: athlete })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.file) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'File for upload is not provided.' }))
            const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
            req.athlete.profilePhoto = buffer
            await req.athlete.save()
            res.send({ message: 'Profile photo uploaded.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.athlete.profilePhoto = undefined
            await req.athlete.save()
            res.send()
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async getPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const athlete = await Athlete.findBId(req.params.id)
            // if (!athlete || !athlete.profilePhoto) throw new Error("Athlete or profile photo doesn't exist.")
            if (!athlete) return next(new NotFoundException(ErrorMessages.USER_404))
            if (!athlete.profilePhoto) return next(new NotFoundException('Profile photo does not exist.'))
            res.set("Content-Type", 'image/png')
            res.send(athlete.profilePhoto)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async connectionRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const email = req.body.email
            if (!email) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Email is not provided.' }))
            const coach = await Coach.findOne({ email })
            if (!coach) return next(new NotFoundException(ErrorMessages.USER_404, { reason: email }))
            coach.pending.push(req.athlete._id)
            req.athlete.pending.push(coach._id)
            await coach.save()
            await req.athlete.save()
            res.status(201).send({ message: "Request sent." })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async acceptConnectionRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.params.id) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User ID is not provided.' }
                ))
            }
            const coach = await User.findOne({ _id: req.params.id })
            if (!coach) return next(new NotFoundException(ErrorMessages.USER_404))
            if (req.athlete.coaches.includes(coach._id)) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'Already connected with the user.' }
                ))
            }
            req.athlete.coaches.push(coach._id)
            req.athlete.pending = req.athlete.pending.filter((id: string) => id === coach._id)
            coach.athletes.push(req.athlete._id)
            coach.pending = coach.pending.filter((id: string) => id === req.athlete._id)
            await req.athlete.save()
            await coach.save()
            res.status(201).send({ message: 'Connection successful' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async declineConnectionRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.params.id) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User ID is not provided.' }
                ))
            }
            if (!req.athlete.pending.includes(req.params.id)) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: 'ID is not on the pending list.' }
                ))
            }
            req.athlete.pending = req.athlete.pending.filter((id: string) => id === req.params.id)
            const coach = await User.findOne({ _id: req.params.id })
            if (!coach) return next(new NotFoundException(ErrorMessages.USER_404))
            coach.pending = coach.pending.filter((id: string) => id === req.athlete._id)
            await coach.save()
            await req.athlete.save()
            res.status(201).send({ message: 'Connection declined.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async removeCoachConnection(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.params.id) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User ID is not provided.' }
                ))
            }
            if (!req.athlete.coaches.includes(req.params.id)) {
                return next(new NotFoundException(ErrorMessages.USER_404))
            }
            const coach = await User.findOne({ _id: req.params.id })
            if (!coach) return next(new NotFoundException(ErrorMessages.USER_404))
            req.athlete.coaches = req.athlete.coaches.filter((id: string) => id === coach._id)
            coach.athletes = coach.athletes.filter((id: string) => id === req.athlete._id)
            await req.athlete.save()
            await coach.save()
            res.status(201).send({ message: 'Removed from the coaches list.' })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    private updateCheck(updates: string[]): boolean {
        const isAllowed: boolean = updates.every((update: string) => this.allowedUpdates.includes(update))
        return isAllowed
    }
}