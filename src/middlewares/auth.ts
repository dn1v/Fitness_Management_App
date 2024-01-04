import jsonwebtoken from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { Secret } from 'jsonwebtoken'
import { DecodedToken } from '../interfaces/decodedToken.interface'
import { User } from '../models/user'
import { UnauthorizedException } from '../exceptions/unauthorizedException'
import { ErrorMessages } from '../constants/errorMessages'
import { BadRequestException } from '../exceptions/badRequestException'
import { ForbiddenException } from '../exceptions/forbiddenException'

export class Auth {

    static async authenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '')
            console.log('TOKEN HERE:', token)
            if (token === undefined) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Token not provided.' }))
            const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
            console.log(decoded)
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).exec()
            req.user = user
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

    static async signupCheck(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (req.body.role !== 'Coach' && req.body.role !== 'Athlete') {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Role: ' + req.body.role }))
        }
        next()
    }

    static async authorization(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (req.user.__t !== this) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN, 
                    { reason: 'Role: ' + req.user.__t }
                ))
            }
            next()
        } catch (e) {
            next(e)   
        }
   }
}