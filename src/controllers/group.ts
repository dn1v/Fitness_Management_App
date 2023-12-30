import { Request, Response, NextFunction } from "express";
import { Group } from "../models/group";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { ForbiddenException } from "../exceptions/forbiddenException";
import { User } from "../models/user";
import { getOutputFileNames } from "typescript";

export class GroupController {

    private allowedUpdates: string[]
    private allowedCreateFields: string[]

    constructor() {
        this.allowedCreateFields = ['admin', 'moderators', 'members', 'posts', 'about', 'showMembers', 'showModerators']
        this.allowedUpdates = ['admin', 'posts', 'about', 'showMembers', 'showModerators']
        this.createGroup = this.createGroup.bind(this)
        this.updateGroup = this.updateGroup.bind(this)
    }

    public async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const fields = Object.keys(req.body)
        if (!this.fieldsCheck(fields, this.allowedCreateFields)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid fields in the request' }
            ))
        }
        const group = new Group({ ...req.body })
        try {
            await group.save()
            res.status(201).send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { _id: admin } = req.user
        try {
            const groups = Group.find({ admin })
            res.send({ groups })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId } = req.params

        if (!groupId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Gruop ID not provided.' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async updateGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const fields = Object.keys(req.body)
        const { groupId } = req.params
        const { _id: userId } = req.user
        if (!this.fieldsCheck(fields, this.allowedUpdates)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid fields in the request' }
            ))
        }
        if (!groupId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Gruop ID not provided.' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })

            if (!group) {
                return next(new NotFoundException(
                    ErrorMessages.GROUP_404,
                    { reason: "Invalid group ID." }
                ))
            }
            // this.userAdminError(userId, group, next)
            if (userId !== group.admin) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            fields.forEach((field: string) => group[field] = req.body[field])
            await group.save()
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    private userAdminError(userId: string, group: typeof Group, next: NextFunction) {
        if (userId !== group.admin) {
            return next(new ForbiddenException(
                ErrorMessages.FORBIDDEN,
                { reason: "You are not admin of this gruop." }
            ))
        }
    }

    public async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { gruopId } = req.params
        if (!gruopId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Gruop ID not provided.' }
            ))
        }
        try {
            const group = await Group.findOneAndDelete({ _id: gruopId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            res.send({ message: 'Group deleted.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async addModerator(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, newModId } = req.params

        if (!groupId) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'ID missing.' }))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (req.user._id !== group.admin) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            const newMod = await User.findOne({ _id: newModId })
            if (!newMod) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: 'User you want to add as a moderator does not exist.' }
                ))
            }
            group.moderators.push(newModId)
            await group.save()
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async addModerators() { }

    public async removeModerator(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, modId } = req.params

        if (!groupId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'ID missing.' }
            ))
        }
        try {
            const moderator = await User.findOne({ _id: modId})
            if (!moderator) {
                return next(new NotFoundException(ErrorMessages.USER_404))
            }
            if
        } catch (e) {

        }
    }

    public async removeMerators() { }

    public async addMember() { }

    public async addMembers() { }

    public async leaveGroup() { }



    /**
    * Checks if the provided fields are allowed for updates.
    * @param updates - List of fields to be updated.
    * @param fields - Allowed fields for updates.
    * @returns Boolean indicating whether the updates are allowed or not.
    */
    private fieldsCheck(updates: string[], fields: string[]): boolean {
        const isAllowed = updates.every((update: string) => fields.includes(update))
        console.log(isAllowed)
        return isAllowed
    }
}