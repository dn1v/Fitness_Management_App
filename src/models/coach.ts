import { Schema } from "mongoose";
import { ICoach } from "../interfaces/coach.interface";
import { User } from "./user";

const coachSchema: Schema<ICoach> = new Schema({
    position: {
        type: String,
        required: true
    },
    role: {
        type: String,
        trim: true,
        validate(value: string) {
            if (value !== 'Coach') {
                throw new Error("Role property must be 'Coach'.")
            }
        }
    },
    athletes: [{
        type: Schema.Types.ObjectId,
        ref: 'Athlete'
    }],
    pending: [{
        type: Schema.Types.ObjectId,
        ref: 'Athlete'
    }]
})

export const Coach = User.discriminator<ICoach>('Coach', coachSchema)