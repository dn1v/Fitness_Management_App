import { Schema } from "mongoose";
import { IAthlete } from "../interfaces/athlete.interface";
import { User } from "./user";

const athleteSchema: Schema<IAthlete> = new Schema({
    dateOfBirth: {
        type: Date,
    },
    sport: {
        type: String,
    }
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