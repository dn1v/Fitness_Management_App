import { Request, Response, NextFunction } from "express";
import { Group } from "../models/group";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { ForbiddenException } from "../exceptions/forbiddenException";
import { User } from "../models/user";
import { ObjectId } from "mongoose";
import { Post } from "../models/post";
import { Roles } from "../constants/roles";

export class PostController {

    public async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        const post = new Post({ authorId: req.user._id, ...req.body })
        try {
            const groupsToUpdate: string[] = []
            if (req.body.groups?.length) {
                post.isGeneral = false
                const groups = await Group.find({ _id: { $in: req.body.groups } })
                if (groups.length !== req.body.groups.length) {
                    return next(new BadRequestException(
                        ErrorMessages.BAD_REQUEST,
                        { reason: "One or more groups doesn't exist." }
                    ))
                }
                groups.forEach((group: typeof Group) => {
                    const isAdmin = group.admin.toString() === req.user._id.toString();
                    const isModerator = group.moderators.includes(req.user._id);
                    if (!isAdmin && !isModerator) {
                        return next(new ForbiddenException(
                            ErrorMessages.FORBIDDEN,
                            { reason: "You don't have admin or moderator access for one or more specified groups." }
                        ))
                    }
                    groupsToUpdate.push(group._id)
                });
            } else {
                post.users = req.user.connections
            }
            await Group.updateMany(
                { _id: { $in: groupsToUpdate } },
                { $addToSet: { posts: post._id } }
            )
            await post.save()
            res.status(201).send({ post })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    private isAdOrMod(user: typeof User, next: NextFunction) {
        if (user.__t !== Roles.COACH) {
            next(new ForbiddenException(
                ErrorMessages.FORBIDDEN,
                { reason: "Role: " + user.__t }
            ))
            return true
        }
        return false
    }

    public async readGeneralPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const posts = await Post.find({
                authorId: { $in: [req.user._id, ...req.user.connections] },
                isGeneral: true
            })
            res.send({ posts })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readGroupPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId } = req.params
        if (!groupId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Group ID not provided.' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            await group.populate({
                path: 'posts'
            })
            res.send({ posts: group.posts })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async readGroupPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { groupId, postId } = req.params
        if (!groupId || !postId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Group or post ID not provided.' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            const post = await Post.findOne({ _id: postId })
            if (!group) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (!post) {
                return next(new NotFoundException(ErrorMessages.GROUP_404))
            }
            if (!group.posts.includes(post._id)) {
                return next(new BadRequestException(
                    ErrorMessages.BAD_REQUEST,
                    { reason: 'Post is not the part of the specified group.' }
                ))
            }
            res.send({ post })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { postId } = req.params

        if (!postId) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: "Post ID not provided." }
            ))
        }
        try {
            const post = await Post.findOne({ _id: postId })
            if (!post) {
                return next(new NotFoundException(ErrorMessages.POST_404))
            }
            if (req.user._id.toString() !== post.authorId.toString()) {
                return next(new ForbiddenException(
                    ErrorMessages.FORBIDDEN,
                    { reason: 'You are not the author of this post.' }
                ))
            }
            
        } catch (e) {

        }
    }

    public async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
}