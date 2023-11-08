import { Schema } from "mongoose";
import { IAthlete } from "../interfaces/athlete.interface";
import { User } from "./user";

const athleteSchema: Schema<IAthlete> = new Schema({
    dateOfBirth: {
        type: Date,
    },
    role: {
        type: String,
        required: true,
        default: 'athlete',
        validate(value: string) {
            if (value !== 'athlete') {
                throw new Error("Role property must be 'athlete'.")
            }
        }
    }, 
    sport: {
        type: String,
    },
}, {
    timestamps: true
})

athleteSchema.virtual('sRPE', {
    ref: 'SessionRPE',
    localField: '_id',
    foreignField: 'owner'
})

athleteSchema.virtual('pomsQ', {
    ref: 'POMS', 
    localField: '_id', 
    foreignField: 'owner'
})

export const Athlete = User.discriminator<IAthlete>("Athlete", athleteSchema)