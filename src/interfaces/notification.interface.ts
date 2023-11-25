import { ObjectId } from "mongoose";

export interface INotifications extends Document {
    _id: ObjectId,
    recipientId: ObjectId[];
    initiatorId: ObjectId;
    message: string;
    readStatus: boolean; 
    model: string;
}