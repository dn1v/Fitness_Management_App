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
        default: 'Athlete',
        validate(value: string) {
            if (value !== 'Athlete') {
                throw new Error("Role property must be 'athlete'.")
            }
        }
    },
    sport: {
        type: String,
    },
    coaches: [{
        type: Schema.Types.ObjectId,
        ref: 'Coach'
    }],
    pending: [{
        type: Schema.Types.ObjectId,
        ref: 'Coach'
    }]
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

// athleteSchema.methods.toJSON = function () {
//     const user = this.toObject()
//     delete user.coaches
//     return user
// }

export const Athlete = User.discriminator<IAthlete>("Athlete", athleteSchema)