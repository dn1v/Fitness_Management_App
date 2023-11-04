import { ObjectId } from "mongoose";
import { Document } from "mongoose";

export interface ISessionRPE extends Document {
    owner: ObjectId,
    trainingType: string,
    duration: number,
    sRPE: number,
    trainingLoad: number,
}