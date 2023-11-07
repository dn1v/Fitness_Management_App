import { Schema } from "mongoose";
import { ICoach } from "../interfaces/coach.interface";
import { User } from "./user";

const coachSchema: Schema<ICoach> = new Schema({
    position: {
        type: String,
        required: true
    }
})

export const Coach = User.discriminator<ICoach>('Coach', coachSchema)