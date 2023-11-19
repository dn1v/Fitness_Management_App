import { Coach } from "../models/coach";
import { User } from "../models/user";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import sharp from "sharp";
import { ResolutionMode } from "typescript";

export class CoachController {

    private allowedUpdates: string[]

    constructor() {
        this.allowedUpdates = ['firstName', 'lastName', 'password', 'position']
        this.createCoach = this.createCoach.bind(this)
        this.loginCoach = this.loginCoach.bind(this)
        this.readCoach = this.readCoach.bind(this)
        this.updateCoach = this.updateCoach.bind(this)
        this.deleteCoach = this.deleteCoach.bind(this)
        this.uploadPhoto = this.uploadPhoto.bind(this)
        this.getPhoto = this.getPhoto.bind(this)
        this.deletePhoto = this.deletePhoto.bind(this)
        this.updateCheck = this.updateCheck.bind(this)
        this.logoutCoach = this.logoutCoach.bind(this)
        this.logoutAll = this.logoutAll.bind(this)
        this.getConnectionRequests = this.getConnectionRequests.bind(this)
    }

    public async createCoach(req: Request, res: Response): Promise<void> {
        const coach = new Coach(req.body)
        console.log(coach)
        try {
            const token: string = await coach.generateToken()
            await coach.save()
            res.status(201).send({ coach, token })
        } catch (e) {
            res.status(400).send(e)
        }
    }

    public async loginCoach(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.coach) return res.status(401).send()
            const coach = req.coach
            const token = await coach.generateToken()
            res.send({ coach, token })
        } catch (e) {
            res.status(400).send(e)
        }
    }

    public async logoutCoach(req: Request, res: Response): Promise<void> {
        try {
            req.coach.tokens = req.coach.tokens.filter((token: { token: string, _id: ObjectId }) => token.token !== req.token)
            await req.coach.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }

    public async logoutAll(req: Request, res: Response): Promise<void> {
        try {
            req.coach.tokens = []
            await req.coach.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }

    public async readCoach(req: Request, res: Response): Promise<void> {
        console.log('This fired')
        try {

            res.send({ coach: req.coach, token: req.token })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async updateCoach(req: Request, res: Response): Promise<Response | void> {
        const updates = Object.keys(req.body)
        if (!this.updateCheck(updates)) {
            res.status(400).send()
        }

        try {
            updates.forEach((update: string) => req.coach[update] = req.body[update])
            await req.coach.save()
            res.send({ coach: req.coach, token: req.token })
        } catch (e) {
            res.status(500).send()
        }
    }

    public async deleteCoach(req: Request, res: Response): Promise<void> {
        try {
            const coach = await Coach.deleteOne({ _id: req.coach._id })
            res.send({ deleted: coach })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async uploadPhoto(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.file) return res.status(400).send("No file for upload.")
            const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
            req.coach.profilePhoto = buffer
            await req.coach.save()
            res.send({ message: 'Profile photo uploaded.' })
        } catch (e) {
            res.status(500).send()
        }
    }

    public async deletePhoto(req: Request, res: Response): Promise<void> {
        try {
            req.coach.profilePhoto = undefined
            await req.coach.save()
            res.send()
        } catch (e) {
            res.send(500).send()
        }
    }

    public async getPhoto(req: Request, res: Response): Promise<void> {
        try {
            const coach = await Coach.findBId(req.params.id)
            if (!coach || !coach.profilePhoto) throw new Error("Athlete or profile photo doesn't exist.")
            res.set("Content-Type", 'image/png')
            res.send(coach.profilePhoto)
        } catch (e) {
            res.status(404).send()
        }
    }

    public async connectionRequest(req: Request, res: Response): Promise<Response | void> {
        try {
            const email = req.body.email
            const athlete = await User.findOne({ email })
            if (!athlete) return res.status(404).send({ message: "User with provided email does not exist." })
            athlete.pending.push(req.coach._id)
            req.coach.pending.push(athlete._id)
            await athlete.save()
            await req.coach.save()
            res.status(201).send({ message: "Request sent." })
        } catch (e) {
            console.error(e)
            res.status(500).send({ message: "Internal server error." })
        }
    }

    public async getConnectionRequests(req: Request, res: Response): Promise<Response | void> {
        try {
            //if (!req.coach.pending.length) return res.status(404).send()
            const connectionRequests = await User.find().where('_id').in(req.coach.pending).exec()
            console.log("CONNECTIONS", connectionRequests)
            res.send({ requests: connectionRequests })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async acceptConnectionRequest(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.params.id) return res.status(400).send({ message: 'ID not provided' })
            const athlete = await User.findOne({ _id: req.params.id })
            if (!athlete) res.status(404).send()
            if (req.coach.athletes.includes(athlete._id)) return res.status(400).send({ message: 'Already connected with the user.' })
            req.coach.athletes.push(req.params.id)
            req.coach.pending = req.coach.pending.filter((id: string) => id === athlete._id)
            athlete.coaches.push(req.coach._id)
            athlete.pending = athlete.pending.filter((id: string) => id === req.coach._id)
            await req.coach.save()
            await athlete.save()
            res.status(201).send({ message: 'Connection successful' })
        } catch (e) {
            res.status(500).send()
        }
    }

    public async declineConnectionRequest(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.params.id) return res.status(400).send({ message: 'ID not provided.' })
            if (!req.coach.pending.includes(req.params.id)) return res.status(404).send({ message: 'User not on the request list.' })
            req.coach.pending = req.coach.pending.filter((id: string) => id === req.params.id)
            const athlete = await User.findOne({ _id: req.params.id })
            if (!athlete) return res.status(404).send()
            athlete.pending = athlete.pending.filter((id: string) => id === req.coach._id)
            await athlete.save()
            await req.coach.save()
            res.status(201).send({ message: 'Connection declined.' })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async removeAthleteConnection(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.params.id) return res.status(400).send({ message: 'ID not provided.' })
            if (!req.coach.athletes.includes(req.params.id)) return res.status(404).send({ message: 'Not connected.' })
            const athlete = await User.findOne({ _id: req.params.id })
            if (!athlete) return res.status(404).send({ message: 'User does not exist.' })
            req.coach.athletes = req.coach.athletes.filter((id: string) => id === athlete._id)
            athlete.coaches = athlete.coaches.filter((id: string) => id === req.coach._id)
            await req.coach.save()
            await athlete.save()
            res.status(201).send({ message: 'Removed from the athletes list.'})
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
        }
    }

    private updateCheck(updates: string[]): boolean {
        const isAllowed: boolean = updates.every((update: string) => this.allowedUpdates.includes(update))
        return isAllowed
    }
}