import { ObjectId } from "mongoose";

export interface IPost extends Document {
    _id: ObjectId
    authorId: ObjectId
    groups: ObjectId[]
    isGeneral: boolean
    title: string
    content: string
    seen: ObjectId[]
    createdAt: Date
    updatedAt: Date
}