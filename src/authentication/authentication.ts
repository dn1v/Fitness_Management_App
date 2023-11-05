import jsonwebtoken from 'jsonwebtoken'
import { Athlete } from '../models/athlete'
import { Request, Response, NextFunction } from 'express'
import { Secret } from 'jsonwebtoken'
import { DecodedToken } from '../interfaces/decodedToken'

export class Auth {

    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        try {
            console.log("auth here")
            const token = req.header('Authorization')?.replace('Bearer ', '')
            if (token === undefined) throw new Error('Token not provided.')
            const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
            if (!decoded) throw new Error('Invalid token.')
            const athlete = await Athlete.findOne({ _id: decoded._id, 'tokens.token': token }).exec()
            if (!athlete) throw new Error('Unable to find the user.')
            req.athlete = athlete
            req.token = token
            next()
        } catch (e) {
            res.status(401).send()
        }

    }
}