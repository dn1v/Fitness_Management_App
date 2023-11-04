import { ObjectId } from "mongoose";

export interface IAthlete extends Document {
    _id: ObjectId
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    height?: number;
    weight?: number;
    age?: number;
    tokens: { token: string }[]
    profilePhoto?: Buffer;
    generateToken(): Promise<string>;
    credentialsCheck(email: string, password: string): Promise<IAthlete | null>;
}