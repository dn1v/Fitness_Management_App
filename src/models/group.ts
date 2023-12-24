import mongoose, { Schema } from "mongoose";
import { IGroup } from "../interfaces/group.interface";

const groupSchema: Schema<IGroup> = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        required: true
    },
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    about: {
        type: String,
        trim: true,
    },
    showMembers: {
        type: Boolean,
        default: true
    },
    showModerators: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export const Group = mongoose.model<IGroup>('Group', groupSchema)