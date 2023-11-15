import { ObjectId } from "mongoose";
import { IUser } from "./user.interface";

export interface ICoach extends IUser {
    position?: string;
    athletes?: ObjectId[];
    pending?: ObjectId[]
}