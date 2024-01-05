import { Request, Response, NextFunction } from "express";
import { Group } from "../models/group";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { ForbiddenException } from "../exceptions/forbiddenException";
import { User } from "../models/user";
import { ObjectId } from "mongoose";

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

        const group = new Group({ ...req.body, admin: req.user._id })
        try {
            await group.save()
            res.status(201).send({ group })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { _id: admin } = req.user
        console.log(admin)
        try {

            const groups = await Group.find({ admin })
            res.send({ groups })
        } catch (e) {
            console.error(e)
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
            console.log('user: ', req.user._id)
            console.log('admin:', group.admin)
            if (!group) {
                return next(new NotFoundException(
                    ErrorMessages.GROUP_404,
                    { reason: "Invalid group ID." }
                ))
            }
            // this.userAdminError(userId, group, next)
            if (req.user._id.toString() !== group.admin.toString()) {
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
            if (req.user._id.toString() !== group.admin.toString()) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            await Group.deleteOne({ _id: groupId })
            res.send({ message: 'Group deleted.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async addModerator(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, newModId: modId } = req.params

        if (!groupId) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'ID missing.' }))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (req.user._id.toString() !== group.admin.toString()) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            const newMod = await User.findOne({ _id: modId })
            if (!newMod) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: 'User you want to add as a moderator does not exist.' }
                ))
            }
            group.moderators.push(modId)
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
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (req.user._id.toString() !== group.admin.toString()) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            const moderator: typeof User = await User.findOne({ _id: modId })
            if (!moderator) {
                return next(new NotFoundException(ErrorMessages.USER_404))
            }
            if (!group.moderators.includes(moderator._id)) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: "User not on the moderators list." }
                ))

            }
            group.moderators = group.moderators.filter((mod: ObjectId) => mod.toString() !== moderator._id.toString())
            await group.save()
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async removeModerators() { }

    public async addMember(req: Request, res: Response, next: NextFunction) {
        const { groupId, memberId } = req.params

        if (!groupId) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'ID missing.' }))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (req.user._id.toString() !== group.admin.toString()) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            const newMember = await User.findOne({ _id: memberId })
            if (!newMember) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: 'User you want to add as a member does not exist.' }
                ))
            }
            if (group.members.includes(newMember._id)) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: "User is already a member of this group." }
                ))
            }
            group.moderators.push(memberId)
            await group.save()
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, memberId } = req.params

        if (!groupId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'ID missing.' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (req.user._id.toString() !== group.admin.toString()) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: "You are not admin of this gruop." }
                ))
            }
            const member: typeof User = await User.findOne({ _id: memberId })
            if (!member) {
                return next(new NotFoundException(ErrorMessages.USER_404))
            }
            if (!group.members.includes(member._id)) {
                return next(new NotFoundException(
                    ErrorMessages.USER_404,
                    { reason: "User not on the moderators list." }
                ))

            }
            group.members = group.members.filter((mmbr: ObjectId) => mmbr.toString() !== member._id.toString())
            await group.save()
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async addMembers() { }

    public async leaveGroup(req: Request, res: Response, next: NextFunction): Promise<void> { 
        const {groupId, memberId } = req.params

        if ( !groupId || !memberId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST, 
                { reason: 'Group or member ID does not exist.'}
            ))
        }
        try {
            const group = await Group.findOne({_id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            const member = await User.findOne({_id: memberId })
            if (!member) {
                return next(new NotFoundException(ErrorMessages.USER_404))
            }
            if (!group.members.includes(member._id) && group.moderators.includes(member._id)) {
                return next(new BadRequestException(
                    ErrorMessages.USER_404, 
                    { reason: 'User is not part of this group.'}
                ))
            }
            group.members = group.members.filter((mmbr: ObjectId) => mmbr.toString() !== member._id.toString())
            group.moderators = group.moderators.filter((mmbr: ObjectId) => mmbr.toString() !== member._id.toString())
            await group.save()
            res.send({ group })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

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