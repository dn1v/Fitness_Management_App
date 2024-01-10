import { Request, Response, NextFunction } from "express";
import { Group } from "../models/group";
import { BadRequestException } from "../exceptions/badRequestException";
import { ErrorMessages } from "../constants/errorMessages";
import { HttpException } from "../exceptions/httpExceptions";
import { NotFoundException } from "../exceptions/notFoundException";
import { ForbiddenException } from "../exceptions/forbiddenException";
import { User } from "../models/user";
import { Post } from "../models/post";
import { Roles } from "../constants/roles";
import { ObjectId } from 'mongodb'

export class PostController {

    constructor() {
        this.updatePost = this.updatePost.bind(this)
        this.deletePost = this.deletePost.bind(this)
        this.readGroupPost = this.readGroupPost.bind(this)
        this.readGroupPosts = this.readGroupPosts.bind(this)
    }

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
        if (this.noGroupId(groupId, next)) return
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
        if (!ObjectId.isValid(groupId) || !ObjectId.isValid(postId)) {
            return next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: 'Group or post ID not provided.' }
            ))
        }
        try {
            const group = await Group.findOne({ _id: groupId })
            const post = await Post.findOne({ _id: postId })
            if (this.noGroup(group, next)) return
            if (this.noPost(post, next)) return
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
        const fields = Object.keys(req.body)
        if (this.noPostId(postId, next)) return
        try {
            const post = await Post.findOne({ _id: postId })
            if (this.noPost(post, next)) return
            if (this.isForbidden(post, req.user, next)) return
            fields.forEach((field: string) => post[field] = req.body[field])
            await post.save()
            res.send({ post })
        } catch (e) {
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    public async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { postId } = req.params
        if (this.noPostId(postId, next)) return
        try {
            const post = await Post.findOne({ _id: postId })
            if (this.noPost(post, next)) return
            if (this.isForbidden(post, req.user, next)) return
            await Post.deleteOne({ _id: postId })
            res.send({ message: 'Post deleted.' })
        } catch (e) {
            console.error(e)
            next(new HttpException(500, ErrorMessages.INTERNAL_SERVER_ERROR))
        }
    }

    private noPost(post: typeof Post, next: NextFunction) {
        if (!post) {
            next(new NotFoundException(ErrorMessages.POST_404))
            return true
        }
        return false
    }

    private noGroup(group: typeof Group, next: NextFunction) {
        if (!group) {
            next(new NotFoundException(ErrorMessages.GROUP_404))
            return true
        }
        return false
    }

    private noPostId(postId: string, next: NextFunction) {
        if (!postId || !ObjectId.isValid(postId)) {
            next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: "Post ID not provided or invalid." }
            ))
            return true
        }
        return false
    }

    private noGroupId(groupId: string, next: NextFunction) {
        if (!groupId|| !ObjectId.isValid(groupId)) {
            next(new BadRequestException(
                ErrorMessages.BAD_REQUEST,
                { reason: "Post ID not provided or invalid." }
            ))
            return true
        }
        return false
    }

    private isForbidden(post: typeof Post, user: typeof User, next: NextFunction) {
        if (user._id.toString() !== post.authorId.toString()) {
            next(new ForbiddenException(
                ErrorMessages.FORBIDDEN,
                { reason: 'You are not the author of this post.' }
            ))
            return true
        }
        return false
    }
}