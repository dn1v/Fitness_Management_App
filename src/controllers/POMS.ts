import { POMS } from "../models/POMS";
import { Request, Response } from "express";

export class POMSController {

    private forbiddenUpdates = [
        'angerMoodState',
        'confusionMoodState',
        'depressionMoodState',
        'fatigueMoodState',
        'tensionMoodState',
        'vigourMoodState',
        'totalMoodScore'
    ]

    public async createPOMS(req: Request, res: Response): Promise<void> {
        const poms = new POMS({
            ...req.body,
            owner: req.athlete._id
        })

        try {
            await poms.save()
            res.status(201).send(poms)
        } catch (e) {
            res.status(400).send(e)
        }
    }

    public async readManyPOMS(req: Request, res: Response): Promise<void> {
        try {
            await req.athlete.populate({
                path: "pomsQ",
                match: req.options,
                options: req.options
            })
            res.send({ POMS: req.athlete.pomsQ })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async readPOMS(req: Request, res: Response): Promise<Response | void> {
        try {
            const poms = await POMS.findOne({ _id: req.params._id, owner: req.athlete._id })
            if (!poms) return res.sendStatus(404)
            res.send(poms)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async updatePOMS(req: Request, res: Response): Promise<Response | void> {
        const updates = Object.keys(req.body)
        if (this.isNotAllowed(updates)) return res.sendStatus(400)
        try {
            const poms = await POMS.findOne({ _id: req.body._id, owner: req.athlete._id })
            if (!poms) return res.sendStatus(404)
            updates.forEach((update: string) => poms[update] = req.body[update])
            await poms.save()
            res.send(poms)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    public async deletePOMS(req: Request, res: Response): Promise<Response | void> {
        try {
            const poms = await POMS.findOneAndDelete({ _id: req.params.id, owner: req.athlete._id })
            if (!poms) return res.sendStatus(404)
            res.send(poms)
        } catch (e) {
            res.status(500).send(e)
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