import { ObjectId } from "mongoose";

export interface IPost extends Document {
    _id: ObjectId
    authorId: ObjectId
    groups: ObjectId[]
    users: ObjectId[]
    isGeneral: boolean
    title: string
    content: string
    url: string
    excelFile: Buffer
    pdfFile: Buffer
    seen: ObjectId[]
    createdAt: Date
    updatedAt: Date
}