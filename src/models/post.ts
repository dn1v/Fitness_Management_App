import mongoose, { Schema } from "mongoose";
import { IExcelMetadata, IPost } from "../interfaces/post.interface";

const excelFileMetadata: Schema<IExcelMetadata> = new Schema({
    fileName: {
        type: String,
        // required: true,
    },
    fileSize: {
        type: Number,
        // required: true,
    },
})

const postSchema: Schema<IPost> = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
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
    excelFileMetadata: {
        type: excelFileMetadata
    },
    pdfFile: {
        type: Buffer
    },
}, {
    timestamps: true
})

postSchema.methods.toJSON = function () {
    const post = this.toObject()
    delete post.excelFile
    delete post.pdfFile
    return post
}

export const Post = mongoose.model<IPost>('Post', postSchema)