import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import sharp from "sharp";
import { HttpException } from "../exceptions/httpExceptions";
import { ErrorMessages } from "../constants/errorMessages";
import { BadRequestException } from "../exceptions/badRequestException";
import { NotFoundException } from "../exceptions/notFoundException";
import { User } from "../models/user";
import { Roles } from "../constants/roles";
import { Athlete } from "../models/athlete";
import { Coach } from "../models/coach";

export class UserController {
    private coachAllowedUpdates: string[]
    private athleteAllowedUpdates: string[]
    private rolesLists: string[][]

    constructor() {
        this.coachAllowedUpdates = ['firstName', 'lastName', 'password', 'position']
        this.athleteAllowedUpdates = ['firstName', 'lastName', 'password', 'dateOfBirth', 'sport']
        this.rolesLists = [['Athlete', 'athletes'], ['Coach', 'coaches']]
        this.signup = this.signup.bind(this)
        this.update = this.update.bind(this)
        this.acceptConnectionRequest = this.acceptConnectionRequest.bind(this)
        this.declineConnectionRequest = this.declineConnectionRequest.bind(this)
        this.removeUserConnection = this.removeUserConnection.bind(this)
    }

    public async signup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { role, ...userData } = req.body
        const user = this.userType(role, userData)
        try {
            const exists = await User.findOne({ email: user.email })
            if (exists) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: "User already exist." }))
            const token: string = await user.generateToken()
            await user.save()
            // console.log(user)
            res.status(201).send({ user, token })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body.email || !req.body.password) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'Email, password or both are missing in the request.' }
                ))
            }
            const user = await User.credentialsCheck(req.body.email, req.body.password, next)
            console.log("USER:", user)
            const token = await user.generateToken()
            await user.save()
            res.status(200).send({ user, token })
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestException) {
                next(error);
            } else if (error instanceof NotFoundException) {
                next(error);
            } else {
                next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR));
            }
            // next(e)
        }
    }


    public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.user.tokens = req.user.tokens.filter((token: { token: string, _id: ObjectId }) => token.token !== req.token)
            await req.user.save()
            res.send()
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.send({ user: req.user, token: req.token })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const updates = Object.keys(req.body)
        if (this.updateCheck(updates, req.user.role)) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Trying to update unchangable fields.' }))
        }
        try {
            updates.forEach((update: string) => req.user[update] = req.body[update])
            await req.user.save()
            res.send({ user: req.user, token: req.token })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.deleteOne({ _id: req.user._id })
            res.send({ deleted: user })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.file) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: "Missing file for upload." }))
            const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
            req.user.profilePhoto = buffer
            await req.user.save()
            res.send({ message: 'Profile photo uploaded.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user.profilePhoto) return next(new NotFoundException('Photo does not exist.'))
            req.user.profilePhoto = undefined
            await req.user.save()
            res.send()
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async getPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findBId(req.params.id)
            if (!user) return next(new NotFoundException(ErrorMessages.USER_404))
            if (!user.profilePhoto) return next(new NotFoundException('Photo does not exist.'))
            res.set("Content-Type", 'image/png')
            res.send(user.profilePhoto)
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async connectionRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { email } = req.body
            if (!email) return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'You did not provide email.' }))
            const user = await User.findOne({ email })


            if (!user) return next(new NotFoundException(ErrorMessages.USER_404, { reason: email }))
            if (req.user.connections.includes(user._id.toString())) {
                return next(
                    new BadRequestException(
                        ErrorMessages.BAD_REQUEST,
                        { reason: "Already connected with the user." }
                    ))
            }
            if (!req.user.sentReqs.includes(user._id.toString())) {
                user.receivedReqs.push(req.user._id)
                req.user.sentReqs.push(user._id)
            }
            await Promise.all([user.save(), req.user.save()])
            res.status(201).send({ message: "Request sent." })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async removeConnectionRequst(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    }

    public async acceptConnectionRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id: _id } = req.params;
            console.log('OTHER ID:', _id)
            if (!_id) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User ID is not provided.' }
                ));
            }

            const user = await User.findOne({ _id });
            if (!user) {
                return next(new NotFoundException(ErrorMessages.USER_404));
            }

            if (req.user.connections.includes(user._id)) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'Already connected with the user.' }
                ));
            }

            req.user.connections.push(user._id);
            user.connections.push(req.user._id)
            req.user.receivedReqs = req.user.receivedReqs.filter((id: ObjectId) => id.toString() !== user._id.toString());
            user.sentReqs = user.sentReqs.filter((id: ObjectId) => id.toString() !== req.user._id.toString());

            this.updateRoleLists(req.user, user);

            await Promise.all([req.user.save(), user.save()]);

            res.status(201).send({ message: 'Connection successful' });
        } catch (error) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR));
        }
    }


    public async getSentRequests(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const sentRequests = await User.find()
                .select('_id firstName lastName __t')
                .where('_id')
                .in(req.user.sentReqs)
                .exec()

            res.send({ requests: sentRequests })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async getReceivedRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const receivedRequests = await User.find()
                .select('_id firstName lastName __t')
                .where('_id')
                .in(req.user.receivedReqs)
                .exec()

            res.send({ requests: receivedRequests })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async declineConnectionRequest(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id: _id } = req.params;

            if (!_id) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User ID is not provided.' }
                ));
            }

            if (!req.user.receivedReqs.includes(_id)) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User not on the request list.' }
                ));
            }

            const user = await User.findOne({ _id });

            if (!user) {
                return next(new NotFoundException(ErrorMessages.USER_404));
            }

            await this.removeConnectionRequests(req.user, user);
            res.status(201).send({ message: 'Connection declined.' });
        } catch (error) {
            console.error(error);
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR));
        }
    }

    public async removeUserConnection(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            if (!req.params.id) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'User ID is not provided.' }
                ))
            }
            if (!req.user.connections.includes(req.params.id)) {
                return next(new NotFoundException(ErrorMessages.USER_404, { reason: "User is not on the connection list." }))
            }
            const otherUser = await User.findOne({ _id: req.params.id })
            if (!otherUser) return next(new NotFoundException(ErrorMessages.USER_404))
            await this.removeConnections(req.user, otherUser)
            res.status(201).send({ message: 'Removed from the connections list.' })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    private async removeConnections(currentUser: typeof User, otherUser: typeof User) {
        currentUser.connections = currentUser.connections.filter((id: ObjectId) => id.toString() !== otherUser._id.toString())
        otherUser.connections = otherUser.connections.filter((id: ObjectId) => id.toString() !== currentUser._id.toString())
        console.log("OTHER USER:", otherUser.connections, 'CURRENT ID:', currentUser._id)
        this.rolesLists.forEach((role: string[]) => {
            currentUser[role[1]] = currentUser[role[1]].filter((id: ObjectId) => id.toString() !== otherUser._id.toString())
            otherUser[role[1]] = otherUser[role[1]].filter((id: ObjectId) => id.toString() !== currentUser._id.toString())
        })

        await currentUser.save()
        await otherUser.save()
    }

    private updateCheck(updates: string[], role: string): boolean {
        switch (role) {
            case Roles.ATHLETE:
                return updates.every((update: string) => this.athleteAllowedUpdates.includes(update));
            case Roles.COACH:
                return updates.every((update: string) => this.coachAllowedUpdates.includes(update));
            default:
                return false;
        }
    }

    private userType(role: string, userData: any) {
        switch (role) {
            case Roles.ATHLETE:
                return new Athlete(userData)
            case Roles.COACH:
                return new Coach(userData)
        }
    }

    private updateRoleLists(currentUser: typeof User, otherUser: typeof User): void {
        this.rolesLists.forEach((role: string[]) => {
            if (otherUser.__t === role[0]) {
                currentUser[role[1]].push(otherUser._id);
            }
            if (currentUser.__t === role[0]) {
                otherUser[role[1]].push(currentUser._id);
            }
        });
    }

    private async removeConnectionRequests(currentUser: typeof User, otherUser: typeof User): Promise<void> {
        const currentUserId = currentUser._id.toString();
        const otherUserId = otherUser._id.toString();

        currentUser.receivedReqs = currentUser.receivedReqs?.filter((id: ObjectId) => id.toString() !== otherUserId);
        otherUser.sentReqs = otherUser.sentReqs?.filter((id: ObjectId) => id.toString() !== currentUserId);

        await Promise.all([currentUser.save(), otherUser.save()]);
    }
}