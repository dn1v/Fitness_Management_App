import mongoose, { Schema } from "mongoose";
import { INotifications } from "../interfaces/notification.interface";

const notificationSchema: Schema<INotifications> = new Schema({
    recipientId: [{
        type: Schema.Types.ObjectId,
        required: true
    }],
    initiatorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    model: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const Notification = mongoose.model<INotifications>('Notification', notificationSchema)