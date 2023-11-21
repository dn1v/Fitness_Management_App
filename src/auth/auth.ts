import jsonwebtoken from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { Secret } from 'jsonwebtoken'
import { DecodedToken } from '../interfaces/decodedToken.interface'
import { User } from '../models/user'
import { UnauthorizedException } from '../exceptions/unauthorizedException'
import { ErrorMessages } from '../constants/errorMessages'
import { BadRequestException } from '../exceptions/badRequestException'

export class Auth {

    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '')
            if (token === undefined) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Token not provided.' }))
            const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
            console.log(decoded)
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).exec()
            if (user.__t === 'Coach') req.coach = user
            if (user.__t === 'Athlete') req.athlete = user
            req.token = token
            next()
        } catch (e) {
            console.log('test catch')
            next(new UnauthorizedException(
                ErrorMessages.UNAUTHORIZED_REQUEST,
                { reason: 'Invalid token or user with the provided token does not exist.' }
            ))
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
        try {
            console.log('test')
            const user = await User.credentialsCheck(req.body.email, req.body.password)
            console.log(user)
            if (user.__t === 'Athlete') req.athlete = user
            if (user.__t === 'Coach') req.coach = user

            next()
        } catch (error) {
            next(error)
        }
    }
}