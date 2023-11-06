import { ObjectId } from "mongoose";
import { Athlete } from "../models/athlete";
import { Request, Response } from "express";
import sharp from "sharp";
import { SessionRPE } from "../models/sRPE";
import { POMS } from "../models/POMS";

export class AthleteController {

    private readonly allowedUpdates: string[]

    constructor() {
        this.allowedUpdates = ['firstName', 'lastName', 'password', 'height', 'weight', 'age']
        this.createAthlete = this.createAthlete.bind(this)
        this.loginAthlete = this.loginAthlete.bind(this)
        this.readAthlete = this.readAthlete.bind(this)
        this.updateAthlete = this.updateAthlete.bind(this)
        this.deleteAthlete = this.deleteAthlete.bind(this)
        this.uploadPhoto = this.uploadPhoto.bind(this)
        this.updateCheck = this.updateCheck.bind(this)
        this.getPhoto = this.getPhoto.bind(this)
        this.deletePhoto = this.deletePhoto.bind(this)
        this.logoutAthlete = this.logoutAthlete.bind(this)
        this.logoutAll = this.logoutAll.bind(this)
    }

    public async createAthlete(req: Request, res: Response): Promise<void> {
        const athlete = new Athlete(req.body)
        try {
            const token: string = await athlete.generateToken()
            await athlete.save()
            res.status(201).send({ athlete, token })
        } catch (e) {
            res.status(400).send(e)
        }
    }

    public async loginAthlete(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.headers)
            const athlete = await Athlete.credentialsCheck(req.body.email, req.body.password)
            const token = await athlete.generateToken()
            res.send({ athlete, token })
        } catch (e) {
            res.status(400).send(e)
        }
    }

    public async logoutAthlete(req: Request, res: Response): Promise<void> {
        try {
            req.athlete.tokens = req.athlete.tokens.filter((token: { token: string, _id: ObjectId }) => token.token !== req.token)
            await req.athlete.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }

    public async logoutAll(req: Request, res: Response): Promise<void> {
        try {
            req.athlete.tokens = []
            await req.athlete.save()
            res.send()
        } catch (e) {
            res.status(500).send()
        }
    }

    public async readAthlete(req: Request, res: Response): Promise<void> {
        try {
            res.send({ athlete: req.athlete, token: req.token })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async updateAthlete(req: Request, res: Response): Promise<void> {
        const updates = Object.keys(req.body)
        if (!this.updateCheck(updates)) {
            res.status(400).send()
        }

        try {
            updates.forEach((update: string) => req.athlete[update] = req.body[update])
            await req.athlete.save()
            res.send({ athlete: req.athlete, token: req.token })
        } catch (e) {
            res.status(500).send()
        }
    }

    public async deleteAthlete(req: Request, res: Response): Promise<void> {
        console.log(req.athlete)
        try {
            // 'remove' as a first argument in pre method on the schema instance depricated
            await SessionRPE.deleteMany({ owner: req.athlete._id })
            await POMS.deleteMany({ owner: req.athlete._id })
            const athlete = await Athlete.deleteOne({ _id: req.athlete._id })
            res.send({ deleted: athlete })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async uploadPhoto(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.file) return res.status(400).send("No file for upload.")
            const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
            req.athlete.profilePhoto = buffer
            await req.athlete.save()
            res.send({ message: 'Profile photo uploaded.' })
        } catch (e) {
            res.status(500).send()
        }
    }

    public async deletePhoto(req: Request, res: Response): Promise<void> {
        try {
            req.athlete.profilePhoto = undefined
            await req.athlete.save()
            res.send()
        } catch (e) {
            res.send(500).send()
        }
    }

    public async getPhoto(req: Request, res: Response): Promise<void> {
        try {
            const athlete = await Athlete.findBId(req.params.id)
            if (!athlete || !athlete.profilePhoto) throw new Error("Athlete or profile photo doesn't exist.")
            res.set("Content-Type", 'image/png')
            res.send(athlete.profilePhoto)
        } catch (e) {
            res.status(404).send()
        }
    }

    private updateCheck(updates: string[]): boolean {
        const isAllowed: boolean = updates.every((update: string) => this.allowedUpdates.includes(update))
        return isAllowed
    }
}