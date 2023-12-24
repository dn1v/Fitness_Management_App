import { ObjectId } from "mongoose";

export interface IGroup extends Document {
    _id: ObjectId
    admin: ObjectId
    moderators: ObjectId[]
    members: ObjectId[]
    posts: ObjectId[]
    about: string
    showMembers: boolean
    showModerators: boolean
    createdAt: Date
    updatedAt: Date
}