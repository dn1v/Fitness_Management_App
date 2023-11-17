import { ObjectId } from "mongoose";
import { IUser } from "./user.interface";

export interface IAthlete extends IUser {
    dateOfBirth?: Date;
    sport?: string;
    coaches?: ObjectId[];
    pending?: ObjectId[];
}