import jsonwebtoken from 'jsonwebtoken'
import { Athlete } from '../models/athlete'
import { Request, Response, NextFunction } from 'express'
import { Secret } from 'jsonwebtoken'
import { DecodedToken } from '../interfaces/decodedToken.interface'
import { User } from '../models/user'

export class Auth {

    // static async authenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {
    //         const token = req.header('Authorization')?.replace('Bearer ', '')
    //         if (token === undefined) throw new Error('Token not provided.')
    //         const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
    //         if (!decoded) throw new Error('Invalid token.')
    //         const athlete = await Athlete.findOne({ _id: decoded._id, 'tokens.token': token }).exec()
    //         if (!athlete) throw new Error('Unable to find the user.')
    //         req.athlete = athlete
    //         req.token = token
    //         next()
    //     } catch (e) {
    //         res.status(401).send()
    //     }
    // }

    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '')
            if (token === undefined) throw new Error('Token not provided.')
            const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
            if (!decoded) throw new Error('Invalid token.')
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).exec()
            if (!user) throw new Error('Unable to find the user.')
            if (user.__t === 'Coach') req.coach = user
            if (user.__t === 'Athlete') req.athlete = user
            req.token = token
            next()
        } catch (e) {
            res.status(401).send()
        }
    }

    static async authorization(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (req.body.role !== 'Coach' && req.body.role !== 'Athlete') {
            return res.status(400).send({ message: 'The role you provided does not exist.' })
        }

        if (req.body.role === this) {
            next()
        }
    }

    static async loginRoleCheck(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const user = await User.credentialsCheck(req.body.email, req.body.password)
        console.log(user)
        if (user.__t === 'Athlete') req.athlete = user
        if (user.__t === 'Coach') req.coach = user
        next()
    }
}