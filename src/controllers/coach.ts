import { Coach } from "../models/coach";
import { Request, Response } from "express";
import sharp from "sharp";

export class CoachController {

    public async createCoach(req: Request, res: Response): Promise<void> {
        if (req.body.role === 'coach') {
            const coach = new Coach(req.body)
            try {
                const token: string = await coach.generateToken()
                await coach.save()
                res.status(201).send({ coach, token })
            } catch (e) {
                res.status(400).send(e)
            }
        }
    }

    public async loginCoach(req: Request, res: Response): Promise<void> {
        if (req.body.role === 'coach') {
            try {
                const coach = await Coach.credentialsCheck(req.body.email, req.body.password)
                const token = await coach.generateToken()
                res.send({ coach, token })
            } catch (e) {
                res.status(400).send(e)
            }
        }
    }
}