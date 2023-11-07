import { ObjectId } from "mongoose";
import { Role } from "../@types/user";

export interface IUser extends Document {
    _id: ObjectId
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role
    tokens: { token: string }[]
    profilePhoto?: Buffer;
    generateToken(): Promise<string>;
    credentialsCheck(email: string, password: string): Promise<IUser | null>;
}