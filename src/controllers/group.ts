import { Request, Response, NextFunction } from "express";
import { Group } from "../models/group";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { ForbiddenException } from "../exceptions/forbiddenException";
import { User } from "../models/user";
import { ObjectId } from "mongoose";
import { ObjectId as ID } from 'mongodb';

export class GroupController {

    constructor() {
        this.createGroup = this.createGroup.bind(this)
        this.updateGroup = this.updateGroup.bind(this)
        this.readGroup = this.readGroup.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.addModerator = this.addModerator.bind(this)
        this.removeModerator = this.removeModerator.bind(this)
        this.addMember = this.addMember.bind(this)
        this.removeMember = this.removeMember.bind(this)
        this.leaveGroup = this.leaveGroup.bind(this)
    }

    public async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        const { _id } = req.user
        console.log(_id)
        try {
            // const groups = await Group.find({ admin })
            const groups = await Group.find({
                $or: [
                    { admin: _id },
                    { moderators: _id }
                ]
            })
            res.send({ groups })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId } = req.params
        if (this.isNotValidGroupId(groupId, next)) return
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async updateGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const fields = Object.keys(req.body)
        const { groupId } = req.params
        if (this.isNotValidGroupId(groupId, next)) return
        try {
            const group = await Group.findOne({ _id: groupId })
            console.log('user: ', req.user._id)
            console.log('admin:', group.admin)
            if (this.noGroup(group, next)) return
            if (this.isForbidden(req.user, group, next)) return
            fields.forEach((field: string) => group[field] = req.body[field])
            await group.save()
            res.send({ group })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId } = req.params
        if (this.isNotValidGroupId(groupId, next)) return
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            if (this.isForbidden(req.user, group, next)) return
            await Group.deleteOne({ _id: groupId })
            res.send({ message: 'Group deleted.' })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async addModerator(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, newModId: modId } = req.params

        if (!ID.isValid(groupId) || !ID.isValid(modId)) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Invalid ID(s).' }))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            if (this.isForbidden(req.user, group, next)) return
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
        if (!ID.isValid(groupId) || !ID.isValid(modId)) {
            return next(new BadRequestException(ErrorMessages.BAD_REQUEST, { reason: 'Invalid ID(s).' }))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            if (this.isForbidden(req.user, group, next)) return
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

        if (!ID.isValid(groupId) || !ID.isValid(memberId)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid ID(s).' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            if (this.isForbidden(req.user, group, next)) return
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

        if (!ID.isValid(groupId) || !ID.isValid(memberId)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid ID(s).' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            if (this.isForbidden(req.user, group, next)) return
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
        const { groupId, memberId } = req.params

        if (!ID.isValid(groupId) || !ID.isValid(memberId)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid ID(s).' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (this.noGroup(group, next)) return
            const member = await User.findOne({ _id: memberId })
            if (!member) {
                return next(new NotFoundException(ErrorMessages.USER_404))
            }
            if (!group.members.includes(member._id) && group.moderators.includes(member._id)) {
                return next(new BadRequestException(
                    ErrorMessages.USER_404,
                    { reason: 'User is not part of this group.' }
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

    private noGroup(group: typeof Group, next: NextFunction): boolean {
        if (!group) {
            next(new NotFoundException(ErrorMessages.GROUP_404))
            return true
        }
        return false
    }

    private isNotValidGroupId(groupId: string, next: NextFunction): boolean {
        if (!ID.isValid(groupId)) {
            next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Invalid group ID.' }
            ))
            return true
        }
        return false
    }

    private isForbidden(user: typeof User, group: typeof Group, next: NextFunction): boolean {
        if (user._id.toString() !== group.admin.toString()) {
            next(new ForbiddenException(
                ErrorMessages.FORBIDDEN,
                { reason: "You are not admin of this gruop." }
            ))
            return true
        }
        return false
    }
}