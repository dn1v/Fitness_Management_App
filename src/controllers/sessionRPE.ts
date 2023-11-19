import { Request, Response } from "express";
import { SessionRPE } from "../models/sRPE";
import { Coach } from "../models/coach";
import { Athlete } from "../models/athlete";

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

    private updateCheck(updates: string[]): boolean {
        const isAllowed = updates.every((update: string) => this.allowedUpdates.includes(update))
        console.log(isAllowed)
        return isAllowed
    }

    public async createSessionRPE(req: Request, res: Response): Promise<void> {
        const sRPE = new SessionRPE({
            ...req.body,
            owner: req.athlete._id
        })
        try {
            await sRPE.save()
            res.status(201).send(sRPE)
        } catch (e) {
            res.status(400).send(e)
        }
    }

    public async readSessionRPEs(req: Request, res: Response): Promise<void> {
        try {
            await req.athlete.populate({
                path: 'sRPE',
                match: req.match,
                options: req.options
            })
            res.send(req.athlete.sRPE)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async coachReadSessionRPEs(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.params.aid) return res.status(400).send({ message: 'ID not provided' })
            const athlete = await Athlete.findOne({ _id: req.params.aid })
            if (!athlete) return res.status(404).send({ message: 'User not found.' })
            if (!athlete.coaches.includes(req.coach._id)) return res.status(400).send({ message: "User is not on your coaching list." })
            await athlete.populate({
                path: 'sRPE',
                match: req.match,
                options: req.options
            })
            res.send(athlete.sRPE)
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
        }
    }

    public async coachReadSessionRPE(req: Request, res: Response): Promise<Response | void> {
        try {
            if (!req.params.aid || !req.params.sid) return res.status(400).send({ message: 'Athlete or Session RPE ID not provided.' })
            const athlete = await Athlete.findOne({ _id: req.params.aid })
            if (!athlete) return res.status(404).send({ message: 'User not found.' })
            const sessionRPE = await SessionRPE.findOne({ _id: req.params.sid, owner: req.params.aid })
            if (!sessionRPE) return res.status(404).send({ message: 'Session RPE not found.' })
            res.send({ sRPE: sessionRPE })
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
        }
    }

    public async readSessionRPE(req: Request, res: Response): Promise<Response | void> {
        console.log(req.params.id)
        try {
            const sRPE = await SessionRPE.findOne({ _id: req.params.id, owner: req.athlete._id })
            console.log(sRPE)
            if (!sRPE) return res.sendStatus(404)
            res.send(sRPE)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async updateSessionRPE(req: Request, res: Response): Promise<Response | void> {
        const updates: string[] = Object.keys(req.body)
        console.log(updates)
        if (!this.updateCheck(updates)) return res.status(400).send()
        try {
            console.log("SessionRPE id:", req.params.id)
            const sRPE = await SessionRPE.findOne({ _id: req.params.id, owner: req.athlete._id })
            if (!sRPE) return res.status(404).send()
            updates.forEach((update: string) => sRPE[update] = req.body[update])
            await sRPE.save()
            res.send(sRPE)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async deleteSessionRPE(req: Request, res: Response): Promise<void> {
        try {
            const sRPE = await SessionRPE.findOneAndDelete({ _id: req.params.id, owner: req.athlete._id })
            sRPE ? res.send(sRPE) : res.sendStatus(404)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}