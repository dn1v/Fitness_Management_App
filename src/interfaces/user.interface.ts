import { ObjectId } from "mongoose";

export interface IUser extends Document {
    _id: ObjectId
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    sentReqs?: ObjectId[];
    receivedReqs?: ObjectId[];
    coaches?: ObjectId[];
    athletes?: ObjectId[];
    connections?: ObjectId[];
    pending?: ObjectId[];
    tokens: { token: string }[];
    profilePhoto?: Buffer;
    generateToken(): Promise<string>;
    credentialsCheck(email: string, password: string): Promise<IUser | null>;
}