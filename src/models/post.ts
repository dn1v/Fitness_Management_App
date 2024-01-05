import mongoose, { Schema } from "mongoose";
import { IPost } from "../interfaces/post.interface";

const postSchema: Schema<IPost> = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    isGeneral: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        trim: true
    },
    excelFile: {
        type: Buffer
    },
    pdfFile: {
        type: Buffer
    },
    seen: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
})

export const Post = mongoose.model<IPost>('Post', postSchema)